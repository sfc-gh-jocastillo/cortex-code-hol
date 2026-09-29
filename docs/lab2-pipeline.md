---
sidebar_position: 4
title: "Lab 2: Pipeline con Dynamic Tables + Cortex AI"
---

# Lab 2: Pipeline con Dynamic Tables + Cortex AI

**Duracion:** 60 minutos

En este lab vas a construir un pipeline incremental con Dynamic Tables que enriquece datos de reviews usando funciones de Cortex AI.

## Pipeline objetivo

```
raw_reviews_clientes ──► dt_reviews_enriquecidas (SENTIMENT + CLASSIFY)
                                    │
raw_ordenes + productos + clientes ──► dt_ventas_detalle
                                    │
                          dt_dashboard_consolidado (+ AI_COMPLETE)
```

## Parte 1: Introduccion a Dynamic Tables (10 min)

Una **Dynamic Table** es una tabla que Snowflake mantiene actualizada automaticamente basandose en un query SQL que defines.

| Parametro | Descripcion |
|---|---|
| `TARGET_LAG` | Que tan fresca debe estar la data (ej: `1 hour`) |
| `WAREHOUSE` | Warehouse para ejecutar los refreshes |

:::info Ventajas
- Snowflake decide **cuando** hacer refresh (solo si los datos fuente cambiaron)
- Pipeline **declarativo**: defines el QUE, no el COMO ni el CUANDO
- Manejo automatico de **dependencias** entre tablas
:::

## Parte 2: Reviews Enriquecidas con AI (20 min)

Esta Dynamic Table aplica dos funciones de Cortex AI sobre cada review:

```sql
CREATE OR REPLACE DYNAMIC TABLE dt_reviews_enriquecidas
    TARGET_LAG = '1 hour'
    WAREHOUSE = HOL_WH
AS
SELECT
    r.review_id,
    r.orden_id,
    r.cliente_id,
    r.texto_review,
    r.fecha_review,
    r.rating,

    -- Analisis de sentimiento: score entre -1 (negativo) y 1 (positivo)
    SNOWFLAKE.CORTEX.SENTIMENT(r.texto_review) AS sentimiento_score,

    -- Clasificamos el score en categorias
    CASE
        WHEN SNOWFLAKE.CORTEX.SENTIMENT(r.texto_review) > 0.3 THEN 'Positivo'
        WHEN SNOWFLAKE.CORTEX.SENTIMENT(r.texto_review) < -0.3 THEN 'Negativo'
        ELSE 'Neutro'
    END AS sentimiento_label,

    -- Clasificacion del tipo de feedback
    SNOWFLAKE.CORTEX.CLASSIFY_TEXT(
        r.texto_review,
        ['Calidad del Producto', 'Servicio al Cliente',
         'Envio y Logistica', 'Precio y Valor', 'Experiencia de Compra']
    ):label::VARCHAR AS tipo_feedback

FROM raw_reviews_clientes r;
```

### Verificar resultados

```sql
-- Distribucion de sentimiento
SELECT
    sentimiento_label,
    COUNT(*) AS total,
    ROUND(AVG(sentimiento_score), 3) AS score_promedio,
    ROUND(AVG(rating), 1) AS rating_promedio
FROM dt_reviews_enriquecidas
GROUP BY sentimiento_label
ORDER BY total DESC;

-- Distribucion por tipo de feedback
SELECT
    tipo_feedback,
    COUNT(*) AS total,
    ROUND(AVG(sentimiento_score), 3) AS sentimiento_promedio,
    ROUND(AVG(rating), 1) AS rating_promedio
FROM dt_reviews_enriquecidas
GROUP BY tipo_feedback
ORDER BY total DESC;
```

## Parte 3: Ventas Detalle (15 min)

```sql
CREATE OR REPLACE DYNAMIC TABLE dt_ventas_detalle
    TARGET_LAG = '1 hour'
    WAREHOUSE = HOL_WH
AS
SELECT
    o.orden_id, o.fecha_orden, o.cantidad, o.monto_total, o.estado, o.canal,
    c.cliente_id, c.nombre AS cliente_nombre, c.region, c.comuna, c.segmento,
    p.producto_id, p.nombre AS producto_nombre, p.categoria,
    p.precio AS precio_unitario, p.proveedor,
    o.monto_total / NULLIF(o.cantidad, 0) AS precio_promedio_unidad,
    DATE_TRUNC('month', o.fecha_orden) AS mes_orden,
    DAYOFWEEK(o.fecha_orden) AS dia_semana
FROM raw_ordenes o
JOIN raw_clientes c ON o.cliente_id = c.cliente_id
JOIN raw_productos p ON o.producto_id = p.producto_id;
```

## Parte 4: Dashboard Consolidado con AI_COMPLETE (15 min)

Esta DT consolida metricas de ventas + sentimiento y genera un **insight ejecutivo** por categoria usando un LLM:

```sql
CREATE OR REPLACE DYNAMIC TABLE dt_dashboard_consolidado
    TARGET_LAG = '1 hour'
    WAREHOUSE = HOL_WH
AS
WITH metricas_categoria AS (
    SELECT
        v.categoria,
        COUNT(DISTINCT v.orden_id) AS total_ordenes,
        SUM(v.monto_total) AS total_ventas,
        COUNT(DISTINCT v.cliente_id) AS clientes_unicos,
        ROUND(AVG(v.monto_total), 0) AS ticket_promedio
    FROM dt_ventas_detalle v
    WHERE v.estado = 'Completada'
    GROUP BY v.categoria
),
sentimiento_categoria AS (
    SELECT
        p.categoria,
        COUNT(*) AS total_reviews,
        ROUND(AVG(re.sentimiento_score), 3) AS sentimiento_promedio,
        SUM(CASE WHEN re.sentimiento_label = 'Positivo' THEN 1 ELSE 0 END) AS reviews_positivas,
        SUM(CASE WHEN re.sentimiento_label = 'Negativo' THEN 1 ELSE 0 END) AS reviews_negativas,
        ROUND(AVG(re.rating), 1) AS rating_promedio
    FROM dt_reviews_enriquecidas re
    JOIN raw_ordenes o ON re.orden_id = o.orden_id
    JOIN raw_productos p ON o.producto_id = p.producto_id
    GROUP BY p.categoria
)
SELECT
    m.categoria,
    m.total_ordenes,
    m.total_ventas,
    m.clientes_unicos,
    m.ticket_promedio,
    s.total_reviews,
    s.sentimiento_promedio,
    s.reviews_positivas,
    s.reviews_negativas,
    s.rating_promedio,
    SNOWFLAKE.CORTEX.COMPLETE(
        'mistral-large2',
        'Eres un analista de retail. Genera un insight ejecutivo breve '
        || '(maximo 2 oraciones en espanol) para la categoria "'
        || m.categoria || '" con estos datos: '
        || m.total_ordenes || ' ordenes, $' || m.total_ventas::VARCHAR || ' en ventas, '
        || m.clientes_unicos || ' clientes, ticket promedio $' || m.ticket_promedio::VARCHAR || ', '
        || s.total_reviews || ' reviews con sentimiento '
        || s.sentimiento_promedio::VARCHAR || ' (-1 a 1), rating '
        || s.rating_promedio::VARCHAR || '/5. '
        || 'Destaca lo mas relevante y sugiere una accion concreta.'
    ) AS insight_ai
FROM metricas_categoria m
LEFT JOIN sentimiento_categoria s ON m.categoria = s.categoria;
```

### Ver los insights generados

```sql
SELECT categoria, insight_ai
FROM dt_dashboard_consolidado
ORDER BY total_ventas DESC;
```

## Verificacion del Pipeline

```sql
SHOW DYNAMIC TABLES IN SCHEMA HOL_CORTEX_CODE.RETAIL;
```

| Dynamic Table | Fuentes |
|---|---|
| `dt_reviews_enriquecidas` | raw_reviews_clientes |
| `dt_ventas_detalle` | raw_ordenes, raw_clientes, raw_productos |
| `dt_dashboard_consolidado` | dt_reviews_enriquecidas, dt_ventas_detalle |

:::tip Historial de refreshes
```sql
SELECT *
FROM TABLE(INFORMATION_SCHEMA.DYNAMIC_TABLE_REFRESH_HISTORY())
WHERE NAME IN ('DT_REVIEWS_ENRIQUECIDAS', 'DT_VENTAS_DETALLE', 'DT_DASHBOARD_CONSOLIDADO')
ORDER BY REFRESH_END_TIME DESC
LIMIT 20;
```
:::

Estas Dynamic Tables alimentaran el dashboard de Streamlit en el **Lab 3**.

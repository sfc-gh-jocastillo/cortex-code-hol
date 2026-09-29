---
sidebar_position: 3
title: "Lab 1: Ingestion y Transformacion"
---

# Lab 1: Ingestion y Transformacion con AI

**Duracion:** 60 minutos

En este lab vas a usar Cortex Code para explorar los datos cargados desde S3 y crear transformaciones de forma acelerada con asistencia de AI.

## Parte 1: Exploracion de Datos (15 min)

### Verificar las tablas

```sql
USE DATABASE HOL_CORTEX_CODE;
USE SCHEMA RETAIL;
USE WAREHOUSE HOL_WH;

SELECT 'raw_clientes' AS tabla, COUNT(*) AS filas FROM raw_clientes
UNION ALL
SELECT 'raw_productos', COUNT(*) FROM raw_productos
UNION ALL
SELECT 'raw_ordenes', COUNT(*) FROM raw_ordenes
UNION ALL
SELECT 'raw_reviews_clientes', COUNT(*) FROM raw_reviews_clientes;
```

### Explorar con Cortex Code

Escribe en el chat de Cortex Code:

> "Muestrame la distribucion de clientes por region y segmento"

Cortex Code generara el query automaticamente. Observa como entiende el esquema de tus tablas.

### Ejercicios de exploracion

Pide a Cortex Code que te ayude con estos analisis:

```sql
-- Distribucion de clientes por region
SELECT region, COUNT(*) AS total_clientes
FROM raw_clientes
GROUP BY region
ORDER BY total_clientes DESC;

-- Categorias de productos con precios
SELECT
    categoria,
    COUNT(*) AS total_productos,
    ROUND(AVG(precio), 0) AS precio_promedio,
    MIN(precio) AS precio_min,
    MAX(precio) AS precio_max
FROM raw_productos
GROUP BY categoria
ORDER BY precio_promedio DESC;

-- Estado de ordenes
SELECT estado, COUNT(*) AS total,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM raw_ordenes
GROUP BY estado
ORDER BY total DESC;
```

## Parte 2: Transformaciones con AI-Assist (25 min)

### Metricas por cliente

Pide a Cortex Code:

> "Calcula para cada cliente: total gastado, numero de ordenes completadas, ticket promedio, primera y ultima compra"

```sql
SELECT
    c.cliente_id,
    c.nombre,
    c.region,
    c.segmento,
    COUNT(DISTINCT o.orden_id) AS total_ordenes,
    SUM(o.monto_total) AS total_gastado,
    ROUND(AVG(o.monto_total), 2) AS ticket_promedio,
    MIN(o.fecha_orden) AS primera_compra,
    MAX(o.fecha_orden) AS ultima_compra,
    DATEDIFF('day', MIN(o.fecha_orden), MAX(o.fecha_orden)) AS dias_como_cliente
FROM raw_clientes c
LEFT JOIN raw_ordenes o ON c.cliente_id = o.cliente_id
WHERE o.estado = 'Completada'
GROUP BY c.cliente_id, c.nombre, c.region, c.segmento
ORDER BY total_gastado DESC;
```

### Top 10 productos

```sql
SELECT
    p.nombre AS producto,
    p.categoria,
    COUNT(DISTINCT o.orden_id) AS veces_vendido,
    SUM(o.cantidad) AS unidades_vendidas,
    SUM(o.monto_total) AS ingresos_totales
FROM raw_ordenes o
JOIN raw_productos p ON o.producto_id = p.producto_id
WHERE o.estado = 'Completada'
GROUP BY p.nombre, p.categoria
ORDER BY ingresos_totales DESC
LIMIT 10;
```

### Tendencia mensual

```sql
SELECT
    DATE_TRUNC('month', fecha_orden) AS mes,
    COUNT(DISTINCT orden_id) AS ordenes,
    SUM(monto_total) AS ventas_totales,
    COUNT(DISTINCT cliente_id) AS clientes_unicos
FROM raw_ordenes
WHERE estado = 'Completada'
GROUP BY mes
ORDER BY mes;
```

## Parte 3: Crear Vistas para el Pipeline (20 min)

### Vista de ordenes enriquecidas

```sql
CREATE OR REPLACE VIEW v_ordenes_enriquecidas AS
SELECT
    o.orden_id, o.fecha_orden, o.cantidad, o.monto_total, o.estado, o.canal,
    c.cliente_id, c.nombre AS cliente_nombre, c.region, c.comuna, c.segmento,
    p.producto_id, p.nombre AS producto_nombre, p.categoria,
    p.precio AS precio_unitario, p.proveedor
FROM raw_ordenes o
JOIN raw_clientes c ON o.cliente_id = c.cliente_id
JOIN raw_productos p ON o.producto_id = p.producto_id;
```

### Vista de metricas por cliente

```sql
CREATE OR REPLACE VIEW v_metricas_clientes AS
SELECT
    c.cliente_id, c.nombre, c.email, c.region, c.comuna, c.segmento, c.fecha_registro,
    COUNT(DISTINCT CASE WHEN o.estado = 'Completada' THEN o.orden_id END) AS ordenes_completadas,
    COUNT(DISTINCT CASE WHEN o.estado = 'Cancelada' THEN o.orden_id END) AS ordenes_canceladas,
    COALESCE(SUM(CASE WHEN o.estado = 'Completada' THEN o.monto_total END), 0) AS total_gastado,
    ROUND(AVG(CASE WHEN o.estado = 'Completada' THEN o.monto_total END), 2) AS ticket_promedio,
    MAX(o.fecha_orden) AS ultima_compra,
    DATEDIFF('day', MAX(o.fecha_orden), CURRENT_DATE()) AS dias_sin_comprar
FROM raw_clientes c
LEFT JOIN raw_ordenes o ON c.cliente_id = o.cliente_id
GROUP BY c.cliente_id, c.nombre, c.email, c.region, c.comuna, c.segmento, c.fecha_registro;
```

### Vista de resumen de ventas

```sql
CREATE OR REPLACE VIEW v_resumen_ventas AS
SELECT
    DATE_TRUNC('month', o.fecha_orden) AS mes,
    c.region, p.categoria, o.canal,
    COUNT(DISTINCT o.orden_id) AS total_ordenes,
    SUM(o.monto_total) AS total_ventas,
    COUNT(DISTINCT o.cliente_id) AS clientes_unicos,
    ROUND(AVG(o.monto_total), 2) AS ticket_promedio
FROM raw_ordenes o
JOIN raw_clientes c ON o.cliente_id = c.cliente_id
JOIN raw_productos p ON o.producto_id = p.producto_id
WHERE o.estado = 'Completada'
GROUP BY mes, c.region, p.categoria, o.canal;
```

:::tip Verificacion
```sql
SHOW VIEWS IN SCHEMA HOL_CORTEX_CODE.RETAIL;
```
Deberias tener 3 vistas: `v_ordenes_enriquecidas`, `v_metricas_clientes`, `v_resumen_ventas`.
:::

Estas vistas alimentaran el pipeline de Dynamic Tables en el **Lab 2**.

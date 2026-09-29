---
sidebar_position: 4
title: "Lab 2: Pipeline con Dynamic Tables + Cortex AI"
---

# Lab 2: Pipeline con Dynamic Tables + Cortex AI

**Duracion:** 60 minutos

En este lab vas a construir un pipeline incremental de 3 capas usando Dynamic Tables y funciones de Cortex AI. Todo via prompts.

## Pipeline objetivo

```
raw_reviews_clientes ──► dt_reviews_enriquecidas (SENTIMENT + CLASSIFY)
                                    │
raw_ordenes + productos + clientes ──► dt_ventas_detalle
                                    │
                          dt_dashboard_consolidado (+ AI_COMPLETE)
```

---

## Parte 1: Entender Dynamic Tables (10 min)

Antes de crear el pipeline, preguntale a Cortex Code:

<div class="prompt-block">
Explicame que es una Dynamic Table en Snowflake, que significa el parametro TARGET_LAG, y por que es mejor que una combinacion de CTAS + Task para crear pipelines incrementales.
</div>

<div class="expected-result">
Explicarte el concepto de Dynamic Tables, TARGET_LAG, y las ventajas del enfoque declarativo vs imperativo.
</div>

:::info Concepto clave
Una Dynamic Table se refresca automaticamente solo cuando los datos fuente cambian. Tu defines el **QUE** (un query SQL), y Snowflake se encarga del **CUANDO** y el **COMO**.
:::

---

## Parte 2: Reviews Enriquecidas con AI (20 min)

Esta es la Dynamic Table mas interesante. Toma las reviews crudas y les agrega inteligencia artificial.

### Crear la Dynamic Table

<div class="prompt-block">
Crea una dynamic table llamada dt_reviews_enriquecidas con target_lag de 1 hora usando el warehouse HOL_WH. La tabla debe tomar todas las columnas de raw_reviews_clientes y agregarle:

1. Una columna sentimiento_score usando SNOWFLAKE.CORTEX.SENTIMENT sobre el texto_review
2. Una columna sentimiento_label que diga 'Positivo' si el score es mayor a 0.3, 'Negativo' si es menor a -0.3, y 'Neutro' en otro caso
3. Una columna tipo_feedback usando SNOWFLAKE.CORTEX.CLASSIFY_TEXT sobre el texto_review con estas categorias: 'Calidad del Producto', 'Servicio al Cliente', 'Envio y Logistica', 'Precio y Valor', 'Experiencia de Compra'. Extrae solo el label como VARCHAR.
</div>

<div class="expected-result">
Generar y ejecutar un CREATE DYNAMIC TABLE que aplica AI_SENTIMENT y CLASSIFY_TEXT sobre cada review.
</div>

:::caution Tiempo de ejecucion
El primer refresh puede tomar 1-2 minutos porque Cortex AI procesa las 500 reviews. Es normal.
:::

### Explorar los resultados

<div class="prompt-block">
Muestrame la distribucion de sentimiento: cuantas reviews hay por cada sentimiento_label, con el score promedio y el rating promedio.
</div>

<div class="prompt-block">
Cuantas reviews hay por cada tipo de feedback? Incluye el sentimiento promedio y rating promedio de cada tipo. Cual tiene el peor sentimiento?
</div>

### Comparar AI vs Rating humano

<div class="prompt-block">
Muestrame las 5 reviews con la mayor diferencia entre el sentimiento predicho por AI y el rating del cliente. Por ejemplo, reviews con rating alto pero sentimiento negativo o viceversa.
</div>

<div class="expected-result">
Generar un query que compare sentimiento_score con rating, mostrando los casos mas discrepantes.
</div>

---

## Parte 3: Ventas Detalle (15 min)

### Crear la Dynamic Table

<div class="prompt-block">
Crea una dynamic table llamada dt_ventas_detalle con target_lag de 1 hora usando HOL_WH. Debe hacer JOIN de raw_ordenes con raw_clientes y raw_productos, trayendo los campos principales de cada tabla. Ademas agrega columnas calculadas: precio promedio por unidad, mes de la orden (truncado a mes) y dia de la semana.
</div>

<div class="expected-result">
Generar y ejecutar un CREATE DYNAMIC TABLE con los JOINs y columnas calculadas.
</div>

### Analizar

<div class="prompt-block">
Usando dt_ventas_detalle, muestrame las top 5 regiones por ventas completadas con su ticket promedio y cantidad de clientes unicos.
</div>

<div class="prompt-block">
Cual es el canal de venta mas popular (Web, Tienda, App) por cada categoria de producto? Muestra las ventas totales de cada combinacion.
</div>

---

## Parte 4: Dashboard Consolidado con AI_COMPLETE (15 min)

Esta es la capa Gold del pipeline: combina metricas de ventas y sentimiento, y genera un insight ejecutivo por categoria usando un LLM.

### Crear la Dynamic Table final

<div class="prompt-block">
Crea una dynamic table llamada dt_dashboard_consolidado con target_lag de 1 hora usando HOL_WH. Debe:

1. Calcular metricas de ventas por categoria desde dt_ventas_detalle (solo completadas): total ordenes, total ventas, clientes unicos, ticket promedio

2. Calcular metricas de sentimiento por categoria: total reviews, sentimiento promedio, reviews positivas, reviews negativas, rating promedio. Para esto, haz join de dt_reviews_enriquecidas con raw_ordenes y raw_productos para obtener la categoria.

3. Hacer LEFT JOIN de ambas CTEs por categoria

4. Agregar una columna insight_ai usando SNOWFLAKE.CORTEX.COMPLETE con el modelo 'mistral-large2'. El prompt debe decir: "Eres un analista de retail. Genera un insight ejecutivo breve (maximo 2 oraciones en espanol)" y pasarle todas las metricas de esa categoria. Pide que destaque lo mas relevante y sugiera una accion concreta.
</div>

<div class="expected-result">
Generar y ejecutar un CREATE DYNAMIC TABLE complejo con dos CTEs, JOINs y una llamada a AI_COMPLETE por cada categoria.
</div>

### Leer los insights

<div class="prompt-block">
Muestrame los insights generados por AI para cada categoria, ordenados por ventas totales descendente.
</div>

---

## Verificar el Pipeline Completo

<div class="prompt-block">
Muestrame todas las dynamic tables que existen en el schema RETAIL con su estado actual.
</div>

<div class="expected-result">
Ejecutar SHOW DYNAMIC TABLES y mostrar las 3 DTs con su estado de refresh.
</div>

<div class="prompt-block">
Muestrame el historial de refreshes de las 3 dynamic tables que creamos.
</div>

| Dynamic Table | Fuentes |
|---|---|
| `dt_reviews_enriquecidas` | raw_reviews_clientes |
| `dt_ventas_detalle` | raw_ordenes, raw_clientes, raw_productos |
| `dt_dashboard_consolidado` | dt_reviews_enriquecidas, dt_ventas_detalle |

:::info Siguiente paso
Estas Dynamic Tables alimentaran el dashboard de Streamlit en el **Lab 3**.
:::

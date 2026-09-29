---
sidebar_position: 1
title: Introduccion
---

# Introduccion

En este taller vas a construir un pipeline de datos completo usando **solo lenguaje natural**. No necesitas escribir SQL ni Python: le dices a Cortex Code que hacer y el genera, explica y ejecuta el codigo por ti.

## Como funciona este taller

En cada paso de la guia vas a ver bloques como este:

<div class="prompt-block">
Crea una tabla llamada ejemplo con columnas id y nombre
</div>

<div class="expected-result">
Generar el SQL correspondiente, mostrartelo y ejecutarlo en tu cuenta de Snowflake.
</div>

Tu trabajo es **copiar el prompt** (o escribir algo similar) en el chat de Cortex Code en Snowsight. Cortex Code se encarga del resto.

:::tip Puedes experimentar
Los prompts son sugerencias. Si quieres pedir algo diferente o explorar por tu cuenta, hazlo. Cortex Code entiende lenguaje natural y se adapta a como le hables.
:::

## Que vas a construir

| Paso | Que incluye |
|---|---|
| **Setup** | Warehouse, database, stage S3, carga de datos |
| **Lab 1** | Exploracion de datos, transformaciones, vistas |
| **Lab 2** | Pipeline con Dynamic Tables + AI (Sentiment, Classify, Complete) |
| **Lab 3** | Dashboard interactivo con Streamlit-in-Snowflake |

## Pipeline objetivo

```
S3 Bucket (CSV/Parquet)
    │
    ▼
External Stage ──► COPY INTO ──► Tablas Raw
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            dt_reviews_enriq.  dt_ventas_detalle    │
            (SENTIMENT +       (JOINs + metricas)   │
             CLASSIFY)              │               │
                    └───────────────┼───────────────┘
                                    ▼
                        dt_dashboard_consolidado
                        (+ AI_COMPLETE insights)
                                    │
                                    ▼
                    Streamlit-in-Snowflake Dashboard
```

## Requisitos

- Cuenta Snowflake (trial o existente) con rol `SYSADMIN`
- Acceso a **Cortex Code en Snowsight** (panel de chat AI)
- Navegador web moderno

## Dataset

Datos sinteticos de una tienda de retail con operaciones en Chile:

| Tabla | Filas | Formato | Contenido |
|---|---|---|---|
| `raw_clientes` | 200 | CSV | Clientes con region, comuna, segmento |
| `raw_productos` | 50 | CSV | Productos en 5 categorias |
| `raw_ordenes` | 2,000 | Parquet | Ordenes de los ultimos 12 meses |
| `raw_reviews_clientes` | 500 | Parquet | Reviews en espanol con ratings |

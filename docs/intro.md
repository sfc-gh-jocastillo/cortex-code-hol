---
sidebar_position: 1
title: Introduccion
---

# Introduccion

Esta guia cubre la construccion completa de un pipeline de datos con AI sobre Snowflake, usando **Cortex Code** como IDE asistido por inteligencia artificial.

## Para quien es esta guia

Data Engineers, Analytics Engineers y ML Engineers con experiencia en SQL que quieren aprender a:
- Usar AI para acelerar el desarrollo de pipelines de datos
- Construir pipelines incrementales con Dynamic Tables
- Enriquecer datos con funciones de Cortex AI (Sentiment, Classify, Complete)
- Crear dashboards interactivos con Streamlit-in-Snowflake

## Que vas a construir

| Paso | Que incluye |
|---|---|
| **Setup** | External Stage S3, COPY INTO, 4 tablas raw |
| **Lab 1** | Exploracion con Cortex Code, transformaciones, vistas |
| **Lab 2** | 3 Dynamic Tables con AI_SENTIMENT, AI_CLASSIFY, AI_COMPLETE |
| **Lab 3** | Dashboard Streamlit-in-Snowflake con KPIs e insights AI |

## Pipeline objetivo

```
┌─────────────────────────────────────────────────────────────────┐
│                    SNOWFLAKE PLATFORM                           │
│                                                                 │
│  S3 Bucket ──► External Stage ──► COPY INTO ──► Tablas Raw      │
│  (CSV/Parquet)                                                  │
│                                                                 │
│  raw_reviews ──► dt_reviews_enriquecidas (SENTIMENT + CLASSIFY) │
│                           │                                     │
│  raw_ordenes ──► dt_ventas_detalle (JOINs + metricas)           │
│                           │                                     │
│                  dt_dashboard_consolidado (+ AI_COMPLETE)        │
│                           │                                     │
│                  Streamlit-in-Snowflake Dashboard                │
└─────────────────────────────────────────────────────────────────┘
```

## Requisitos

- Cuenta Snowflake (trial o existente) con rol `SYSADMIN`
- Cortex Code instalado y conectado a tu cuenta
- Navegador web moderno

## Dataset

Datos sinteticos de una tienda de retail con operaciones en Chile:

| Tabla | Filas | Formato | Contenido |
|---|---|---|---|
| `raw_clientes` | 200 | CSV | Clientes con region, comuna, segmento |
| `raw_productos` | 50 | CSV | Productos en 5 categorias |
| `raw_ordenes` | 2,000 | Parquet | Ordenes de los ultimos 12 meses |
| `raw_reviews_clientes` | 500 | Parquet | Reviews en espanol con ratings |

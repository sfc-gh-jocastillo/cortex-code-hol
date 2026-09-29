---
sidebar_position: 2
title: Setup
---

# Setup del Ambiente

Antes de comenzar los labs, necesitas crear el ambiente en Snowflake y cargar los datos desde S3.

## Paso 1: Crear warehouse, database y schema

```sql
USE ROLE SYSADMIN;

CREATE OR REPLACE WAREHOUSE HOL_WH
  WITH WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;

CREATE OR REPLACE DATABASE HOL_CORTEX_CODE;
CREATE SCHEMA HOL_CORTEX_CODE.RETAIL;

USE DATABASE HOL_CORTEX_CODE;
USE SCHEMA RETAIL;
USE WAREHOUSE HOL_WH;
```

## Paso 2: Crear file formats

```sql
CREATE OR REPLACE FILE FORMAT csv_format
  TYPE = 'CSV'
  FIELD_OPTIONALLY_ENCLOSED_BY = '"'
  SKIP_HEADER = 1
  NULL_IF = ('NULL', 'null', '')
  TRIM_SPACE = TRUE;

CREATE OR REPLACE FILE FORMAT parquet_format
  TYPE = 'PARQUET';
```

## Paso 3: Crear tablas raw

```sql
CREATE OR REPLACE TABLE raw_clientes (
    cliente_id    INT,
    nombre        VARCHAR(200),
    email         VARCHAR(200),
    region        VARCHAR(100),
    comuna        VARCHAR(100),
    fecha_registro DATE,
    segmento      VARCHAR(50)
);

CREATE OR REPLACE TABLE raw_productos (
    producto_id  INT,
    nombre       VARCHAR(200),
    categoria    VARCHAR(50),
    precio       DECIMAL(10,2),
    proveedor    VARCHAR(200),
    descripcion  VARCHAR(500)
);

CREATE OR REPLACE TABLE raw_ordenes (
    orden_id     INT,
    cliente_id   INT,
    producto_id  INT,
    cantidad     INT,
    fecha_orden  DATE,
    monto_total  DECIMAL(12,2),
    estado       VARCHAR(50),
    canal        VARCHAR(50)
);

CREATE OR REPLACE TABLE raw_reviews_clientes (
    review_id    INT,
    orden_id     INT,
    cliente_id   INT,
    texto_review VARCHAR(2000),
    fecha_review DATE,
    rating       INT
);
```

## Paso 4: Cargar datos desde S3

Los datos estan almacenados en un bucket S3 compartido. El instructor ya configuro la Storage Integration y el External Stage.

```sql
-- Clientes (CSV)
COPY INTO raw_clientes
FROM @HOL_SHARED.STAGES.STG_S3_RETAIL/clientes/
FILE_FORMAT = csv_format
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;

-- Productos (CSV)
COPY INTO raw_productos
FROM @HOL_SHARED.STAGES.STG_S3_RETAIL/productos/
FILE_FORMAT = csv_format
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;

-- Ordenes (Parquet)
COPY INTO raw_ordenes
FROM @HOL_SHARED.STAGES.STG_S3_RETAIL/ordenes/
FILE_FORMAT = parquet_format
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;

-- Reviews (Parquet)
COPY INTO raw_reviews_clientes
FROM @HOL_SHARED.STAGES.STG_S3_RETAIL/reviews/
FILE_FORMAT = parquet_format
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;
```

## Paso 5: Verificar la carga

```sql
SELECT 'raw_clientes' AS tabla, COUNT(*) AS filas FROM raw_clientes
UNION ALL
SELECT 'raw_productos', COUNT(*) FROM raw_productos
UNION ALL
SELECT 'raw_ordenes', COUNT(*) FROM raw_ordenes
UNION ALL
SELECT 'raw_reviews_clientes', COUNT(*) FROM raw_reviews_clientes;
```

Deberias ver:

| tabla | filas |
|---|---|
| raw_clientes | 200 |
| raw_productos | 50 |
| raw_ordenes | 2,000 |
| raw_reviews_clientes | 500 |

:::tip Vista rapida
Ejecuta `SELECT * FROM raw_reviews_clientes LIMIT 5;` para ver las reviews en espanol que luego analizaremos con AI.
:::

:::caution Permisos de Cortex AI
Si las funciones de Cortex AI retornan error, ejecuta:
```sql
USE ROLE ACCOUNTADMIN;
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE SYSADMIN;
USE ROLE SYSADMIN;
```
:::

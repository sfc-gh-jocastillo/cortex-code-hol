---
sidebar_position: 2
title: Setup
---

# Setup del Ambiente

En este paso vas a preparar tu ambiente de Snowflake usando Cortex Code. Todo se hace con prompts en lenguaje natural.

## Paso 1: Crear la infraestructura

Abre Cortex Code en Snowsight y escribe:

<div class="prompt-block">
Usando el rol SYSADMIN, crea un warehouse llamado HOL_WH de tamano XSMALL con auto-suspend en 60 segundos y auto-resume activado. Luego crea una base de datos HOL_CORTEX_CODE con un schema llamado RETAIL. Posicionate en esa base de datos y schema.
</div>

<div class="expected-result">
Crear el warehouse, la base de datos y el schema. Ejecutar USE DATABASE y USE SCHEMA para posicionarte.
</div>

## Paso 2: Crear los file formats

<div class="prompt-block">
Crea dos file formats en el schema RETAIL: uno llamado csv_format de tipo CSV con skip_header=1, field_optionally_enclosed_by='"' y null_if para valores NULL y vacios. Y otro llamado parquet_format de tipo PARQUET.
</div>

<div class="expected-result">
Generar y ejecutar los dos CREATE FILE FORMAT.
</div>

## Paso 3: Crear las tablas raw

<div class="prompt-block">
Crea 4 tablas en el schema RETAIL:

1. raw_clientes: cliente_id INT, nombre VARCHAR(200), email VARCHAR(200), region VARCHAR(100), comuna VARCHAR(100), fecha_registro DATE, segmento VARCHAR(50)

2. raw_productos: producto_id INT, nombre VARCHAR(200), categoria VARCHAR(50), precio DECIMAL(10,2), proveedor VARCHAR(200), descripcion VARCHAR(500)

3. raw_ordenes: orden_id INT, cliente_id INT, producto_id INT, cantidad INT, fecha_orden DATE, monto_total DECIMAL(12,2), estado VARCHAR(50), canal VARCHAR(50)

4. raw_reviews_clientes: review_id INT, orden_id INT, cliente_id INT, texto_review VARCHAR(2000), fecha_review DATE, rating INT
</div>

<div class="expected-result">
Generar y ejecutar los 4 CREATE TABLE.
</div>

## Paso 4: Conectar con S3 y cargar datos

Los datos del taller estan en un bucket S3 publico. Primero vamos a crear el external stage y luego cargar los datos.

### Crear el External Stage

<div class="prompt-block">
Usando el rol SYSADMIN, crea un external stage llamado stg_s3_retail en el schema HOL_CORTEX_CODE.RETAIL que apunte a la URL 's3://hol-cortex-code-chile/' sin credenciales (el bucket es publico). Usa el parametro CREDENTIALS = () para indicar que no se necesitan credenciales.
</div>

<div class="expected-result">
Generar y ejecutar un CREATE STAGE con URL de S3 y sin credenciales (acceso publico).
</div>

### Verificar que se ven los archivos

<div class="prompt-block">
Lista los archivos del stage @stg_s3_retail para verificar que puedo ver el contenido del bucket.
</div>

<div class="expected-result">
Ejecutar LIST @stg_s3_retail y mostrar los archivos CSV y Parquet en las carpetas clientes/, productos/, ordenes/ y reviews/.
</div>

### Cargar los datos

<div class="prompt-block">
Carga datos en las 4 tablas raw desde el stage @stg_s3_retail:

- raw_clientes desde /clientes/ usando csv_format
- raw_productos desde /productos/ usando csv_format
- raw_ordenes desde /ordenes/ usando parquet_format
- raw_reviews_clientes desde /reviews/ usando parquet_format

Usa MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE en todos los COPY INTO.
</div>

<div class="expected-result">
Generar y ejecutar 4 sentencias COPY INTO que cargan los datos desde S3.
</div>

## Paso 5: Verificar la carga

<div class="prompt-block">
Muestrame el conteo de filas de cada una de las 4 tablas raw en una sola consulta.
</div>

<div class="expected-result">
Ejecutar un UNION ALL con COUNT(*) de cada tabla y mostrar los resultados.
</div>

Deberias ver:

| tabla | filas |
|---|---|
| raw_clientes | 200 |
| raw_productos | 50 |
| raw_ordenes | 2,000 |
| raw_reviews_clientes | 500 |

:::caution Si las funciones de Cortex AI dan error mas adelante
Pidele a Cortex Code:

<div class="prompt-block">
Usando rol ACCOUNTADMIN, otorga el database role SNOWFLAKE.CORTEX_USER al rol SYSADMIN. Luego vuelve al rol SYSADMIN.
</div>
:::

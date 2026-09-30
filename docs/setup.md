---
sidebar_position: 2
title: Setup
---

# Setup del Ambiente

En este paso vas a preparar tu ambiente de Snowflake usando Cortex Code. Todo se hace con prompts en lenguaje natural.

## Paso 0: Descargar los datos

Descarga el archivo ZIP con los datos del taller:

👉 **[Descargar datos del taller](https://github.com/sfc-gh-jocastillo/cortex-code-hol/releases/download/v1.0/hol-data.zip)**

Descomprime el ZIP. Vas a encontrar 4 archivos:
- `clientes.csv` — 200 clientes
- `productos.csv` — 50 productos
- `ordenes.parquet` — 2,000 ordenes
- `reviews.parquet` — 500 reviews en espanol

## Paso 1: Crear la infraestructura

Abre **Cortex Code en Snowsight** y escribe:

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

## Paso 4: Crear el stage y subir los datos

### Crear el internal stage

<div class="prompt-block">
Crea un internal stage llamado stg_hol_data en el schema RETAIL con directorio habilitado.
</div>

<div class="expected-result">
Generar y ejecutar CREATE STAGE con DIRECTORY = (ENABLE = TRUE).
</div>

### Subir los archivos

Ahora vamos a subir los 4 archivos al stage. En Snowsight:

1. Ve a **Data > Databases > HOL_CORTEX_CODE > RETAIL > Stages > STG_HOL_DATA**
2. Haz click en **+ Files** (boton azul arriba a la derecha)
3. Selecciona los 4 archivos que descomprimiste (clientes.csv, productos.csv, ordenes.parquet, reviews.parquet)
4. Haz click en **Upload**

:::tip Alternativa via SQL
Si prefieres usar la linea de comandos de SnowSQL en vez de la UI:
```
PUT file:///ruta/a/clientes.csv @stg_hol_data/clientes/ AUTO_COMPRESS=FALSE;
PUT file:///ruta/a/productos.csv @stg_hol_data/productos/ AUTO_COMPRESS=FALSE;
PUT file:///ruta/a/ordenes.parquet @stg_hol_data/ordenes/ AUTO_COMPRESS=FALSE;
PUT file:///ruta/a/reviews.parquet @stg_hol_data/reviews/ AUTO_COMPRESS=FALSE;
```
:::

### Verificar que se subieron

<div class="prompt-block">
Lista los archivos del stage @stg_hol_data para verificar que se subieron correctamente.
</div>

<div class="expected-result">
Ejecutar LIST @stg_hol_data y mostrar los 4 archivos subidos.
</div>

## Paso 5: Cargar los datos en las tablas

<div class="prompt-block">
Carga datos en las 4 tablas raw desde el stage @stg_hol_data:

- raw_clientes desde clientes.csv usando csv_format
- raw_productos desde productos.csv usando csv_format
- raw_ordenes desde ordenes.parquet usando parquet_format
- raw_reviews_clientes desde reviews.parquet usando parquet_format

Usa MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE en todos los COPY INTO. Usa el pattern adecuado para encontrar cada archivo en el stage.
</div>

<div class="expected-result">
Generar y ejecutar 4 sentencias COPY INTO que cargan los datos desde el internal stage.
</div>

## Paso 6: Verificar la carga

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

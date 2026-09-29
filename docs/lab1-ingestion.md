---
sidebar_position: 3
title: "Lab 1: Ingestion y Transformacion"
---

# Lab 1: Ingestion y Transformacion con AI

**Duracion:** 60 minutos

En este lab vas a explorar los datos cargados y crear transformaciones usando solamente prompts a Cortex Code. No escribes SQL, Cortex Code lo hace por ti.

---

## Parte 1: Exploracion de Datos (15 min)

### Conocer las tablas

<div class="prompt-block">
Muestrame las primeras 5 filas de cada una de las 4 tablas raw (raw_clientes, raw_productos, raw_ordenes, raw_reviews_clientes) para que pueda entender la estructura de los datos.
</div>

<div class="expected-result">
Ejecutar SELECT * LIMIT 5 de cada tabla y mostrar los resultados.
</div>

### Distribucion de clientes

<div class="prompt-block">
Cuantos clientes hay por region? Ordenalos de mayor a menor.
</div>

### Precios por categoria

<div class="prompt-block">
Para cada categoria de producto, muestrame cuantos productos hay, el precio promedio, el minimo y el maximo. Ordena por precio promedio descendente.
</div>

### Estado de ordenes

<div class="prompt-block">
Que porcentaje de ordenes esta en cada estado (Completada, Pendiente, Cancelada)?
</div>

### Reviews y ratings

<div class="prompt-block">
Como se distribuyen los ratings del 1 al 5 en las reviews? Muestrame el conteo y porcentaje de cada uno.
</div>

:::tip Experimenta
Pregunta lo que quieras sobre los datos. Cortex Code entiende contexto, asi que puedes hacer preguntas como: "Cuantos clientes Premium hay en la Region Metropolitana?" o "Cual es el producto mas caro?"
:::

---

## Parte 2: Transformaciones (25 min)

### Metricas por cliente

<div class="prompt-block">
Calcula para cada cliente: su nombre, region, segmento, total de ordenes completadas, total gastado, ticket promedio, fecha de primera y ultima compra, y cuantos dias lleva como cliente. Ordena por total gastado descendente.
</div>

<div class="expected-result">
Generar un query con JOINs entre raw_clientes y raw_ordenes, agregaciones y calculos de fecha. Ejecutarlo y mostrar resultados.
</div>

### Ventas cruzadas

<div class="prompt-block">
Muestrame las ventas totales cruzando region del cliente con categoria del producto, solo para ordenes completadas. Incluye total de ordenes, ventas totales y ticket promedio. Ordena por ventas totales descendente.
</div>

### Top 10 productos

<div class="prompt-block">
Cuales son los 10 productos que mas ingresos generaron? Incluye la categoria, cuantas veces se vendio, unidades vendidas e ingresos totales.
</div>

### Tendencia mensual

<div class="prompt-block">
Muestrame la tendencia mensual de ventas: por cada mes, cuantas ordenes completadas hubo, cuanto se vendio en total y cuantos clientes unicos compraron.
</div>

---

## Parte 3: Crear Vistas para el Pipeline (20 min)

Ahora vamos a pedirle a Cortex Code que cree vistas que serviran como base para el pipeline del Lab 2.

### Vista de ordenes enriquecidas

<div class="prompt-block">
Crea una vista llamada v_ordenes_enriquecidas que haga JOIN de raw_ordenes con raw_clientes y raw_productos. Trae los campos mas relevantes de cada tabla: de ordenes el id, fecha, cantidad, monto, estado y canal; de clientes el id, nombre, region, comuna y segmento; de productos el id, nombre, categoria, precio unitario y proveedor.
</div>

<div class="expected-result">
Generar y ejecutar un CREATE VIEW con los JOINs correspondientes.
</div>

### Vista de metricas por cliente

<div class="prompt-block">
Crea una vista llamada v_metricas_clientes que para cada cliente calcule: ordenes completadas, ordenes canceladas, total gastado (solo completadas), ticket promedio, fecha de ultima compra y dias sin comprar desde hoy. Incluye los datos basicos del cliente (nombre, email, region, comuna, segmento, fecha de registro).
</div>

### Vista de resumen de ventas

<div class="prompt-block">
Crea una vista llamada v_resumen_ventas que agrupe las ventas completadas por mes, region, categoria y canal. Para cada grupo calcula: total de ordenes, total de ventas, clientes unicos y ticket promedio.
</div>

### Verificar

<div class="prompt-block">
Muestrame las vistas que existen en el schema RETAIL.
</div>

<div class="expected-result">
Ejecutar SHOW VIEWS y mostrar las 3 vistas creadas: v_ordenes_enriquecidas, v_metricas_clientes, v_resumen_ventas.
</div>

:::info Siguiente paso
Estas vistas alimentaran el pipeline de Dynamic Tables en el **Lab 2**.
:::

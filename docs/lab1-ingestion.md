---
sidebar_position: 3
title: "Lab 1: Exploracion y Transformacion"
---

# Lab 1: Exploracion y Transformacion con AI

**Duracion:** 60 minutos

En este lab vas a explorar los datos y escribir queries de analisis usando solo prompts a Cortex Code. No creas objetos permanentes — el objetivo es aprender a pedirle a Cortex Code que genere SQL por ti.

---

## Parte 1: Conocer los Datos (15 min)

### Vista rapida de las tablas

<div class="prompt-block">
Muestrame las primeras 5 filas de cada una de las 4 tablas raw (raw_clientes, raw_productos, raw_ordenes, raw_reviews_clientes) para entender la estructura de los datos.
</div>

### Distribucion de clientes

<div class="prompt-block">
Cuantos clientes hay por region? Ordenalos de mayor a menor.
</div>

<div class="prompt-block">
Cual es la distribucion de clientes por segmento (Premium, Standard, Basico)?
</div>

### Productos y precios

<div class="prompt-block">
Para cada categoria de producto, muestrame cuantos productos hay, el precio promedio, el minimo y el maximo. Ordena por precio promedio descendente.
</div>

### Estado de ordenes

<div class="prompt-block">
Que porcentaje de ordenes esta en cada estado (Completada, Pendiente, Cancelada)?
</div>

### Reviews

<div class="prompt-block">
Como se distribuyen los ratings del 1 al 5 en las reviews? Muestrame el conteo y porcentaje de cada uno.
</div>

<div class="prompt-block">
Muestrame 5 reviews de ejemplo con rating 1 para ver como son las quejas de los clientes.
</div>

:::tip Experimenta
Pregunta lo que quieras. Cortex Code entiende contexto, asi que puedes hacer preguntas como "Cuantos clientes Premium hay en la Region Metropolitana?" o "Cual es el producto mas caro en la categoria Deportes?"
:::

---

## Parte 2: Analisis de Clientes (15 min)

Ahora vamos a hacer analisis mas complejos que combinan varias tablas. Estos queries no crean objetos — solo muestran resultados.

### Metricas por cliente

<div class="prompt-block">
Calcula para cada cliente: su nombre, region, segmento, total de ordenes completadas, total gastado, ticket promedio, y fecha de ultima compra. Ordena por total gastado descendente. Muestrame los top 20.
</div>

<div class="expected-result">
Generar un query con JOIN entre raw_clientes y raw_ordenes, agregaciones con GROUP BY y filtro por estado completada. Ejecutar y mostrar resultados.
</div>

### Clientes inactivos

<div class="prompt-block">
Cuales son los clientes que no han comprado en los ultimos 90 dias? Muestrame su nombre, region, segmento y fecha de ultima compra.
</div>

### Clientes por segmento

<div class="prompt-block">
Compara los 3 segmentos de clientes (Premium, Standard, Basico): cual gasta mas en promedio? Cual tiene mas ordenes? Cual tiene mejor ticket promedio?
</div>

---

## Parte 3: Analisis de Ventas (15 min)

### Top productos

<div class="prompt-block">
Cuales son los 10 productos que mas ingresos generaron? Incluye la categoria, cuantas veces se vendio, unidades vendidas e ingresos totales. Solo ordenes completadas.
</div>

### Ventas por region y categoria

<div class="prompt-block">
Muestrame las ventas totales cruzando region del cliente con categoria del producto, solo ordenes completadas. Que combinacion region-categoria vende mas?
</div>

### Tendencia mensual

<div class="prompt-block">
Muestrame la tendencia mensual de ventas de los ultimos 12 meses: por cada mes cuantas ordenes completadas hubo, cuanto se vendio en total y cuantos clientes unicos compraron.
</div>

### Comparacion por canal

<div class="prompt-block">
Compara los 3 canales de venta (Web, Tienda, App): cuantas ordenes tiene cada uno, cual genera mas ingresos y cual tiene mejor ticket promedio?
</div>

---

## Parte 4: Analisis de Reviews (15 min)

### Reviews por rating y producto

<div class="prompt-block">
Cuales son los productos con peor rating promedio? Muestrame los 10 peores con su rating promedio, cantidad de reviews y un ejemplo de review negativa.
</div>

### Correlacion rating y monto

<div class="prompt-block">
Hay relacion entre el monto gastado y el rating que deja el cliente? Agrupa las reviews por rating (1 a 5) y muestrame el monto promedio de la orden asociada.
</div>

### Reviews por canal

<div class="prompt-block">
Los clientes que compran por Web dejan mejores o peores reviews que los de Tienda o App? Muestrame el rating promedio por canal.
</div>

### Preview del texto

<div class="prompt-block">
Muestrame 3 reviews positivas (rating 5) y 3 negativas (rating 1) con el texto completo. Quiero ver como escriben los clientes.
</div>

:::info Siguiente paso
En el **Lab 2** vamos a tomar estas mismas reviews y aplicarles funciones de Cortex AI (sentimiento, clasificacion, generacion de insights) usando Dynamic Tables.
:::

---

## Que aprendimos

- Como usar Cortex Code para explorar datos rapidamente sin escribir SQL
- Como pedir analisis complejos (JOINs, agregaciones, filtros) en lenguaje natural
- Como iterar sobre preguntas: empezar con algo simple y profundizar
- Los datos de reviews en espanol que vamos a enriquecer con AI en el Lab 2

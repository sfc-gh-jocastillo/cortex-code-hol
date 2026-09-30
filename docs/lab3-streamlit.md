---
sidebar_position: 5
title: "Lab 3: Streamlit in Snowflake"
---

# Lab 3: Visualizacion con Streamlit in Snowflake

**Duracion:** 45 minutos

En este lab vas a crear un dashboard interactivo directamente en Snowflake. Cortex Code genera todo el codigo, crea los archivos y despliega la app por ti. No necesitas copiar ni pegar nada.

## Que vas a construir

Un dashboard con 3 secciones:
1. **KPIs de Ventas** — Metricas principales con filtros interactivos
2. **Analisis de Sentimiento** — Distribucion y detalle de reviews
3. **Insights AI** — Resumenes ejecutivos generados por el LLM

---

## Paso 1: Crear la App Streamlit (15 min)

Con un solo prompt, Cortex Code va a generar todo el codigo Python, crear el archivo y desplegarlo en Snowflake:

<div class="prompt-block">
Crea una app Streamlit-in-Snowflake llamada HOL_RETAIL_DASHBOARD en el schema HOL_CORTEX_CODE.RETAIL usando el warehouse HOL_WH. La app debe tener lo siguiente:

CONFIGURACION: layout wide, titulo "Dashboard Retail Chile", subtitulo "Datos enriquecidos con Cortex AI | HOL Cortex Code".

SIDEBAR con 3 filtros selectbox:
- Region (con opcion "Todas" por defecto), valores desde dt_ventas_detalle
- Categoria (con opcion "Todas"), valores desde dt_ventas_detalle
- Canal (con opcion "Todos"), valores desde dt_ventas_detalle

SECCION 1 - KPIs DE VENTAS:
- Header "Indicadores de Ventas"
- 4 columnas con st.metric: Total Ordenes, Total Ventas (formato $), Clientes Unicos, Ticket Promedio (formato $)
- Los datos vienen de dt_ventas_detalle filtrado por los selectores, solo ordenes con estado 'Completada'
- Un bar_chart de ventas por categoria
- Un line_chart de tendencia mensual de ventas (usando la columna mes_orden)

SECCION 2 - SENTIMIENTO:
- Header "Analisis de Sentimiento de Reviews"
- Dos columnas: izquierda con bar_chart de distribucion por sentimiento_label, derecha con dataframe de tipo_feedback con conteo y sentimiento promedio
- Una tabla con las 15 reviews mas recientes: fecha_review, texto_review, rating, sentimiento_label, tipo_feedback, sentimiento_score redondeado a 3 decimales
- Datos de dt_reviews_enriquecidas

SECCION 3 - INSIGHTS AI:
- Header "Insights Generados por AI"
- Un selectbox para elegir categoria
- 4 columnas con metricas: ordenes, ventas, rating promedio, sentimiento promedio
- Un st.info mostrando el insight_ai de esa categoria
- Datos de dt_dashboard_consolidado

Construye un WHERE clause dinamico basado en los filtros del sidebar. Usa session = get_active_session(). Formatea numeros con separador de miles. Agrega un caption al final: "Dashboard generado en HOL Cortex Code | Snowflake 2026".

Despliega la app en Snowflake.
</div>

<div class="expected-result">
Generar el archivo streamlit_app.py completo, crear el stage, subir el archivo, crear el objeto STREAMLIT y desplegar la app. Todo automatico.
</div>

:::tip Si Cortex Code pregunta algo
Es posible que Cortex Code te pregunte sobre detalles de implementacion (ej: tipo de grafico, colores). Puedes responder o simplemente decirle "usa lo que te parezca mejor".
:::

---

## Paso 2: Abrir y explorar el Dashboard (10 min)

<div class="prompt-block">
Muestrame las apps Streamlit que existen en mi schema RETAIL.
</div>

Para abrir la app, ve a **Snowsight > Streamlit > HOL_RETAIL_DASHBOARD**.

### Explora los filtros
- Selecciona **Region Metropolitana** y observa como cambian los KPIs
- Filtra por categoria **Electronica** y revisa la tendencia mensual
- Compara los canales: Web vs Tienda vs App

### Revisa el sentimiento
- Que porcentaje de reviews son positivas vs negativas?
- Que tipo de feedback tiene el peor sentimiento promedio?
- Lee algunas reviews para ver si el sentimiento coincide con el texto

### Lee los insights
- Selecciona cada categoria y lee el insight generado por el LLM
- Alguna categoria necesita atencion urgente segun la AI?

---

## Paso 3: Mejorar el Dashboard (10 min)

Ahora pidele a Cortex Code que mejore la app:

<div class="prompt-block">
Agrega a la app HOL_RETAIL_DASHBOARD una nueva seccion llamada "Top 10 Clientes" que muestre los 10 clientes con mayor gasto total. Incluye nombre, region, segmento, total gastado y numero de ordenes completadas. Usa los datos de dt_ventas_detalle. Redesplega la app.
</div>

<div class="expected-result">
Modificar el codigo de la app, agregar la nueva seccion y redesplegar automaticamente.
</div>

<div class="prompt-block">
Agrega un pie chart que muestre la distribucion porcentual de ordenes por canal (Web, Tienda, App). Ponlo despues del line chart de tendencia mensual. Redesplega.
</div>

---

## Paso 4: Experimentacion libre (10 min)

Pidele a Cortex Code cualquier mejora que se te ocurra:

<div class="prompt-block">
Agrega tabs a la app para separar las secciones: un tab "Ventas", otro "Sentimiento" y otro "Insights AI". Redesplega.
</div>

<div class="prompt-block">
Agrega una seccion que muestre las 5 reviews mas negativas con su texto completo y sentimiento_score. Redesplega.
</div>

<div class="prompt-block">
Cambia los colores del dashboard para usar la paleta de Snowflake (azul #29B5E8 como color principal). Redesplega.
</div>

:::info Experimentacion libre
Puedes pedir cualquier cambio: nuevos graficos, tablas, filtros, metricas calculadas, cambios de layout. Cortex Code modifica el codigo y redesplega la app automaticamente.
:::

---

## Verificacion

Tu dashboard deberia tener como minimo:

| Seccion | Componentes |
|---|---|
| Sidebar | 3 filtros interactivos (Region, Categoria, Canal) |
| KPIs | 4 metric cards (Ordenes, Ventas, Clientes, Ticket) |
| Graficos | Bar chart por categoria, line chart mensual |
| Sentimiento | Distribucion + tabla de reviews |
| Insights AI | Selector de categoria + metricas + insight del LLM |

Plus cualquier mejora adicional que hayas pedido en los pasos 3 y 4.

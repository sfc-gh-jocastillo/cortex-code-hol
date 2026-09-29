---
sidebar_position: 5
title: "Lab 3: Streamlit in Snowflake"
---

# Lab 3: Visualizacion con Streamlit in Snowflake

**Duracion:** 45 minutos

En este lab vas a crear un dashboard interactivo que visualiza los resultados del pipeline. Le pides a Cortex Code que genere la app Streamlit completa.

## Que vas a construir

Un dashboard con 3 secciones:
1. **KPIs de Ventas** — Metricas principales con filtros interactivos
2. **Analisis de Sentimiento** — Distribucion y detalle de reviews
3. **Insights AI** — Resumenes ejecutivos generados por el LLM

---

## Paso 1: Crear la App (10 min)

Primero necesitamos crear el objeto Streamlit en Snowflake:

<div class="prompt-block">
Crea un stage interno llamado stg_streamlit_app con directorio habilitado en el schema RETAIL. Luego crea un Streamlit llamado HOL_RETAIL_DASHBOARD usando ese stage como root_location, con main_file '/streamlit_app.py' y query_warehouse HOL_WH.
</div>

<div class="expected-result">
Crear el stage y el objeto STREAMLIT. Ahora puedes ir a Snowsight > Streamlit para editar la app.
</div>

Ahora ve a **Snowsight > Streamlit > HOL_RETAIL_DASHBOARD > Edit** para abrir el editor de codigo de la app.

---

## Paso 2: Generar el Dashboard Completo (15 min)

Vamos a pedirle a Cortex Code que genere todo el codigo Python del dashboard de una vez:

<div class="prompt-block">
Genera el codigo Python completo para una app Streamlit-in-Snowflake que funcione como dashboard de retail. La app debe:

1. CONFIGURACION: Usar layout wide, titulo "Dashboard Retail Chile", subtitulo "Datos enriquecidos con Cortex AI"

2. SIDEBAR con filtros: Un selectbox para Region (con opcion "Todas"), uno para Categoria (con "Todas") y uno para Canal (con "Todos"). Los valores de cada filtro deben venir de la tabla dt_ventas_detalle.

3. SECCION KPIs: Mostrar en 4 columnas: Total Ordenes, Total Ventas (con formato $), Clientes Unicos y Ticket Promedio. Los datos vienen de dt_ventas_detalle filtrado por los selectores del sidebar, solo ordenes completadas.

4. GRAFICOS: Un bar_chart de ventas por categoria y un line_chart de tendencia mensual de ventas. Ambos respetando los filtros.

5. SECCION SENTIMIENTO: Dos columnas. La izquierda con un bar_chart de distribucion de sentimiento (Positivo/Neutro/Negativo). La derecha con una tabla de tipo de feedback con conteo y sentimiento promedio. Debajo, una tabla con las 15 reviews mas recientes mostrando fecha, texto, rating, sentimiento y tipo de feedback. Los datos vienen de dt_reviews_enriquecidas.

6. SECCION INSIGHTS AI: Un selectbox para elegir categoria. Debajo, 4 metricas en columnas (ordenes, ventas, rating, sentimiento). Debajo, un st.info con el insight_ai de esa categoria. Los datos vienen de dt_dashboard_consolidado.

Usa session = get_active_session() de snowflake.snowpark.context. Para los filtros, construye un WHERE clause dinamico. Formatea los numeros con separador de miles.
</div>

<div class="expected-result">
Generar un archivo Python completo (~120 lineas) con todo el codigo del dashboard.
</div>

### Pegar el codigo en la app

1. Copia el codigo que Cortex Code genero
2. Ve a Snowsight > Streamlit > **HOL_RETAIL_DASHBOARD** > **Edit**
3. Borra el contenido por defecto y pega el codigo
4. La app se ejecutara automaticamente

:::tip Si hay un error
Copia el error y pegalo en Cortex Code:

<div class="prompt-block">
Mi app Streamlit me da este error: [pega el error aqui]. Corrige el codigo.
</div>
:::

---

## Paso 3: Explorar el Dashboard (10 min)

Una vez que la app este corriendo, explora:

### Filtros
- Selecciona **Region Metropolitana** y observa como cambian los KPIs
- Filtra por categoria **Electronica** y revisa la tendencia mensual
- Compara los canales: Web vs Tienda vs App

### Sentimiento
- Identifica que porcentaje de reviews son positivas vs negativas
- Revisa que tipo de feedback tiene el peor sentimiento promedio
- Lee algunas reviews recientes para ver si el sentimiento coincide

### Insights AI
- Selecciona cada categoria y lee el insight generado por el LLM
- Compara los insights: alguna categoria necesita atencion urgente?

---

## Paso 4: Mejorar el Dashboard (10 min)

Ahora vamos a pedirle a Cortex Code mejoras sobre la app existente:

<div class="prompt-block">
Agrega a mi app Streamlit un nuevo tab o seccion llamada "Top Clientes" que muestre los 10 clientes con mayor gasto total. Incluye nombre, region, segmento, total gastado y numero de ordenes. Usa los datos de dt_ventas_detalle.
</div>

<div class="prompt-block">
Agrega un grafico de pie chart que muestre la distribucion de ordenes por canal (Web, Tienda, App).
</div>

:::info Experimentacion libre
En este punto tienes libertad para pedir lo que quieras. Algunos ejemplos:
- "Agrega un mapa de calor de ventas por region y mes"
- "Muestra las reviews mas negativas con opcion de filtrar por tipo de feedback"
- "Agrega metricas comparativas mes actual vs mes anterior"
:::

---

## Verificacion

Tu dashboard deberia tener:

| Seccion | Componentes |
|---|---|
| Header | Titulo, subtitulo |
| Sidebar | 3 filtros interactivos (Region, Categoria, Canal) |
| KPIs | 4 metric cards (Ordenes, Ventas, Clientes, Ticket) |
| Graficos | Bar chart por categoria, line chart mensual |
| Sentimiento | Distribucion + tabla de reviews |
| Insights AI | Selector de categoria + metricas + insight del LLM |

<div class="prompt-block">
Muestrame las apps Streamlit que existen en mi schema RETAIL.
</div>

:::tip Compartir la app
Si quieres compartir el dashboard con otras personas de tu cuenta Snowflake, pidele a Cortex Code:

<div class="prompt-block">
Otorga permisos de uso sobre la app Streamlit HOL_RETAIL_DASHBOARD al rol PUBLIC.
</div>
:::

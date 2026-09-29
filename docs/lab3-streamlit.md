---
sidebar_position: 5
title: "Lab 3: Streamlit in Snowflake"
---

# Lab 3: Visualizacion con Streamlit in Snowflake

**Duracion:** 45 minutos

En este lab vas a crear un dashboard interactivo directamente en Snowflake que consume las Dynamic Tables del Lab 2.

## Que vas a construir

Un dashboard con 3 secciones:
1. **KPIs de Ventas** - Metricas principales con filtros interactivos
2. **Analisis de Sentimiento** - Distribucion y tabla de reviews
3. **Insights AI** - Resumenes ejecutivos generados por el LLM

## Paso 1: Crear la App (10 min)

```sql
USE DATABASE HOL_CORTEX_CODE;
USE SCHEMA RETAIL;
USE WAREHOUSE HOL_WH;

CREATE OR REPLACE STAGE stg_streamlit_app
  DIRECTORY = (ENABLE = TRUE);

CREATE OR REPLACE STREAMLIT HOL_RETAIL_DASHBOARD
  ROOT_LOCATION = '@HOL_CORTEX_CODE.RETAIL.stg_streamlit_app'
  MAIN_FILE = '/streamlit_app.py'
  QUERY_WAREHOUSE = HOL_WH
  COMMENT = 'Dashboard Retail - HOL Cortex Code';
```

Ahora ve a **Snowsight > Streamlit > HOL_RETAIL_DASHBOARD > Edit** y pega el codigo Python de las siguientes secciones.

## Paso 2: Codigo del Dashboard

Copia el siguiente codigo completo en el editor de Streamlit:

```python
import streamlit as st
from snowflake.snowpark.context import get_active_session

session = get_active_session()

st.set_page_config(page_title="Retail Dashboard - HOL Cortex Code", layout="wide")
st.title("Dashboard Retail Chile")
st.caption("Datos enriquecidos con Cortex AI | HOL Cortex Code")

# ----- Sidebar: Filtros -----
st.sidebar.header("Filtros")

regiones = session.sql(
    "SELECT DISTINCT region FROM dt_ventas_detalle ORDER BY region"
).collect()
regiones_list = ["Todas"] + [r["REGION"] for r in regiones]
region_sel = st.sidebar.selectbox("Region", regiones_list)

categorias = session.sql(
    "SELECT DISTINCT categoria FROM dt_ventas_detalle ORDER BY categoria"
).collect()
categorias_list = ["Todas"] + [r["CATEGORIA"] for r in categorias]
categoria_sel = st.sidebar.selectbox("Categoria", categorias_list)

canales = session.sql(
    "SELECT DISTINCT canal FROM dt_ventas_detalle ORDER BY canal"
).collect()
canales_list = ["Todos"] + [r["CANAL"] for r in canales]
canal_sel = st.sidebar.selectbox("Canal", canales_list)

# ----- Construir filtro WHERE -----
filtros = ["estado = 'Completada'"]
if region_sel != "Todas":
    filtros.append(f"region = '{region_sel}'")
if categoria_sel != "Todas":
    filtros.append(f"categoria = '{categoria_sel}'")
if canal_sel != "Todos":
    filtros.append(f"canal = '{canal_sel}'")
where_clause = " AND ".join(filtros)
```

## Paso 3: KPIs de Ventas (15 min)

Agrega al mismo archivo:

```python
# ==================== SECCION 1: KPIs ====================
st.header("Indicadores de Ventas")

kpi_query = f"""
SELECT
    COUNT(DISTINCT orden_id) AS total_ordenes,
    SUM(monto_total) AS total_ventas,
    COUNT(DISTINCT cliente_id) AS clientes_unicos,
    ROUND(AVG(monto_total), 0) AS ticket_promedio
FROM dt_ventas_detalle
WHERE {where_clause}
"""
kpis = session.sql(kpi_query).collect()[0]

col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Ordenes", f"{kpis['TOTAL_ORDENES']:,}")
col2.metric("Total Ventas", f"${kpis['TOTAL_VENTAS']:,.0f}")
col3.metric("Clientes Unicos", f"{kpis['CLIENTES_UNICOS']:,}")
col4.metric("Ticket Promedio", f"${kpis['TICKET_PROMEDIO']:,.0f}")

# Ventas por categoria
st.subheader("Ventas por Categoria")
ventas_cat = session.sql(f"""
    SELECT categoria, SUM(monto_total) AS ventas
    FROM dt_ventas_detalle
    WHERE {where_clause}
    GROUP BY categoria ORDER BY ventas DESC
""").to_pandas()
st.bar_chart(ventas_cat.set_index("CATEGORIA")["VENTAS"])

# Tendencia mensual
st.subheader("Tendencia Mensual")
ventas_mes = session.sql(f"""
    SELECT mes_orden AS mes, SUM(monto_total) AS ventas
    FROM dt_ventas_detalle
    WHERE {where_clause}
    GROUP BY mes ORDER BY mes
""").to_pandas()
st.line_chart(ventas_mes.set_index("MES")["VENTAS"])
```

## Paso 4: Panel de Sentimiento (10 min)

```python
# ==================== SECCION 2: Sentimiento ====================
st.header("Analisis de Sentimiento de Reviews")

col_s1, col_s2 = st.columns(2)

with col_s1:
    st.subheader("Distribucion de Sentimiento")
    sent_dist = session.sql("""
        SELECT sentimiento_label, COUNT(*) AS total
        FROM dt_reviews_enriquecidas
        GROUP BY sentimiento_label ORDER BY total DESC
    """).to_pandas()
    st.bar_chart(sent_dist.set_index("SENTIMIENTO_LABEL")["TOTAL"])

with col_s2:
    st.subheader("Tipo de Feedback")
    feedback_dist = session.sql("""
        SELECT tipo_feedback, COUNT(*) AS total,
               ROUND(AVG(sentimiento_score), 3) AS sentimiento_prom
        FROM dt_reviews_enriquecidas
        GROUP BY tipo_feedback ORDER BY total DESC
    """).to_pandas()
    st.dataframe(feedback_dist, use_container_width=True)

st.subheader("Reviews Recientes")
reviews_recientes = session.sql("""
    SELECT fecha_review, texto_review, rating, sentimiento_label,
           tipo_feedback, ROUND(sentimiento_score, 3) AS score
    FROM dt_reviews_enriquecidas
    ORDER BY fecha_review DESC LIMIT 15
""").to_pandas()
st.dataframe(reviews_recientes, use_container_width=True)
```

## Paso 5: Insights AI (10 min)

```python
# ==================== SECCION 3: Insights AI ====================
st.header("Insights Generados por AI")

dashboard_data = session.sql("""
    SELECT categoria, total_ordenes, total_ventas, clientes_unicos,
           ticket_promedio, total_reviews, sentimiento_promedio,
           reviews_positivas, reviews_negativas, rating_promedio,
           insight_ai
    FROM dt_dashboard_consolidado
    ORDER BY total_ventas DESC
""").to_pandas()

cat_options = dashboard_data["CATEGORIA"].tolist()
cat_selected = st.selectbox("Selecciona una categoria:", cat_options)

row = dashboard_data[dashboard_data["CATEGORIA"] == cat_selected].iloc[0]

col_i1, col_i2, col_i3, col_i4 = st.columns(4)
col_i1.metric("Ordenes", f"{row['TOTAL_ORDENES']:,}")
col_i2.metric("Ventas", f"${row['TOTAL_VENTAS']:,.0f}")
col_i3.metric("Rating Prom.", f"{row['RATING_PROMEDIO']}/5")
col_i4.metric("Sentimiento", f"{row['SENTIMIENTO_PROMEDIO']:.3f}")

st.info(f"**Insight AI para {cat_selected}:**\n\n{row['INSIGHT_AI']}")

st.caption("Dashboard generado en HOL Cortex Code | Snowflake 2026")
```

## Verificacion

Tu dashboard deberia tener:

- 4 metricas KPI en la parte superior
- Filtros funcionales en la barra lateral (Region, Categoria, Canal)
- Graficos de ventas por categoria y tendencia mensual
- Distribucion de sentimiento y tabla de reviews
- Insights AI seleccionables por categoria

:::tip Para abrir la app
Ve a **Snowsight > Streamlit** y haz click en `HOL_RETAIL_DASHBOARD`
:::

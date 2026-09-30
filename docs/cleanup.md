---
sidebar_position: 6
title: Cleanup
---

# Cleanup: Eliminar Recursos

Una vez terminado el taller, puedes eliminar todos los recursos creados para evitar consumo de creditos en tu cuenta.

## Eliminar todo

<div class="prompt-block">
Elimina la base de datos HOL_CORTEX_CODE y el warehouse HOL_WH. Esto borra todas las tablas, vistas, dynamic tables, stages y la app Streamlit que creamos durante el taller.
</div>

<div class="expected-result">
Ejecutar DROP DATABASE HOL_CORTEX_CODE y DROP WAREHOUSE HOL_WH.
</div>

:::caution Esto es irreversible
Al eliminar la base de datos se borran todas las tablas, dynamic tables, stages y la app Streamlit que creamos. Si quieres conservar algo, exportalo antes de ejecutar el cleanup.
:::

## Verificar

<div class="prompt-block">
Muestrame las bases de datos y warehouses que existen en mi cuenta para confirmar que se eliminaron los recursos del taller.
</div>

---

## Si usas una cuenta trial

Las cuentas trial de Snowflake expiran automaticamente despues de 30 dias. Si no planeas seguir usandola, no es necesario hacer cleanup — los recursos se eliminaran solos al expirar la cuenta.

## Si quieres conservar los datos

Si te interesa seguir experimentando con el pipeline, puedes conservar todo. Solo recuerda:

- El warehouse `HOL_WH` consume creditos mientras esta activo (se auto-suspende despues de 60 segundos de inactividad)
- Las Dynamic Tables se refrescan automaticamente segun su `TARGET_LAG` — si quieres pausarlas:

<div class="prompt-block">
Suspende las 3 dynamic tables: dt_reviews_enriquecidas, dt_ventas_detalle y dt_dashboard_consolidado.
</div>

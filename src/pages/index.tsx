import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const features = [
  {
    title: 'Ingestion desde S3',
    description: 'Carga datos CSV y Parquet desde un bucket S3 a Snowflake usando External Stage y COPY INTO.',
    link: '/tutorial/lab1-ingestion',
    icon: '1',
  },
  {
    title: 'Transformacion con AI',
    description: 'Usa Cortex Code para escribir SQL 10x mas rapido. Exploracion, JOINs y vistas con asistencia de AI.',
    link: '/tutorial/lab1-ingestion',
    icon: '2',
  },
  {
    title: 'Dynamic Tables',
    description: 'Pipeline incremental de 3 capas (Bronze, Silver, Gold) que se actualiza automaticamente.',
    link: '/tutorial/lab2-pipeline',
    icon: '3',
  },
  {
    title: 'AI Sentiment',
    description: 'Analisis de sentimiento sobre reviews en espanol con SNOWFLAKE.CORTEX.SENTIMENT().',
    link: '/tutorial/lab2-pipeline',
    icon: '4',
  },
  {
    title: 'AI Classify + Complete',
    description: 'Clasificacion automatica de feedback y generacion de insights ejecutivos con LLMs.',
    link: '/tutorial/lab2-pipeline',
    icon: '5',
  },
  {
    title: 'Streamlit Dashboard',
    description: 'Dashboard interactivo desplegado directamente en Snowflake. KPIs, sentimiento e insights AI.',
    link: '/tutorial/lab3-streamlit',
    icon: '6',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/tutorial/intro">
            Comenzar el taller
          </Link>
        </div>
        <div style={{marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Stat value="4" label="horas de taller" />
          <Stat value="3" label="labs practicos" />
          <Stat value="3" label="funciones AI" />
          <Stat value="1" label="dashboard final" />
        </div>
      </div>
    </header>
  );
}

function Stat({value, label}: {value: string; label: string}) {
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '2rem', fontWeight: 700, color: 'white'}}>{value}</div>
      <div style={{fontSize: '0.9rem', opacity: 0.8, color: 'white'}}>{label}</div>
    </div>
  );
}

function FeatureCard({title, description, link, icon}: {title: string; description: string; link: string; icon: string}) {
  return (
    <div className="col col--4" style={{marginBottom: '1.5rem'}}>
      <Link to={link} style={{textDecoration: 'none', color: 'inherit'}}>
        <div className="feature-card" style={{height: '100%'}}>
          <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--ifm-color-primary)', marginBottom: '0.5rem'}}>
            {icon}
          </div>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Inicio" description="Hands-on Lab: Cortex Code — De cero a tu primer pipeline de datos con AI">
      <HomepageHeader />
      <main>
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2" style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Heading as="h2">Que vas a construir</Heading>
                <p>
                  Un pipeline completo de datos con AI: desde la ingestion de archivos en S3,
                  pasando por transformaciones con Cortex AI, hasta un dashboard interactivo en Streamlit.
                </p>
              </div>
            </div>
            <div className="row">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>
        <section style={{padding: '3rem 0', background: 'var(--ifm-background-surface-color)'}}>
          <div className="container">
            <div className="row">
              <div className="col col--6">
                <Heading as="h2">Dataset: Ventas Retail Chile</Heading>
                <ul>
                  <li><strong>200</strong> clientes con regiones y comunas de Chile</li>
                  <li><strong>50</strong> productos en 5 categorias</li>
                  <li><strong>2,000</strong> ordenes de los ultimos 12 meses</li>
                  <li><strong>500</strong> reviews en espanol con sentimiento variado</li>
                  <li><strong>Formatos</strong>: CSV (dimensiones) + Parquet (hechos)</li>
                </ul>
              </div>
              <div className="col col--6">
                <Heading as="h2">Stack del taller</Heading>
                <ul>
                  <li><strong>IDE</strong>: Cortex Code (AI-assisted SQL y Python)</li>
                  <li><strong>Ingestion</strong>: External Stage S3 + COPY INTO</li>
                  <li><strong>Pipeline</strong>: Dynamic Tables (Bronze &rarr; Silver &rarr; Gold)</li>
                  <li><strong>AI</strong>: SENTIMENT, CLASSIFY_TEXT, COMPLETE</li>
                  <li><strong>Viz</strong>: Streamlit-in-Snowflake</li>
                  <li><strong>Cuenta</strong>: Trial Snowflake (sin costo)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2" style={{textAlign: 'center'}}>
                <Heading as="h2">Agenda</Heading>
              </div>
            </div>
            <div className="row">
              <div className="col col--8 col--offset-2">
                <table style={{width: '100%'}}>
                  <thead>
                    <tr><th>Hora</th><th>Actividad</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>10:00 - 10:15</td><td>Registro y bienvenida</td></tr>
                    <tr><td>10:15 - 10:30</td><td>Introduccion a Cortex Code</td></tr>
                    <tr><td>10:30 - 11:30</td><td><strong>Lab 1:</strong> Ingestion y transformacion con AI</td></tr>
                    <tr><td>11:30 - 11:45</td><td>Break</td></tr>
                    <tr><td>11:45 - 12:45</td><td><strong>Lab 2:</strong> Pipeline con Dynamic Tables + Cortex AI</td></tr>
                    <tr><td>12:45 - 13:30</td><td><strong>Lab 3:</strong> Visualizacion con Streamlit in Snowflake</td></tr>
                    <tr><td>13:30 - 14:00</td><td>Cierre y proximos pasos</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

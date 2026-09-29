import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Hands-on Lab — Cortex Code: De Cero a tu Primer Pipeline con AI',
  tagline: 'Construye pipelines de datos en vivo con Cortex Code, Dynamic Tables y Cortex AI',
  favicon: 'img/favicon.svg',

  future: {
    v4: false,
  },

  url: 'https://sfc-gh-jocastillo.github.io',
  baseUrl: '/cortex-code-hol/',

  organizationName: 'sfc-gh-jocastillo',
  projectName: 'cortex-code-hol',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'tutorial',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Hands-on Lab',
      logo: {
        alt: 'Snowflake',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          href: 'https://github.com/sfc-gh-jocastillo/cortex-code-hol',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tutorial',
          items: [
            { label: 'Inicio', to: '/tutorial/intro' },
            { label: 'Lab 1: Ingestion', to: '/tutorial/lab1-ingestion' },
            { label: 'Lab 2: Pipeline AI', to: '/tutorial/lab2-pipeline' },
            { label: 'Lab 3: Streamlit', to: '/tutorial/lab3-streamlit' },
          ],
        },
        {
          title: 'Recursos',
          items: [
            { label: 'Snowflake Docs', href: 'https://docs.snowflake.com' },
            { label: 'Cortex Code', href: 'https://docs.snowflake.com/en/user-guide/ui-snowsight/cortex-code' },
            { label: 'Dynamic Tables', href: 'https://docs.snowflake.com/en/user-guide/dynamic-tables-about' },
            { label: 'Cortex AI Functions', href: 'https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions' },
          ],
        },
      ],
      copyright: `Snowflake Chile — Hands-on Lab ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['sql', 'python', 'bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

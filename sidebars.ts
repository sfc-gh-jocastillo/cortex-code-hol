import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Preparacion',
      items: ['setup'],
    },
    {
      type: 'category',
      label: 'Laboratorios',
      items: ['lab1-ingestion', 'lab2-pipeline', 'lab3-streamlit'],
    },
  ],
};

export default sidebars;

export type Project = {
  slug: string
  title: string
  featured?: boolean
  freelance: boolean
  blurb: string
  tags: string[]
  url: string
  stack: string
}

export const projects: Project[] = [
  {
    slug: 'llm-junit4',
    title: 'LLM JUnit4 Unittest Generator',
    featured: true,
    freelance: true,
    stack: 'Python',
    blurb:
      'Local Kotlin/JUnit4 test generator for Android Gradle modules. A classification-driven pipeline ranks RAG context, builds focused prompts, validates with Gradle and Kover, then repairs only generated tests until the selected tasks pass — all against an on-prem llama.cpp server.',
    tags: ['Python', 'llama.cpp', 'RAG', 'Kotlin', 'JUnit4', 'Gradle', 'MCP'],
    url: 'https://github.com/psunil0001-sys/LLM-Junit4-Unittest-Generator',
  },
  {
    slug: 'revops',
    title: 'RevOps',
    freelance: true,
    stack: 'Python',
    blurb:
      'Streamlit dashboard for tracking Kotak Multicap Fund with a manager-orchestrated research desk: fundamentals, sentiment, news, and technical analysts, Chroma memory, and local-LLM 60-day NAV scenario forecasts.',
    tags: ['Streamlit', 'Agents', 'ChromaDB', 'llama.cpp', 'Python'],
    url: 'https://github.com/psunil0001-sys/revops',
  },
  {
    slug: 'calorietrack',
    title: 'CalorieTrack',
    freelance: true,
    stack: 'Dart',
    blurb:
      'Flutter calorie-tracking app with light/dark theming, typed routing, and responsive layouts. Built as a cross-platform mobile client with a structured presentation layer and reusable widgets.',
    tags: ['Flutter', 'Dart', 'Mobile'],
    url: 'https://github.com/psunil0001-sys/calorietrack',
  },
  {
    slug: 'dag-example',
    title: 'DAG Example',
    freelance: true,
    stack: 'Python',
    blurb:
      'Astronomer/Airflow project with an example TaskFlow ETL DAG. Queries live astronaut data, then uses dynamic task mapping to process each result — a compact walkthrough of local Airflow orchestration.',
    tags: ['Airflow', 'Astronomer', 'ETL', 'Python'],
    url: 'https://github.com/psunil0001-sys/DAG-example',
  },
]

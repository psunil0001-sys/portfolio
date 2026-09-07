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
    title: 'LLM JUnit4 Test Generator',
    featured: true,
    freelance: true,
    stack: 'Python',
    blurb:
      'Local LLM pipeline that drafts and repairs Kotlin/JUnit4 unit tests for Android Gradle modules. A Google ADK planner, coder, and fixer loop runs Gradle and Kover (optional JaCoCo) and edits only generated tests until selected tasks pass, using llama.cpp on-prem or a remote OpenAI-compatible vLLM endpoint.',
    tags: ['Python', 'Kotlin', 'JUnit4', 'Gradle', 'Kover', 'llama.cpp', 'vLLM', 'ADK'],
    url: 'https://github.com/psunil0001-sys/LLM-Junit4-Unittest-Generator',
  },
  {
    slug: 'revops',
    title: 'RevOps Research Desk',
    freelance: true,
    stack: 'Python',
    blurb:
      'Streamlit workspace for mutual funds, ULIPs, and NPS holdings from mfapi.in and local CSVs. A manager coordinates five analysts (fundamentals, sentiment, news, technical, policy), stores notes in ChromaDB, and produces 60-day NAV scenarios with bootstrap resampling and a local LLM.',
    tags: ['Python', 'Streamlit', 'Multi-agent', 'ChromaDB', 'llama.cpp'],
    url: 'https://github.com/psunil0001-sys/revops',
  },
  {
    slug: 'calorietrack',
    title: 'CalorieTrack',
    freelance: true,
    stack: 'Dart',
    blurb:
      'Cross-platform Flutter calorie tracker with a layered structure (core, presentation, routes, theme, widgets), typed navigation, and a light/dark theme system for a consistent mobile UI.',
    tags: ['Flutter', 'Dart', 'Mobile'],
    url: 'https://github.com/psunil0001-sys/calorietrack',
  },
  {
    slug: 'dag-example',
    title: 'Airflow TaskFlow ETL',
    freelance: true,
    stack: 'Python',
    blurb:
      'Astronomer / Apache Airflow example of TaskFlow ETL: pull live astronaut data, then process each result with dynamic task mapping for local orchestration.',
    tags: ['Python', 'Airflow', 'Astronomer', 'ETL'],
    url: 'https://github.com/psunil0001-sys/DAG-example',
  },
]

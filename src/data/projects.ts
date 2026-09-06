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
      'Agentic Kotlin/JUnit4 test generator for Android Gradle modules. A Google ADK planner/coder/fixer pipeline drafts tests, runs them through Gradle and Kover (with optional JaCoCo), then repairs only the generated test code until the selected acceptance tasks pass — backed by a local llama.cpp server or a remote OpenAI-compatible vLLM endpoint.',
    tags: ['Python', 'ADK', 'llama.cpp', 'vLLM', 'Gradle', 'Kover', 'Kotlin', 'JUnit4'],
    url: 'https://github.com/psunil0001-sys/LLM-Junit4-Unittest-Generator',
  },
  {
    slug: 'revops',
    title: 'RevOps',
    freelance: true,
    stack: 'Python',
    blurb:
      'Multi-fund portfolio tracker in Streamlit — mutual funds, ULIPs, and NPS schemes pulled from mfapi.in and local CSVs — with a manager-orchestrated research desk of five analysts (Fundamentals, Sentiment, News, Technical, Policy), Chroma memory, and bootstrap plus local-LLM-refined 60-day NAV scenario forecasts.',
    tags: ['Streamlit', 'Multi-Agent', 'ChromaDB', 'llama.cpp', 'Bootstrap', 'Python'],
    url: 'https://github.com/psunil0001-sys/revops',
  },
  {
    slug: 'calorietrack',
    title: 'CalorieTrack',
    freelance: true,
    stack: 'Dart',
    blurb:
      'Cross-platform Flutter calorie tracker built on the latest stable Flutter. Structured layer split (core / presentation / routes / theme / widgets), a full light-and-dark theming system, typed app routing, and reusable widgets for a responsive mobile experience.',
    tags: ['Flutter', 'Dart', 'Theming', 'Routing', 'Mobile'],
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

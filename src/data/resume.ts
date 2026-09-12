export const profile = {
  name: 'Sunilkumar Pathipati',
  firstName: 'Sunilkumar',
  lastName: 'Pathipati',
  title: 'Lead Engineer',
  headline: 'Python · AI · Forward Deployed Engineering · AUTOSAR',
  location: 'Bengaluru, Karnataka, India',
  email: 'psunil0001@gmail.com',
  phone: '+91-8686877689',
  phoneHref: 'tel:+918686877689',
  linkedin: 'https://www.linkedin.com/in/sunilkumar-pathipati-206098bb',
  github: 'https://github.com/psunil0001-sys',
  resumeFile: 'Sunilkumar_Pathipati_Resume.pdf',
  /** Total professional projects delivered across all roles (most are private, so not all are listed). */
  projectCount: 9,
  summary:
    'Lead Engineer with 9+ years in automotive software, embedded systems, and applied AI. Works in Python and C on AUTOSAR programs, machine-learning workflows, and Agile delivery. Safety-critical experience includes anti-lock braking software for eBikes and two-wheelers in ISO 26262 environments. Currently building Python automation and on-prem LLM tooling for infotainment test, alongside software integration, verification and validation, release management, and engineering productivity. Pursuing a PG Certificate in Forward Deployed AI Engineering (Futurense × IIT Roorkee).',
}

/** Web About copy — same facts as summary, split for reading. */
export const aboutParagraphs = [
  'Lead Engineer with 9+ years in automotive software, embedded systems, and applied AI. Core tools are Python and C, used on AUTOSAR programs, machine-learning workflows, and Agile teams.',
  'Safety-critical work includes anti-lock braking software for eBikes and two-wheelers, with ISO 26262 functional-safety process exposure.',
  'Current focus is Python automation and on-prem LLM tooling for infotainment test, plus integration, verification and validation, release management, and engineering productivity. Also pursuing a PG Certificate in Forward Deployed AI Engineering (Futurense × IIT Roorkee).',
]

export const skillGroups = [
  {
    label: 'Languages',
    items: ['Python', 'C', 'Embedded C', 'Bash', 'MATLAB'],
  },
  {
    label: 'AI & Machine Learning',
    items: ['Artificial Intelligence', 'Machine Learning', 'LLMs', 'llama.cpp', 'Data Analytics'],
  },
  {
    label: 'Automotive',
    items: ['AUTOSAR', 'ISO 26262', 'Android Infotainment', 'ABS Systems', 'Embedded Systems'],
  },
  {
    label: 'Tools',
    items: ['Git', 'GitHub', 'GitHub Actions', 'JFrog Artifactory', 'Linux', 'Simulink'],
  },
  {
    label: 'Core',
    items: [
      'Test Automation Frameworks',
      'Software Validation',
      'System Integration',
      'Release Management',
    ],
  },
  {
    label: 'Methods',
    items: [
      'Agile Development',
      'CI/CD Workflows',
      'Software Development Life Cycle',
      'Verification & Validation',
    ],
  },
]

export const spokenLanguages = ['English', 'Telugu', 'Hindi', 'Kannada', 'Tamil']

export type Role = {
  role: string
  company: string
  period: string
  location: string
  client?: string
  bullets: string[]
}

export const experience: Role[] = [
  {
    role: 'Lead Engineer',
    company: 'BlueBinaries Engineering and Solutions Pvt Ltd',
    period: 'September 2025 – Present',
    location: 'Bengaluru, Karnataka, India',
    client: 'Polestar',
    bullets: [
      'Lead Python automation and local llama.cpp LLM tooling for Polestar infotainment test and validation.',
      'Build AI tools for test generation, log analysis, defect investigation, knowledge retrieval, and engineering productivity.',
      'Own GitHub Actions workflows and Git-based development processes that streamline test, build, and release work.',
      'Use Python, Bash, and JFrog Artifactory to raise software quality and shorten validation cycles.',
      'Deploy and operate on-premises LLM tooling so automotive test environments stay off the public cloud.',
    ],
  },
  {
    role: 'Lead Engineer',
    company: 'Bosch Global Software Technologies',
    period: 'January 2024 – August 2025',
    location: 'Bengaluru, India · Reutlingen, Germany',
    bullets: [
      'Led automotive software development and validation for safety-critical embedded systems, including ISO 26262-compliant processes.',
      'Managed software integration, release management, verification, and validation across global programs.',
      'Led automation initiatives and engineering workflow improvements with international teams in Germany and India.',
      'Contributed to algorithm development, application development, and software release activities for automotive systems.',
    ],
  },
  {
    role: 'Specialist',
    company: 'Bosch Global Software Technologies',
    period: 'January 2023 – December 2023',
    location: 'Bengaluru, Karnataka, India',
    bullets: [
      'Developed and validated automotive software components for eBike and two-wheeler braking systems.',
      'Designed automation solutions and test frameworks to improve validation efficiency and software quality.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Bosch Global Software Technologies',
    period: 'December 2021 – January 2023',
    location: 'Bengaluru, India · Reutlingen, Germany',
    bullets: [
      'Worked on embedded software development, testing, debugging, and integration for automotive applications.',
      'Supported MATLAB/Simulink-based algorithm development and validation activities.',
      'Collaborated with international engineering teams in Germany on validation, automation, and software quality.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Bosch Global Software Technologies',
    period: 'July 2019 – December 2021',
    location: 'Bengaluru, Karnataka, India',
    bullets: [
      'Developed embedded automotive software and supported testing activities for safety-critical systems.',
      'Worked on software verification, validation, debugging, and release support.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'HCL Technologies',
    period: 'March 2017 – July 2019',
    location: 'Bengaluru, Karnataka, India',
    bullets: [
      'Developed and tested embedded software solutions for automotive clients.',
      'Supported system integration, validation, debugging, and software testing activities.',
      'Worked with Linux-based development environments and automotive software tools.',
    ],
  },
]

export const education = {
  degree: 'Bachelor of Technology in Electronics and Communications Engineering',
  school: 'Ramireddy Subbaramireddy Engineering College',
  period: '2012 – 2016',
  location: 'Andhra Pradesh, India',
}

export const certifications = [
  'PG Certificate in Forward Deployed AI Engineering (Futurense × IIT Roorkee) — in progress, expected Oct 2026',
  'Certified Data Scientist',
  'Data Science Foundation',
  'Deep Learning with Keras and TensorFlow',
]

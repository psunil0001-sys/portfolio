export const profile = {
  name: 'Sunilkumar Pathipati',
  firstName: 'Sunilkumar',
  lastName: 'Pathipati',
  title: 'Lead Engineer',
  headline: 'Python · AI · Test Frameworks · AUTOSAR',
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
    'Lead Engineer with 9+ years of experience in automotive software engineering, embedded systems, artificial intelligence, and application development. Expertise in Python, C, AUTOSAR, machine learning, and Agile development practices. Experienced in developing safety-critical automotive solutions, including anti-lock braking systems for eBikes and two-wheelers, with strong exposure to ISO 26262 functional safety environments. Skilled in Python-based automation frameworks, local LLM tooling, intelligent testing platforms, software integration, verification and validation, release management, and engineering productivity improvement.',
}

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
      'Developing Python-based automation frameworks and local LLM solutions using llama.cpp for automotive infotainment testing and validation.',
      'Building AI-powered tools for test generation, log analysis, defect investigation, knowledge retrieval, and engineering productivity.',
      'Designing and maintaining GitHub Actions workflows, Git-based development processes, and automation utilities to streamline testing, build, and release activities.',
      'Leveraging Python, Bash scripting, and JFrog Artifactory to improve software quality, engineering efficiency, and validation workflows.',
      'Supporting secure on-premises AI tooling and local model deployment for automotive software testing environments.',
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
  'Certified Data Scientist',
  'Data Science Foundation',
  'Deep Learning with Keras and TensorFlow',
]

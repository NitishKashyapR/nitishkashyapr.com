export interface Course {
  name: string;
  certUrl?: string;
}

export interface SubGroup {
  heading: string;
  provider: string;
  mainCertUrl?: string;
  courses: Course[];
  note?: string;
  description?: string;
}

export interface CertCategory {
  id: string;
  label: string;
  provider: string;
  mainCert: string;
  mainCertUrl?: string;
  icon: string;
  courses: Course[];
  subGroups?: SubGroup[];
  description: string;
}

export const certCategories: CertCategory[] = [
  {
    id: "project-management",
    label: "Advanced Management",
    provider: "Coursera",
    mainCert: "Google Project Management",
    mainCertUrl: "https://www.credly.com/badges/f464ef88-cf24-4903-b934-62b937ae0eb4/linked_in_profile",
    icon: "C",
    courses: [],
    subGroups: [
      {
        heading: "Google Project Management",
        provider: "Google — Coursera",
        mainCertUrl: "https://www.credly.com/badges/f464ef88-cf24-4903-b934-62b937ae0eb4/linked_in_profile",
        courses: [
          { name: "Foundations of Project Management", certUrl: "https://coursera.org/share/7d12077924b4d7c0aa386afc03d13542" },
          { name: "Project Initiation: Starting a Successful Project", certUrl: "https://coursera.org/share/ad0a89f52ff940eed1f9fac1e6a4b433" },
          { name: "Project Planning: Putting It All Together", certUrl: "https://coursera.org/share/1531ede393ffb408bdf2a23da19a8731" },
          { name: "Project Execution: Running the Project", certUrl: "https://coursera.org/share/e5b5d318e753692204f5823a27a9e9f3" },
          { name: "Agile Project Management", certUrl: "https://coursera.org/share/a3488fb4b77d771b92f67739a930e582" },
          { name: "Capstone: Applying Project Management in the Real World", certUrl: "https://coursera.org/share/b9128d055dc1d052d0e434b7cedb0a48" },
        ],
      },
      {
        heading: "Google People Management",
        provider: "Google — Coursera",
        mainCertUrl: "https://coursera.org/share/91475a0160cfc5c5ca48985966accb09",
        courses: [
          { name: "Create a High-Performing Team", certUrl: "https://coursera.org/share/9e8651ebdc8e1d337252050ffb14f99f" },
          { name: "Set and Achieve Team Goals", certUrl: "https://coursera.org/share/2a389054e5020d93444ce6222fe1a3e6" },
          { name: "Support Individual Growth and Development", certUrl: "https://coursera.org/share/b96d445a71d502d5ce6da56af212227c" },
          { name: "Grow as a Manager", certUrl: "https://coursera.org/share/0ad21312a768928a7afab27ad7be9dfc" },
        ],
      },
      {
        heading: "Introduction to Risk Management",
        provider: "NASBA — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/17b9bc3bdf92f6f869be2177296a5558a1e62c34e0319c5563707c9e2670dea1?trk=share_certificate",
        courses: [],
        description:
          "Introductory course on identifying, assessing, and mitigating organizational risks. Covers core risk management frameworks and how to apply them in day-to-day business decisions.",
      },
    ],
    description: "Developed practical knowledge in project planning, stakeholder coordination, risk management, and team leadership.",
  },
  {
    id: "artificial-intelligence",
    label: "AI & Technical Skills",
    provider: "Coursera",
    mainCert: "Google Prompting Essentials",
    icon: "G",
    courses: [],
    subGroups: [
      {
        heading: "Google AI Essentials",
        provider: "Google — Coursera",
        mainCertUrl: "https://coursera.org/share/76947c58b085a4ad9addaf64fed98064",
        courses: [
          { name: "Introduction to AI", certUrl: "https://coursera.org/share/072518e57748c25ad453a4ea80307e10" },
          { name: "Maximize Productivity With AI Tools", certUrl: "https://coursera.org/share/ccd8ecc7f7509dad4083f27dd9cfb26b" },
          { name: "Discover the Art of Prompting", certUrl: "https://coursera.org/share/5c3f9ff973057e969378da6318eeb6e2" },
          { name: "Use AI Responsibly", certUrl: "https://coursera.org/share/e3db2c7274175f976322e38fa0158977" },
          { name: "Stay Ahead of the AI Curve", certUrl: "https://coursera.org/share/1bd232b9a54bf6af1ca3961248408e13" },
        ],
      },
      {
        heading: "Google Prompting Essentials",
        provider: "Google — Coursera",
        mainCertUrl: "https://www.credly.com/badges/a2bb066f-ecb9-4412-9e8a-dd63e1843c9d/linked_in_profile",
        courses: [
          { name: "Start Writing Prompts Like a Pro", certUrl: "https://coursera.org/share/538ec42f165d6a592b3512e88409acae" },
          { name: "Design Prompts for Everyday Work Tasks", certUrl: "https://coursera.org/share/13ef475b624eaf9b30e21d0abbe64699" },
          { name: "Speed Up Data Analysis and Presentation Building", certUrl: "https://coursera.org/share/16366880714aab81e43b8e0f10cf68d0" },
          { name: "Use AI as a Creative or Expert Partner", certUrl: "https://coursera.org/share/d43552bf86631558d7917da101ab305e" },
        ],
      },
      {
        heading: "Google AI Professional",
        provider: "Google — Coursera",
        mainCertUrl: "https://www.coursera.org/account/accomplishments/professional-cert/PF2G8XYT596M",
        courses: [
          { name: "AI Fundamentals", certUrl: "https://coursera.org/share/6e448ace7434ff8b204263a399677d4b" },
          { name: "AI for Brainstorming and Planning", certUrl: "https://coursera.org/share/d9d48c1a9f65b63a843f51c1accd401d" },
          { name: "AI for Research and Insights", certUrl: "https://coursera.org/share/445b33b978a074c7ce444639dbe35f27" },
          { name: "AI for Writing and Communicating", certUrl: "https://coursera.org/share/19307886df66fc8c08e49f5a5667e41d" },
          { name: "AI for Content Creation", certUrl: "https://coursera.org/share/060c2c87dc7d55d7bdba7e01e32ef8a3" },
          { name: "AI for Data Analytics", certUrl: "https://coursera.org/share/b5eba89bdaaa6d3b9d124f50b2fbce68" },
          { name: "AI for App Building", certUrl: "https://coursera.org/share/7e6286ec4b266f036f0c1683aefa483d" },
        ],
      },
      {
        heading: "Generative AI for Executives and Business Leaders",
        provider: "IBM — Coursera",
        mainCertUrl: "https://coursera.org/share/abb271ff47e79bbb482ff9d7887be85e",
        courses: [
          { name: "GenAI for Executives & Business Leaders: An Introduction", certUrl: "https://coursera.org/share/b6120c2a10a01d688707206820544088" },
          { name: "GenAI for Execs & Business Leaders: Integration Strategy", certUrl: "https://coursera.org/share/5b142b7c6c4e1211df292db52b7f80f6" },
          { name: "GenAI for Execs & Business Leaders: Formulate Your Use Case", certUrl: "https://coursera.org/share/fbe5fe481fb9236d8f8e9af5ff1bfe7e" },
        ],
      },
      {
        heading: "Cyber Security Overview",
        provider: "Infosys",
        mainCertUrl: "/pdfs/Cyber_Security_Overview.pdf",
        courses: [],
        description:
          "Infosys foundational course covering essential cybersecurity principles, common threats, and best practices for safe digital behavior. Built awareness of risk identification, data protection, and secure workplace habits.",
      },
    ],
    description: "Focused on leveraging AI tools and core technology skills—including cybersecurity awareness—to enhance productivity, optimize workflows, and support smarter, safer decision-making.",
  },
  {
    id: "psychology",
    label: "Psychology & Human Behavior",
    provider: "Coursera",
    mainCert: "Positive Psychology Specialization",
    icon: "P",
    subGroups: [
      {
        heading: "Foundations of Positive Psychology",
        provider: "University of Pennsylvania — Coursera",
        mainCertUrl: "https://coursera.org/share/d8f1d19f5e93488584d6df9091492414",
        courses: [
          { name: "Positive Psychology: Martin E. P. Seligman's Visionary Science", certUrl: "https://coursera.org/share/f44a14c01038af49365ef361c426f049" },
          { name: "Positive Psychology: Applications and Interventions", certUrl: "https://coursera.org/share/ce6f3b16de23225e0c0e43c172f16b97" },
          { name: "Positive Psychology: Character, Grit and Research Methods", certUrl: "https://coursera.org/share/9f6855467f85da4fb60da7f4c1e5018d" },
          { name: "Positive Psychology: Resilience Skills", certUrl: "https://coursera.org/share/31ab59f391efabf994b23619df97d5b2" },
          { name: "Positive Psychology Specialization Project: Design Your Life for Well-being", certUrl: "https://coursera.org/share/fd5b4181926c36f469e3f11edebf7767" },
        ],
      },
      {
        heading: "Other Psychology & Behavioral Science",
        provider: "Yale, Wesleyan & More — Coursera",
        courses: [
          { name: "Introduction to Psychology", certUrl: "https://coursera.org/share/5db216560664adf14989daa0d8223e00" },
          { name: "The Science of Well-Being", certUrl: "https://coursera.org/share/801ab23d109b8c5cadc40efd7d098d6f" },
          { name: "Moralities of Everyday Life", certUrl: "https://coursera.org/share/eef5e61a89328c4f7d3010a4ed59cc05" },
          { name: "Social Psychology", certUrl: "https://coursera.org/share/30d561587636338817b20598a55b1f84" },
        ],
      },
    ],
    courses: [],
    description: "Built a strong understanding of human behavior, motivation, resilience, collaboration, and workplace well-being.",
  },
  {
    id: "hr",
    label: "HR",
    provider: "LinkedIn Learning",
    mainCert: "HR Certifications",
    icon: "L",
    courses: [],
    subGroups: [
      {
        heading: "Managing Organizational Change for HR Professionals",
        provider: "SHRM — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/6a758a5ef9ca2ed64b8a26393c9c5b032c74ab4365e990d067fa6da5062cb92b?trk=share_certificate",
        courses: [],
        description:
          "Focused on how HR professionals can lead and support organizational change initiatives. Covers change models, employee communication, and reducing resistance during transitions.",
      },
      {
        heading: "Generative AI in HR",
        provider: "SHRM — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/c25f3a120f6adf4b4bf48854e1f44485a8b6362933f8b33bb533e37f999b8c44?trk=share_certificate",
        courses: [],
        description:
          "Explores practical use cases of generative AI across core HR functions. Covers how AI can support tasks like policy drafting, employee communication, and everyday HR workflows responsibly.",
      },
      {
        heading: "Generative AI: Recruiting and Talent Acquisition",
        provider: "NASBA — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/c41db3e9cb5342ac05bcbdbc85ece86db1cfcf974db6be852549e9a28a275177?trk=share_certificate",
        courses: [],
        description:
          "Covers how generative AI is reshaping recruiting and talent acquisition. Focuses on smarter sourcing, job description writing, candidate screening, and improving the overall hiring experience.",
      },
    ],
    description: "HR-focused certifications covering people-side change management and the growing role of generative AI in HR operations and talent acquisition.",
  },
];

// Counting rule: a group with a main View button (mainCertUrl) counts as 1
// certificate. A group without a main View button contributes each of its
// sub-courses individually.
const countSubGroup = (sg: SubGroup): number =>
  sg.mainCertUrl ? 1 : Math.max(sg.courses.length, 1);

const countCategory = (cat: CertCategory): number => {
  if (cat.subGroups && cat.subGroups.length > 0) {
    return cat.subGroups.reduce((sum, sg) => sum + countSubGroup(sg), 0);
  }
  if (cat.mainCertUrl) return 1;
  return Math.max(cat.courses.length, 1);
};

export const getTotalCertCount = (): number =>
  certCategories.reduce((sum, cat) => sum + countCategory(cat), 0);

export const getCategoryCount = (categoryId: string): number => {
  const cat = certCategories.find((c) => c.id === categoryId);
  return cat ? countCategory(cat) : 0;
};

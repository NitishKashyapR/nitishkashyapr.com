export interface ProjectPdf {
  label: string;
  url: string;
  note?: string;
}

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  skills: string[];
  status: string;
  statusColor: "green" | "amber" | "blue";
  headerStyle: "indigo" | "emerald" | "amber" | "purple";
  live?: string;
  pdfs?: ProjectPdf[];
  pdf?: string;
  note?: string;
  details: {
    overview: string;
    objective: string;
    summary: string;
  };
}

export const projects: Project[] = [
  {
    title: "DigiColibri",
    subtitle: "Business Promotion Design",
    description: "A conceptual business designer to promote brands through strategic outreach and digital presence.",
    category: "Academic",
    skills: ["Business Model", "Market Strategy", "Digital Marketing"],
    status: "Completed",
    statusColor: "green",
    headerStyle: "indigo",
    live: "https://digicolibri.lovable.app",
    note: "Undertaken during my 1st semester of MBA as part of an academic initiative.\n\nThis website was put together for a college project and competition — a Shark Tank-style event where each team had to come up with a company and pitch it to investors. Our group of 12 members each took on different parts of the project — research, branding, business model, financials, presentation, and more — and together we shaped DigiColibri end-to-end.\n\nWe were lucky enough to win the competition, and one of the things that helped us stand out was having an actual working website for the brand, which made the pitch feel more real to the judges. I took on the website side of things and built it with the help of various AI tools for the design, content, and overall flow — a small contribution to a wider team effort.",
    details: {
      overview: "DigiColibri is a conceptual business model built around helping small and medium-sized brands grow their digital presence through strategic outreach, creative content, and targeted promotion.",
      objective: "To create an accessible and affordable digital promotion service that empowers emerging brands to compete in the online marketplace.",
      summary: "The project explores the end-to-end process of brand promotion — from identifying a client's unique value proposition to crafting compelling campaigns.",
    },
  },
  {
    title: "Seva Setu",
    subtitle: "Public Services App Proposal",
    description: "A digital platform connecting citizens with government authorities to improve issue reporting and resolution.",
    category: "Innovation",
    skills: ["Civic Tech", "App Design", "Public Policy"],
    status: "Completed",
    statusColor: "green",
    headerStyle: "emerald",
    pdf: "/pdfs/Seva_Setu.pdf",
    note: "Undertaken during my 1st semester of MBA as part of an academic initiative.\n\nThis was a team project with four of us working on it together. I initially pitched the core idea to the team — a single platform where citizens could report civic problems (like broken roads, water issues, or streetlight failures) to the right government department, track the status of their complaint, and also access a quick emergency response option for urgent situations. The aim was to remove the back-and-forth of figuring out which office to approach and to make civic issue reporting feel as simple as using any everyday app.\n\nFrom there, my teammates added their own thoughts and refinements — better workflows, additional use cases, and small touches that made the concept feel more complete. The final version of Seva Setu really came out of that shared back-and-forth, so credit very much goes to the whole team.\n\nThe proposal was unfortunately not accepted 😞 — but I still believe in the idea and the impact it could have made for everyday citizens. Sharing it here as a reminder that not every idea lands, and that's okay.",
    details: {
      overview: "Seva Setu is a digital platform concept designed to bridge the gap between citizens and government bodies.",
      objective: "To establish a seamless digital bridge for civic problem reporting, engineer assessment, public job creation, and emergency response.",
      summary: "The app features two core pillars: Civic Problem Resolution and Critical Emergency Response.",
    },
  },
  {
    title: "Market Research Study",
    subtitle: "Union Bank of India",
    description: "An in-depth market research study on Union Bank of India, analyzing consumer perception, service positioning, and brand claims.",
    category: "Research",
    skills: ["Market Research", "Data Analysis", "Reporting"],
    status: "Completed",
    statusColor: "green",
    headerStyle: "amber",
    pdfs: [
      {
        label: "Union Bank of India",
        url: "/pdfs/Union_Bank_of_India.pdf",
        note: "Undertaken during my 1st semester of MBA as part of an academic initiative. A focused study examining customer perception, the gap between the bank's brand claims and actual service delivery, and its positioning across customer segments.",
      },
    ],
    details: {
      overview: "A comprehensive market research study focused on analyzing consumer perceptions of product claims.",
      objective: "To understand the gap between product marketing claims and actual consumer experiences.",
      summary: "The study involved collecting and analyzing consumer feedback, comparing advertised claims with real-world product performance.",
    },
  },
  {
    title: "This Portfolio Website",
    subtitle: "Vibe Coded & Built by Me",
    description: "This very website you're viewing — designed, vibe coded, and built entirely by me using modern web technologies.",
    category: "Personal",
    skills: ["Vibe Coding", "AI Tools", "Web Design"],
    status: "Live",
    statusColor: "green",
    headerStyle: "purple",
    details: {
      overview: "A fully responsive, modern portfolio website built from the ground up.",
      objective: "To create a polished, professional online presence that reflects my skills, personality, and growth.",
      summary: "Features smooth animations, dynamic certification listings, interactive project cards, and a clean aesthetic.",
    },
  },
];

export const getProjectCount = (): number => projects.length;

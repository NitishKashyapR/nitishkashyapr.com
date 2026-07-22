import SectionHeader from "@/components/SectionHeader";

const education = [
  {
    years: "2025 — Now",
    status: "Pursuing",
    statusStyle: "bg-g1/10 text-g1 border border-g1/20",
    dotColor: "bg-g1",
    degree: "Master of Business Administration (MBA)",
    school: "VIMTECH, Tumkur · HR Specialization",
    desc: "Currently pursuing an MBA with a specialization in Human Resources, focusing on people strategy, leadership development, and organizational effectiveness.",
  },
  {
    years: "2022 — 2025",
    status: "Completed",
    statusStyle: "bg-background text-ink-3 border border-border",
    degree: "Bachelor of Commerce (B.Com) – Accounting and Finance",
    school: "Vidyavahini First Grade College",
    desc: "Built strong foundations in accounting, finance, and core business principles.",
  },
  {
    years: "2020 — 2022",
    status: "Completed",
    statusStyle: "bg-background text-ink-3 border border-border",
    degree: "Pre-University Course (Commerce)",
    school: "Sri Vani PU College",
    desc: "Commerce stream with a focus on foundational business subjects.",
  },
];

const EducationSection = () => (
  <div className="bg-card border-y border-border" id="education">
    <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24">
      <SectionHeader number="03" label="Education" title="" titleAccent="Academic Journey" />

      <div className="border border-border rounded-[20px] overflow-hidden bg-card">
        {education.map((edu, i) => (
          <div
            key={edu.degree}
            className={`grid grid-cols-1 md:grid-cols-[200px_1fr] transition-colors hover:bg-surface-1 ${
              i < education.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="px-5 md:px-8 py-5 md:py-8 md:border-r border-border flex flex-row md:flex-col gap-3 md:gap-2.5 items-center md:items-start justify-start">
              <div className="text-[0.78rem] font-bold text-ink-3 tracking-wide">{edu.years}</div>
              <span className={`inline-flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-full w-fit ${edu.statusStyle}`}>
                {edu.dotColor && <span className={`w-[5px] h-[5px] rounded-full ${edu.dotColor}`} />}
                {edu.status}
              </span>
            </div>
            <div className="px-5 md:px-8 pb-5 md:py-8">
              <div className="font-heading text-[1.05rem] font-bold text-foreground mb-1.5 leading-[1.35]">{edu.degree}</div>
              <div className="text-[0.78rem] font-semibold text-p1 mb-2">{edu.school}</div>
              <div className="text-[0.8rem] text-ink-3 leading-[1.7]">{edu.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default EducationSection;

import { Users, Monitor, Heart } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const skills = [
  {
    name: "Core Competencies",
    icon: Users,
    barClass: "from-p1 to-p2",
    iconBg: "from-p1/10 to-p3/10",
    iconColor: "text-p1",
    tags: ["Human Resource Management", "Organizational Behavior", "Strategic Thinking", "Communication", "Problem Solving", "Team Collaboration"],
  },
  {
    name: "Technical & Digital",
    icon: Monitor,
    barClass: "from-g1 to-g2",
    iconBg: "from-g1/10 to-g2/10",
    iconColor: "text-g1",
    tags: ["Prompt Engineering", "Generative AI Tools", "No-Code & AI-Assisted Development", "AI-Assisted Productivity", "Local LLM Deployment", "AI Tool Integration", "Digital Environment Optimization"],
  },
  {
    name: "Professional Interests",
    icon: Heart,
    barClass: "from-o1 to-o2",
    iconBg: "from-o1/10 to-o2/10",
    iconColor: "text-o1",
    tags: ["Talent Management", "Employee Engagement", "Learning & Development", "Organizational Development", "Workplace Culture", "Leadership Development"],
  },
];

const SkillsSection = () => (
  <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24" id="skills">
    <SectionHeader
      number="02"
      label="Skills"
      title="Skills &"
      titleAccent="Expertise"
      description="HR-aligned competencies built through academics and project work."
      chip="3 Categories"
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <div key={skill.name} className="bg-card border-2 border-bd2 rounded-[20px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] hover:border-p1/20">
          <div className="px-6 pt-6">
            <div className={`h-[3px] -mx-6 -mt-6 mb-6 bg-gradient-to-r ${skill.barClass}`} />
            <div className={`w-10 h-10 rounded-[11px] bg-gradient-to-br ${skill.iconBg} flex items-center justify-center mb-3.5`}>
              <skill.icon className={`w-[18px] h-[18px] ${skill.iconColor}`} />
            </div>
            <div className="text-[0.9rem] font-bold text-foreground mb-5 font-heading">{skill.name}</div>
          </div>
          <div className="bg-muted/40 border-t border-border px-6 py-5">
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span key={tag} className="text-[0.7rem] font-medium px-3 py-1 rounded-full bg-card border border-bd2 text-ink-2 transition-all duration-150 hover:bg-surface-1 hover:border-p1/30 hover:text-p1 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkillsSection;

import { Monitor, MessageSquare, BarChart3, Users, RefreshCw, CheckSquare } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const strengths = [
  { icon: Monitor, title: "AI Proficiency, Prompt Engineering & Vibe Coding", desc: "Hands-on with AI tools, prompt design, and vibe coding to build and ship faster.", glow: "bg-p1", iconBg: "from-p1/10 to-p3/10", iconColor: "text-p1" },
  { icon: MessageSquare, title: "Strong Communication", desc: "Clear and confident at presenting ideas and aligning stakeholders.", glow: "bg-g1", iconBg: "from-g1/10 to-g2/10", iconColor: "text-g1" },
  { icon: BarChart3, title: "Analytical Thinking", desc: "Breaks down complex problems using evidence-based reasoning.", glow: "bg-o1", iconBg: "from-o1/10 to-o2/10", iconColor: "text-o1" },
  { icon: Users, title: "Leadership & Team Collaboration", desc: "Motivates teams and drives results in project environments.", glow: "bg-r1", iconBg: "from-r1/10 to-[rgba(244,114,182,0.1)]", iconColor: "text-r1" },
  { icon: RefreshCw, title: "Adaptability", desc: "Quickly picks up new tools and responsibilities with ease.", glow: "bg-p2", iconBg: "from-p2/10 to-[rgba(167,139,250,0.1)]", iconColor: "text-p2" },
  { icon: CheckSquare, title: "Structured Problem Solving", desc: "Identifies root causes and designs clear methodical solutions.", glow: "bg-g2", iconBg: "from-g2/10 to-[rgba(34,211,238,0.1)]", iconColor: "text-g2" },
];

const StrengthsSection = () => (
  <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24">
    <SectionHeader
      number="04"
      label="Strengths"
      title="Key"
      titleAccent="Strengths"
      description="Core capabilities that define how I work."
      chip="6 Strengths"
    />

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-3.5">
      {strengths.map((s) => (
        <div key={s.title} className="bg-card border border-border rounded-[18px] p-5 md:p-6 relative overflow-hidden transition-all duration-200 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]">
          <div className={`absolute w-[120px] h-[120px] rounded-full opacity-[0.06] -top-[30px] -right-[30px] pointer-events-none ${s.glow}`} />
          <div className={`w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br ${s.iconBg} flex items-center justify-center mb-3.5 relative z-[1]`}>
            <s.icon className={`w-4 h-4 ${s.iconColor}`} />
          </div>
          <div className="text-[0.86rem] font-bold text-foreground mb-1.5 font-heading relative z-[1]">{s.title}</div>
          <div className="text-[0.76rem] text-ink-3 leading-[1.65] relative z-[1]">{s.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export default StrengthsSection;

import { GraduationCap, Pen, Monitor } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.png";
import { getTotalCertCount } from "@/data/certifications";
import { getProjectCount } from "@/data/projects";

const HeroSection = () => {
  const certCount = getTotalCertCount();
  const projectCount = getProjectCount();

  return (
    <section className="min-h-[calc(100vh-60px)] grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px] 2xl:grid-cols-[1fr_600px] relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_65%)] -top-[200px] -right-[100px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_65%)] -bottom-[150px] -left-[100px] pointer-events-none" />

      {/* Left */}
      <div className="px-5 md:px-16 xl:px-24 2xl:px-32 py-12 md:py-20 flex flex-col justify-center relative z-[1]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-p1/20 text-[0.7rem] font-semibold text-p1 mb-8 w-fit tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-g1 animate-pulse-dot" />
          AI-Enabled HR Professional · Open to Opportunities
        </div>

        <h1 className="font-heading text-[clamp(3.2rem,5.8vw,6rem)] font-extrabold text-foreground leading-[0.92] tracking-[-0.035em] mb-7">
          Hey There,<br />
          I'm <span className="gradient-text">Nitish</span><br />
          Kashyap R
        </h1>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {["MBA Student", "Aspiring HR Professional", "People Strategy"].map((badge, i) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="text-[0.7rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-md bg-gradient-to-br from-p1/[0.08] to-p3/[0.08] border border-p1/15 text-p2">
                {badge}
              </span>
              {i < 2 && <span className="w-[3px] h-[3px] rounded-full bg-ink-4" />}
            </span>
          ))}
        </div>

        <p className="text-[0.9rem] text-ink-2 leading-[1.85] max-w-[520px] mb-4">
          Future-ready HR professional passionate about building strong workplace cultures, enhancing employee engagement, and supporting organizational growth through people-focused strategies and modern technology.
        </p>
        <p className="text-[0.82rem] text-ink-3 leading-[1.75] max-w-[480px] mb-10 italic">
          Seeking internship opportunities to apply my HR knowledge, analytical thinking, and AI skills to contribute meaningfully to organizational success.
        </p>

        <div className="flex items-center gap-3 flex-wrap mb-12">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3.5 rounded-[10px] bg-gradient-to-br from-p1 to-p2 text-primary-foreground font-bold text-[0.82rem] tracking-wide shadow-[0_4px_14px_rgba(99,102,241,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.4)] active:scale-[0.97]"
          >
            Let's Talk →
          </button>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3.5 rounded-[10px] bg-card text-ink-2 font-semibold text-[0.82rem] border-[1.5px] border-[hsl(var(--bd2))] transition-all duration-200 hover:border-p1 hover:text-p1 hover:bg-surface-1 active:scale-[0.97]"
          >
            View My Work
          </button>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {[
            { icon: GraduationCap, num: `${certCount}+`, label: "Certifications", colors: "from-p1/[0.12] to-p3/[0.12]", stroke: "text-p1" },
            { icon: Pen, num: String(projectCount), label: "Projects", colors: "from-g1/[0.12] to-g2/[0.12]", stroke: "text-g1" },
            { icon: Monitor, num: "MBA", label: "HR Focus", colors: "from-o1/[0.12] to-o2/[0.12]", stroke: "text-o1" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-[10px] px-4 py-3 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className={`w-7 h-7 rounded-[7px] bg-gradient-to-br ${stat.colors} flex items-center justify-center`}>
                <stat.icon className={`w-3.5 h-3.5 ${stat.stroke}`} />
              </div>
              <div>
                <div className="text-[0.95rem] font-extrabold text-foreground leading-none">{stat.num}</div>
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-ink-3 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Photo card */}
      <div className="relative z-[1] flex items-center justify-center p-8 lg:p-10">
        <div className="absolute w-[380px] h-[380px] rounded-full bg-[conic-gradient(from_180deg,rgba(99,102,241,0.15),rgba(168,85,247,0.12),rgba(236,72,153,0.1),rgba(16,185,129,0.08),rgba(99,102,241,0.15))] blur-[40px]" />
        <div className="relative z-[1] w-full max-w-[360px]">
          <div className="w-full aspect-[3/4] rounded-3xl bg-gradient-to-br from-surface-1 via-[#ede9fe] to-[#fce7f3] border border-p1/15 flex items-center justify-center overflow-hidden shadow-[0_20px_60px_rgba(99,102,241,0.15),0_4px_16px_rgba(0,0,0,0.06)] mb-4">
            <img src={heroPhoto} alt="Nitish Kashyap R" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
          </div>

          {/* Floating tags */}
          <div className="hidden lg:flex absolute -top-4 -right-5 bg-card border border-border rounded-xl px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] items-center gap-2 z-[2]">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-p1/10 to-p3/10 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-p2" />
            </div>
            <div>
              <div className="text-[0.86rem] font-extrabold text-foreground leading-none">MBA</div>
              <div className="text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-ink-3 mt-0.5">HR Specialization</div>
            </div>
          </div>

          <div className="hidden lg:flex absolute bottom-20 -left-6 bg-card border border-border rounded-xl px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] items-center gap-2 z-[2]">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-g1/10 to-g2/10 flex items-center justify-center">
              <Monitor className="w-3.5 h-3.5 text-g1" />
            </div>
            <div>
              <div className="text-[0.86rem] font-extrabold text-foreground leading-none">AI</div>
              <div className="text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-ink-3 mt-0.5">Enabled HR</div>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-card border border-border rounded-[14px] px-4 py-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
            <p className="text-[0.8rem] text-ink-2 leading-[1.65] italic">
              "Combining human insight with innovative solutions to support effective people management."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

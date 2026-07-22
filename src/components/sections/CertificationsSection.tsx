import { GraduationCap, Pen, Monitor, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
import { getTotalCertCount, getCategoryCount } from "@/data/certifications";

const CertificationsSection = () => {
  const navigate = useNavigate();
  const total = getTotalCertCount();

  return (
    <div className="bg-card border-y border-border" id="certifications">
      <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24">
        <SectionHeader number="05" label="Credentials" title="Professional" titleAccent="Certifications" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left - dark card */}
          <div className="rounded-3xl p-10 md:p-14 bg-gradient-to-br from-[hsl(var(--ink))] via-[#1e1b4b] to-[#2d1b69] flex flex-col justify-between relative overflow-hidden min-h-[340px]">
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.3)_0%,transparent_70%)] -top-20 -right-[60px]" />
            <div className="absolute w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2)_0%,transparent_70%)] -bottom-[50px] -left-10" />
            <div>
              <div className="font-heading text-[7rem] font-extrabold leading-[0.85] tracking-[-0.04em] relative z-[1] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                {total}+
              </div>
              <div className="text-[0.86rem] font-medium text-white/50 mb-7 relative z-[1]">Professional Certifications</div>
              <p className="text-[0.84rem] text-white/40 leading-[1.8] mb-7 max-w-[320px] relative z-[1]">
                Continuously upskilling across AI, management, psychology, and HR to stay ahead in a fast-changing world.
              </p>
            </div>
            <button
              onClick={() => navigate("/certifications")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-white/10 text-white border border-white/20 text-[0.78rem] font-semibold transition-all duration-200 hover:bg-white/20 hover:border-white/40 w-fit relative z-[1] tracking-wide active:scale-[0.97]"
            >
              View All Certifications →
            </button>
          </div>

          {/* Right - stat cards */}
          <div className="flex flex-col gap-3.5">
            {[
              { icon: GraduationCap, num: `+${total}`, label: "Total Certifications", bg: "from-p1/10 to-p3/10", color: "text-p1" },
              { icon: Monitor, num: String(getCategoryCount("artificial-intelligence")), label: "In AI & Technology", bg: "from-g1/10 to-g2/10", color: "text-g1" },
              { icon: Pen, num: String(getCategoryCount("project-management")), label: "In Advanced Management", bg: "from-o1/10 to-o2/10", color: "text-o1" },
              { icon: Users, num: String(getCategoryCount("hr")), label: "In HR", bg: "from-r1/10 to-r1/10", color: "text-r1" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-2xl px-6 py-5 flex items-center gap-4 flex-1 transition-all duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:translate-x-1">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="font-heading text-[2rem] font-extrabold text-foreground leading-none">{item.num}</div>
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-ink-3 mt-1">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsSection;

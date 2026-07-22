import SectionHeader from "@/components/SectionHeader";
import { getTotalCertCount } from "@/data/certifications";

const AboutSection = () => {
  const certCount = getTotalCertCount();

  return (
    <div className="bg-card border-y border-border" id="about">
      <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24">
        <SectionHeader
          number="01"
          label="About Me"
          title='Who I'
          titleAccent="Am"
          description="MBA student specializing in HR with a passion for people, technology, and growth."
        />

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">
          {/* Philosophy - spans 2 cols */}
          <div className="md:col-span-2 bg-card border border-border rounded-[20px] p-8 transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] border-t-[3px] border-t-p1">
            <div className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-p1 mb-3">Philosophy</div>
            <p className="text-[1.1rem] italic text-foreground leading-[1.6]">
              "Combining human insight with innovative solutions to support effective people management and organizational success."
            </p>
          </div>

          {/* About Me */}
          <div className="bg-card border border-border rounded-[20px] p-8 transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] border-t-[3px] border-t-g1">
            <div className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-g1 mb-3">About Me</div>
            <div className="text-[0.84rem] text-ink-2 leading-[1.9] space-y-3">
              <p>I am an MBA student specializing in Human Resources with a strong interest in talent management, organizational development, and workplace culture.</p>
              <p>With growing proficiency in AI tools, I aim to combine human insight with innovative solutions for effective people management.</p>
              <p>I actively seek opportunities to contribute, grow, and develop as a future HR leader.</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-[20px] p-8 transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] border-t-[3px] border-t-o1">
            <div className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-o1 mb-3">Achievements</div>
            <div className="font-heading text-[3.2rem] font-extrabold text-foreground leading-none mb-1">
              {certCount}<span className="text-[1.4rem] font-semibold text-p1">+</span>
            </div>
            <div className="text-[0.72rem] font-semibold text-ink-3 uppercase tracking-[0.07em]">Certifications Earned</div>
            <div className="flex flex-wrap gap-[7px] mt-3.5">
              {["AI & Technology", "Advanced Management", "Psychology", "HR"].map((tag) => (
                <span key={tag} className="text-[0.68rem] font-medium px-3 py-1 rounded-full bg-surface-1 text-p2 border border-p1/[0.12]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

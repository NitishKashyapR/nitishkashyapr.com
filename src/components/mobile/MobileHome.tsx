import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Monitor, Heart, MessageSquare, BarChart3, Compass, RefreshCw, CheckSquare, Mail, Linkedin } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.png";
import { projects, getProjectCount } from "@/data/projects";
import { getTotalCertCount, getCategoryCount } from "@/data/certifications";

const skillGroups = [
  {
    Icon: Users,
    iconBg: "var(--mh-primary-tint)",
    iconColor: "hsl(var(--p1))",
    name: "Core Competencies",
    tags: ["Human Resource Management", "Organizational Behavior", "Strategic Thinking", "Communication", "Problem Solving", "Team Collaboration"],
  },
  {
    Icon: Monitor,
    iconBg: "var(--mh-sage-bg)",
    iconColor: "hsl(var(--g1))",
    name: "Technical & Digital",
    tags: ["Prompt Engineering", "Generative AI Tools", "No-Code & AI-Assisted Dev", "AI-Assisted Productivity", "Local LLM Deployment", "AI Tool Integration"],
  },
  {
    Icon: Heart,
    iconBg: "var(--mh-peach-bg)",
    iconColor: "hsl(var(--o1))",
    name: "Professional Interests",
    tags: ["Talent Management", "Employee Engagement", "Learning & Development", "Organizational Development", "Workplace Culture", "Leadership Development"],
  },
];

const strengths = [
  { Ic: Monitor, t: "AI & Vibe Coding", d: "Builds and ships faster with AI tools.", color: "hsl(var(--p1))", bg: "hsl(var(--p1) / 0.10)" },
  { Ic: MessageSquare, t: "Communication", d: "Clear at aligning stakeholders.", color: "hsl(var(--g1))", bg: "hsl(var(--g1) / 0.10)" },
  { Ic: BarChart3, t: "Analytical Thinking", d: "Evidence-based reasoning.", color: "hsl(var(--o1))", bg: "hsl(var(--o1) / 0.10)" },
  { Ic: Compass, t: "Leadership", d: "Motivates teams, drives results.", color: "hsl(var(--r1))", bg: "hsl(var(--r1) / 0.10)" },
  { Ic: RefreshCw, t: "Adaptability", d: "Picks up new tools with ease.", color: "hsl(var(--p2))", bg: "hsl(var(--p2) / 0.10)" },
  { Ic: CheckSquare, t: "Problem Solving", d: "Root-cause, structured solutions.", color: "hsl(var(--g2))", bg: "hsl(var(--g2) / 0.10)" },
];

const education = [
  { years: "2025 — Now", status: "Pursuing", now: true, degree: "MBA — HR Specialization", school: "VIMTECH, Tumkur" },
  { years: "2022 — 2025", status: "Completed", now: false, degree: "B.Com — Accounting & Finance", school: "Vidyavahini First Grade College" },
  { years: "2020 — 2022", status: "Completed", now: false, degree: "PUC — Commerce", school: "Sri Vani PU College" },
];

const testimonials = [
  { initial: "R", text: "Nitish is a good listener in group discussions and is open to others' ideas before settling on a direction.", who: "Research Partner · Academic Collaborator" },
  { initial: "T", text: "A dependable teammate who takes his share of the work seriously and is easy to coordinate with.", who: "Teammate · MBA Group Partner" },
  { initial: "M", text: "He often shows the team simple ways to use AI tools in our HR assignments, which has been genuinely helpful.", who: "Study Group Member · MBA Colleague" },
  { initial: "S", text: "Working with Nitish on our HR case study was smooth — he helps break the problem into smaller parts.", who: "Case Study Partner · MBA Classmate" },
];

const navTabs = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills-mh", label: "Skills" },
  { id: "education-mh", label: "Education" },
  { id: "credentials-mh", label: "Credentials" },
  { id: "contact-mh", label: "Contact" },
];

const headerStyleToBadge: Record<string, string> = {
  indigo: "Academic",
  emerald: "Innovation",
  amber: "Research",
  purple: "Personal",
};

const MobileHome = () => {
  const navigate = useNavigate();
  const [openSkill, setOpenSkill] = useState<number>(0);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [testiIndex, setTestiIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [contactOpen, setContactOpen] = useState(false);

  const certCount = getTotalCertCount();
  const projectCount = getProjectCount();

  useEffect(() => {
    const id = setInterval(() => setTestiIndex((i) => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, []);

  const scrollToId = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const activeTesti = testimonials[testiIndex];

  return (
    <div className="mh-root">
      <div className="mh-page">
        <div className="mh-content">
          {/* Topbar */}
          <div className="mh-topbar">
            <div className="mh-brand-row">
              <div className="mh-brand">NK</div>
              <div className="mh-status-chip">
                <span className="mh-dot" />
                Open to opportunities
              </div>
            </div>
            <nav className="mh-tabnav" aria-label="Sections">
              {navTabs.map((t) => (
                <button
                  key={t.id}
                  className={`mh-tab ${activeTab === t.id ? "is-active" : ""}`}
                  onClick={() => scrollToId(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Hero */}
          <header className="mh-hero">
            <div className="mh-eyebrow">
              <span className="mh-dot" />
              AI-Enabled HR Professional
            </div>
            <div className="mh-hero-photo">
              <img src={heroPhoto} alt="Nitish Kashyap R" loading="eager" />
            </div>
            <h1 className="mh-hero-name">
              Hey There, I'm <span className="mh-grad-text">Nitish Kashyap R</span>
            </h1>
            <div className="mh-hero-role">MBA Student · Aspiring HR Professional · People Strategy</div>
            <p className="mh-hero-copy">
              Future-ready HR professional passionate about building strong workplace cultures, enhancing employee engagement, and supporting organizational growth through people-focused strategies and modern technology.
            </p>
            <div className="mh-cta-row">
              <button className="mh-btn mh-btn-primary" onClick={() => scrollToId("contact-mh")}>Let's Talk →</button>
              <button className="mh-btn mh-btn-ghost" onClick={() => scrollToId("work")}>View My Work</button>
            </div>
            <div className="mh-stat-strip">
              <div className="mh-stat"><b className="mh-grad-text">{certCount}+</b><span>Certifications</span></div>
              <div className="mh-stat"><b className="mh-grad-text">{String(projectCount).padStart(2, "0")}</b><span>Projects</span></div>
              <div className="mh-stat"><b className="mh-grad-text">MBA</b><span>HR Focus</span></div>
            </div>
          </header>

          {/* About */}
          <section className="mh-card-section" id="about">
            <div className="mh-section-head">
              <div className="mh-section-title">Who I Am</div>
              <div className="mh-section-eyebrow">01 / About</div>
            </div>
            <div className="mh-quote">"Combining human insight with innovative solutions to support effective people management."</div>
            <div className={`mh-body-text ${aboutExpanded ? "" : "mh-clamp"}`}>
              I am an MBA student specializing in Human Resources with a strong interest in talent management, organizational development, and workplace culture. With growing proficiency in AI tools, I aim to combine human insight with innovative solutions for effective people management. I actively seek opportunities to contribute, grow, and develop as a future HR leader.
            </div>
            <button className="mh-read-more" onClick={() => setAboutExpanded((e) => !e)}>
              {aboutExpanded ? "Show less" : "Read more"}
            </button>
          </section>

          {/* Work */}
          <section className="mh-card-section" id="work">
            <div className="mh-section-head">
              <div className="mh-section-title">Projects & Experience</div>
              <div className="mh-section-eyebrow">02 / Work</div>
            </div>
            <div className="mh-rail-hint">← Swipe to see all {projects.length} →</div>
            <div className="mh-rail">
              {projects.map((p, i) => (
                <button
                  key={p.title}
                  className="mh-case"
                  onClick={() => navigate(`/projects#${p.title.toLowerCase().replace(/\s+/g, "-")}`)}
                >
                  <div className="mh-case-tab" />
                  <div className="mh-case-body">
                    <div className="mh-case-cat">{p.category}</div>
                    <div className="mh-case-title">{p.title}</div>
                    <div className="mh-case-sub">{p.subtitle}</div>
                    <div className="mh-case-desc">{p.description}</div>
                    <div className="mh-case-foot">
                      <span className="mh-status-pill">● {p.status}</span>
                      <span className="mh-case-link">View →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button className="mh-view-all" onClick={() => navigate("/projects")}>
              View All Projects →
            </button>
          </section>

          {/* Skills */}
          <section className="mh-card-section" id="skills-mh">
            <div className="mh-section-head">
              <div className="mh-section-title">Skills & Expertise</div>
              <div className="mh-section-eyebrow">03 / Skills</div>
            </div>
            {skillGroups.map((s, i) => {
              const open = openSkill === i;
              return (
                <div key={s.name} className="mh-accordion-item">
                  <button
                    className="mh-accordion-trigger"
                    aria-expanded={open}
                    onClick={() => setOpenSkill(open ? -1 : i)}
                  >
                    <span className="mh-acc-label">
                      <span className="mh-icon-chip" style={{ background: s.iconBg, color: s.iconColor }}>
                        <s.Icon size={16} strokeWidth={2.2} />
                      </span>
                      {s.name}
                    </span>
                    <span className={`mh-plus ${open ? "is-open" : ""}`}>+</span>
                  </button>
                  <div className={`mh-accordion-panel ${open ? "is-open" : ""}`}>
                    <div className="mh-accordion-panel-inner">
                      <div className="mh-chip-row">
                        {s.tags.map((t) => <span key={t} className="mh-chip">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Strengths */}
          <section className="mh-card-section">
            <div className="mh-section-head">
              <div className="mh-section-title">Key Strengths</div>
              <div className="mh-section-eyebrow">04 / Strengths</div>
            </div>
            <div className="mh-grid2">
              {strengths.map((s) => (
                <div key={s.t} className="mh-strength">
                  <span className="mh-str-ic" style={{ background: s.bg, color: s.color }}>
                    <s.Ic size={16} strokeWidth={2.2} />
                  </span>
                  <div className="mh-str-t">{s.t}</div>
                  <div className="mh-str-d">{s.d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mh-card-section" id="education-mh">
            <div className="mh-section-head">
              <div className="mh-section-title">Academic Journey</div>
              <div className="mh-section-eyebrow">05 / Education</div>
            </div>
            {education.map((e) => (
              <div key={e.degree} className="mh-tl-item">
                <div className="mh-tl-top">
                  <span className="mh-tl-year">{e.years}</span>
                  <span className={`mh-tl-status ${e.now ? "is-now" : "is-done"}`}>{e.status}</span>
                </div>
                <div className="mh-tl-degree">{e.degree}</div>
                <div className="mh-tl-school">{e.school}</div>
              </div>
            ))}
          </section>

          {/* Credentials */}
          <section className="mh-card-section" id="credentials-mh">
            <div className="mh-section-head">
              <div className="mh-section-title">Credentials</div>
              <div className="mh-section-eyebrow">06 / Proof</div>
            </div>
            <div className="mh-cert-band">
              <div className="mh-cert-num">{certCount}+</div>
              <div className="mh-cert-t">Professional Certifications</div>
              <div className="mh-cert-d">Continuously upskilling across AI, management, psychology, and HR.</div>
              <button className="mh-cert-band-btn" onClick={() => navigate("/certifications")}>View All Certifications →</button>
            </div>
            <div className="mh-mini-stats">
              <div className="mh-mini-stat"><b>{getCategoryCount("artificial-intelligence")}</b><span>AI & Tech</span></div>
              <div className="mh-mini-stat"><b>{getCategoryCount("project-management")}</b><span>Management</span></div>
              <div className="mh-mini-stat"><b>{getCategoryCount("psychology")}</b><span>Psychology</span></div>
              <div className="mh-mini-stat"><b>{getCategoryCount("hr")}</b><span>HR</span></div>
            </div>
            <div className="mh-testi">
              <div className="mh-testi-avatar">{activeTesti.initial}</div>
              <div>
                <div className="mh-testi-text">"{activeTesti.text}"</div>
                <div className="mh-testi-who">{activeTesti.who}</div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <div className="mh-contact-band" id="contact-mh">
            <div className="mh-contact-eyebrow">07 — Get in touch</div>
            <div className="mh-contact-title">
              Let's Build Something <span className="mh-grad-alt">Meaningful.</span>
            </div>
            <p className="mh-contact-copy">Open to internships, learning opportunities, and collaborative projects that help me grow professionally.</p>
            <button className="mh-say-hi-btn" onClick={() => setContactOpen(true)}>
              <span className="mh-say-hi-shine" aria-hidden="true" />
              <span className="mh-say-hi-label">Start By Saying Hi</span>
              <span className="mh-say-hi-emoji" aria-hidden="true">👋🏻</span>
            </button>
            <a className="mh-contact-btn" href="https://www.linkedin.com/in/nitishkashyapr" target="_blank" rel="noopener noreferrer" style={{ marginTop: 12 }}>
              <Linkedin size={15} strokeWidth={2.4} /> Connect on LinkedIn
            </a>
          </div>

          <div className="mh-footer">Nitish Kashyap R — Portfolio 2026<br />© 2026 All Rights Reserved</div>
        </div>
      </div>

      {contactOpen && (
        <div className="mh-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setContactOpen(false)}>
          <div className="mh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mh-modal-title">How would you like to reach out?</div>
            <p className="mh-modal-copy">Pick your preferred channel — I'll get back to you either way.</p>
            <a
              className="mh-modal-opt is-primary"
              href="mailto:nitishkashyapr8@gmail.com?subject=Hi%20Nitish"
              onClick={() => setContactOpen(false)}
            >
              <span className="mh-modal-ic"><Mail size={18} strokeWidth={2.2} /></span>
              <div>
                <b>Send an Email</b>
                <small>nitishkashyapr8@gmail.com</small>
              </div>
            </a>
            <a
              className="mh-modal-opt"
              href="https://www.linkedin.com/messaging/compose/?recipient=nitishkashyapr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setContactOpen(false)}
            >
              <span className="mh-modal-ic"><Linkedin size={18} strokeWidth={2.2} /></span>
              <div>
                <b>Message on LinkedIn</b>
                <small>Opens LinkedIn chat</small>
              </div>
            </a>
            <button className="mh-modal-close" onClick={() => setContactOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHome;
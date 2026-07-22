import { useState, useEffect, useRef } from "react";
import { BadgeCheck, ChevronDown, ExternalLink, ArrowLeft, BarChart3, Lightbulb, Heart, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { certCategories, getCategoryCount } from "@/data/certifications";
import Footer from "@/components/Footer";
import ibmLogo from "@/assets/logos/ibm.png";
import infosysLogo from "@/assets/logos/infosys.png";
import nasbaLogoAsset from "@/assets/nasba-logo.png.asset.json";
import shrmLogoAsset from "@/assets/shrm-logo.png.asset.json";

const sidebarItems = [
  { id: "project-management", label: "Advanced Management", icon: BarChart3 },
  { id: "artificial-intelligence", label: "AI & Technical Skills", icon: Lightbulb },
  { id: "psychology", label: "Psychology & Human Behavior", icon: Heart },
  { id: "hr", label: "HR", icon: Users },
];

const AccordionBody = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
    >
      <div ref={ref} className="flex flex-col gap-2 px-[18px] pb-3.5">
        {children}
      </div>
    </div>
  );
};

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AnthropicLogo = () => (
  <div className="w-5 h-5 rounded bg-[#1a1a2e] flex items-center justify-center">
    <svg viewBox="0 0 16 16" className="w-3 h-3">
      <path d="M8 2L14 14H10L8 9.5L6 14H2L8 2Z" fill="#D4A574"/>
    </svg>
  </div>
);

const PennLogo = () => (
  <div className="w-5 h-5 rounded bg-[#011F5B] flex items-center justify-center">
    <span className="text-[8px] font-extrabold text-[#BFA67A] leading-none">P</span>
  </div>
);

const MultiUniLogo = () => (
  <div className="flex items-center -space-x-1">
    <div className="w-4 h-4 rounded-full bg-[#00356B] flex items-center justify-center border border-background">
      <span className="text-[6px] font-bold text-white">Y</span>
    </div>
    <div className="w-4 h-4 rounded-full bg-[#E4002B] flex items-center justify-center border border-background">
      <span className="text-[6px] font-bold text-white">W</span>
    </div>
    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center border border-background">
      <span className="text-[6px] font-bold text-foreground">+</span>
    </div>
  </div>
);

const IBMLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
    <img src={ibmLogo} alt="IBM" className="w-7 h-7 object-contain" />
  </div>
);

const InfosysLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
    <img src={infosysLogo} alt="Infosys" className="w-7 h-7 object-contain" />
  </div>
);

const NasbaLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
    <img src={nasbaLogoAsset.url} alt="NASBA" className="w-8 h-8 object-contain" />
  </div>
);

const ShrmLogo = () => (
  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
    <img src={shrmLogoAsset.url} alt="SHRM" className="w-8 h-8 object-contain" />
  </div>
);

const CertLogo = ({ heading, provider }: { heading: string; provider?: string }) => {
  const text = `${heading} ${provider ?? ""}`.toLowerCase();

  if (text.includes("infosys")) return <InfosysLogo />;
  if (text.includes("ibm")) return <IBMLogo />;
  if (text.includes("nasba")) return <NasbaLogo />;
  if (text.includes("shrm")) return <ShrmLogo />;
  if (text.includes("anthropic") || text.includes("mcp") || text.includes("model context")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center flex-shrink-0 shadow-sm">
        <AnthropicLogo />
      </div>
    );
  }
  if (text.includes("google")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
        <GoogleLogo />
      </div>
    );
  }
  if (text.includes("pennsylvania") || text.includes("positive psychology") || text.includes("foundations of positive")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#011F5B] flex items-center justify-center flex-shrink-0 shadow-sm">
        <PennLogo />
      </div>
    );
  }
  if (text.includes("other psychology") || text.includes("behavioral") || text.includes("wesleyan") || text.includes("yale")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
        <MultiUniLogo />
      </div>
    );
  }

  // Fallback: clean initial badge with brand gradient — no fake "official" logo
  const letter = (provider ?? heading).charAt(0).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-p1 to-p2 flex items-center justify-center flex-shrink-0">
      <span className="font-heading font-extrabold text-sm text-white">{letter}</span>
    </div>
  );
};

const Certifications = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openBlocks, setOpenBlocks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const toggleBlock = (id: string) => {
    setOpenBlocks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const displayedCategories = activeFilter
    ? certCategories.filter((c) => c.id === activeFilter)
    : certCategories;

  return (
    <div className={cn("min-h-screen bg-background transition-all duration-500 ease-out", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      <main className="px-4 md:px-10 pt-12 pb-20 max-w-[1180px] mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2.5 bg-p1 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-8 transition-all hover:bg-p2 hover:shadow-lg shadow-sm active:scale-[0.97]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <h1 className="text-4xl sm:text-[2.6rem] font-bold text-center mb-10 font-heading">
          All Certifications
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[26px] items-start">
          {/* Sidebar */}
          <aside className="bg-card rounded-[18px] p-2 shadow-sm lg:sticky lg:top-6 border border-border">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFilter((prev) => (prev === item.id ? null : item.id))}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-3 rounded-[11px] text-left text-[0.93rem] font-medium transition-all duration-200 select-none",
                  activeFilter === item.id ? "bg-p1/10 text-p1" : "text-foreground hover:bg-muted/50"
                )}
              >
                <div className="w-[34px] h-[34px] rounded-[9px] bg-p1/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-[18px] w-[18px] text-p1" />
                </div>
                <span className="flex-1">{item.label}</span>
                <span className="text-[0.88rem] font-semibold text-muted-foreground">{getCategoryCount(item.id)}</span>
              </button>
            ))}

            <div className="h-px bg-border mx-1.5 my-2" />

            <button
              onClick={() => setActiveFilter(null)}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-[9px] bg-p1 text-white text-[0.84rem] font-semibold transition-all duration-300",
                activeFilter ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <X className="h-3.5 w-3.5" />
              Clear Selection
            </button>
          </aside>

          {/* Content */}
          <div>
            {displayedCategories.map((cat) => (
              <div key={cat.id} className="mb-8">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-[52px] h-[52px] bg-gradient-to-br from-p1 to-p2 rounded-[14px] flex items-center justify-center flex-shrink-0">
                    {cat.id === "project-management" && <BarChart3 className="h-[26px] w-[26px] text-white" />}
                    {cat.id === "artificial-intelligence" && <Lightbulb className="h-[26px] w-[26px] text-white" />}
                    {cat.id === "psychology" && <Heart className="h-[26px] w-[26px] text-white" />}
                    {cat.id === "hr" && <Users className="h-[26px] w-[26px] text-white" />}
                  </div>
                  <span className="font-heading text-2xl font-bold text-foreground">{cat.label}</span>
                </div>

                {cat.subGroups ? (
                  cat.subGroups.map((group) => {
                    const blockId = `${cat.id}-${group.heading}`;
                    const isOpen = openBlocks.has(blockId);
                    return (
                      <div key={group.heading} className="bg-card rounded-[14px] mb-2.5 overflow-hidden shadow-sm border border-border">
                        <div className="flex items-center gap-3 px-[18px] py-4 hover:bg-muted/30 transition-colors">
                          <button
                            onClick={() => toggleBlock(blockId)}
                            aria-expanded={isOpen}
                            className="flex items-center gap-3 flex-1 min-w-0 text-left"
                          >
                            <CertLogo heading={group.heading} provider={group.provider} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.92rem] font-semibold text-foreground leading-tight">{group.heading}</p>
                              <p className="text-[0.78rem] text-muted-foreground mt-0.5">{group.provider}</p>
                            </div>
                          </button>
                          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                            {group.mainCertUrl && (
                              <a href={group.mainCertUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-[0.78rem] font-medium text-foreground hover:border-p1 hover:text-p1 transition-colors bg-card">
                                <ExternalLink className="h-3 w-3" /> View
                              </a>
                            )}
                            <button
                              onClick={() => toggleBlock(blockId)}
                              aria-label={isOpen ? "Collapse" : "Expand"}
                              className="w-10 h-10 -mr-1.5 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
                            </button>
                          </div>
                        </div>
                        <AccordionBody isOpen={isOpen}>
                          {group.description && (
                            <div className="bg-muted/40 rounded-[10px] px-3.5 py-3 text-[0.85rem] text-foreground leading-relaxed">
                              {group.description}
                            </div>
                          )}
                          {group.courses.map((course) => (
                            <div key={course.name} className="flex items-center gap-2.5 bg-muted/40 rounded-[10px] px-3.5 py-3 text-[0.85rem] text-foreground hover:bg-p1/5 transition-colors">
                              <BadgeCheck className="h-[17px] w-[17px] text-p1 flex-shrink-0" />
                              <span className="flex-1">{course.name}</span>
                              {course.certUrl && (
                                <a href={course.certUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 border border-border rounded-full text-[0.75rem] font-semibold text-muted-foreground hover:border-p1 hover:text-p1 transition-colors ml-auto flex-shrink-0 bg-card">
                                  <ExternalLink className="h-3 w-3" /> Open
                                </a>
                              )}
                            </div>
                          ))}
                          {group.note && (
                            <div className="flex items-start gap-2.5 bg-o1/5 border border-o1/20 rounded-[10px] px-3.5 py-3 text-[0.84rem] text-o1">
                              <span className="text-base mt-0.5 flex-shrink-0">💡</span>
                              <span className="leading-relaxed">{group.note}</span>
                            </div>
                          )}
                        </AccordionBody>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-card rounded-[14px] mb-2.5 overflow-hidden shadow-sm border border-border">
                    <div className="flex items-center gap-3 px-[18px] py-4 hover:bg-muted/30 transition-colors">
                      <button
                        onClick={() => toggleBlock(cat.id)}
                        aria-expanded={openBlocks.has(cat.id)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        <CertLogo heading={cat.mainCert} provider={cat.provider} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.92rem] font-semibold text-foreground leading-tight">{cat.mainCert}</p>
                          <p className="text-[0.78rem] text-muted-foreground mt-0.5">{cat.provider}</p>
                        </div>
                      </button>
                      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                        {cat.mainCertUrl && (
                          <a href={cat.mainCertUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-[0.78rem] font-medium text-foreground hover:border-p1 hover:text-p1 transition-colors bg-card">
                            <ExternalLink className="h-3 w-3" /> View
                          </a>
                        )}
                        <button
                          onClick={() => toggleBlock(cat.id)}
                          aria-label={openBlocks.has(cat.id) ? "Collapse" : "Expand"}
                          className="w-10 h-10 -mr-1.5 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", openBlocks.has(cat.id) && "rotate-180")} />
                        </button>
                      </div>
                    </div>
                    <AccordionBody isOpen={openBlocks.has(cat.id)}>
                      {cat.courses.map((course) => (
                        <div key={course.name} className="flex items-center gap-2.5 bg-muted/40 rounded-[10px] px-3.5 py-3 text-[0.85rem] text-foreground hover:bg-p1/5 transition-colors">
                          <BadgeCheck className="h-[17px] w-[17px] text-p1 flex-shrink-0" />
                          <span className="flex-1">{course.name}</span>
                          {course.certUrl && (
                            <a href={course.certUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 border border-border rounded-full text-[0.75rem] font-semibold text-muted-foreground hover:border-p1 hover:text-p1 transition-colors ml-auto flex-shrink-0 bg-card">
                              <ExternalLink className="h-3 w-3" /> Open
                            </a>
                          )}
                        </div>
                      ))}
                    </AccordionBody>
                  </div>
                )}

                <div className="bg-secondary/60 rounded-xl px-5 py-4 mt-3.5">
                  <p className="text-[0.85rem] text-muted-foreground leading-relaxed">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certifications;

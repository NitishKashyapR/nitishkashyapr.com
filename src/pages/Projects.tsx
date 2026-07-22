import { useState } from "react";
import { ArrowLeft, X, FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects, type Project } from "@/data/projects";

const headerStyles: Record<string, string> = {
  indigo: "bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]",
  emerald: "bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669]",
  amber: "bg-gradient-to-br from-[#78350f] via-[#92400e] to-[#b45309]",
  purple: "bg-gradient-to-br from-[#4a1942] via-[#6b2fa0] to-[#9b59b6]",
};

const glowStyles: Record<string, string> = {
  indigo: "bg-[radial-gradient(circle,rgba(99,102,241,0.6)_0%,transparent_70%)]",
  emerald: "bg-[radial-gradient(circle,rgba(16,185,129,0.6)_0%,transparent_70%)]",
  amber: "bg-[radial-gradient(circle,rgba(249,115,22,0.6)_0%,transparent_70%)]",
  purple: "bg-[radial-gradient(circle,rgba(139,92,246,0.6)_0%,transparent_70%)]",
};

const statusColors: Record<string, string> = {
  green: "bg-g1/10 text-g1",
  amber: "bg-o1/10 text-o1",
  blue: "bg-p1/10 text-p1",
};

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

const ProjectCard = ({
  project,
  onViewPdfs,
  onViewDetails,
}: {
  project: Project;
  onViewPdfs?: (project: Project) => void;
  onViewDetails?: (project: Project) => void;
}) => (
  <div className="bg-card border border-border rounded-[20px] overflow-hidden transition-all duration-250 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-[5px]">
    <div className={`px-6 pt-7 pb-5 relative overflow-hidden min-h-[170px] flex flex-col justify-end ${headerStyles[project.headerStyle]}`}>
      <div className={`absolute w-[180px] h-[180px] rounded-full opacity-20 -top-10 -right-10 pointer-events-none ${glowStyles[project.headerStyle]}`} />
      <span className="inline-block text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 mb-3 relative z-[1] w-fit">
        {project.category}
      </span>
      <div className="font-heading text-[1.3rem] font-bold text-white leading-[1.15] mb-0.5 relative z-[1]">{project.title}</div>
      <div className="text-[0.72rem] text-white/55 relative z-[1]">{project.subtitle}</div>
    </div>
    <div className="px-5 py-4 border-t border-border">
      <p className="text-[0.8rem] text-ink-2 leading-[1.75] mb-3">{project.description}</p>
      <div className="flex flex-wrap gap-[5px] mb-3.5">
        {project.skills.map((tag) => (
          <span key={tag} className="text-[0.64rem] px-2.5 py-0.5 rounded-full border border-border bg-background text-ink-3">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <span className={`self-start text-[0.62rem] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full ${statusColors[project.statusColor]}`}>
          {project.status}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-border">
          {project.pdfs && project.pdfs.length > 0 && (
            <button
              onClick={() => onViewPdfs?.(project)}
              className="text-[0.72rem] font-semibold text-o1 hover:text-o2 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              View Reports
            </button>
          )}
          {project.pdf && (
            <a
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.72rem] font-semibold text-o1 hover:text-o2 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              View PDF
            </a>
          )}
          {project.note && (
            <button
              onClick={() => onViewDetails?.(project)}
              className="text-[0.72rem] font-semibold text-p1 hover:text-p2 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              Details
            </button>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.72rem] font-semibold text-p1 hover:text-p2 transition-colors ml-auto"
            >
              View ↗
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [pdfProject, setPdfProject] = useState<Project | null>(null);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[0.78rem] font-semibold border border-border bg-card text-ink-2 hover:border-p1 hover:text-p1 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            All <span className="gradient-text">Projects</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[0.78rem] font-semibold border transition-all duration-200 ${
                filter === cat
                  ? "bg-p1 text-primary-foreground border-p1"
                  : "bg-card text-ink-2 border-border hover:border-p1 hover:text-p1"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project.title} project={project} onViewPdfs={setPdfProject} onViewDetails={setDetailsProject} />
          ))}
        </div>
      </div>

      {/* PDF viewer modal */}
      {pdfProject && pdfProject.pdfs && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-[480px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{pdfProject.title}</h3>
                <p className="text-[0.75rem] text-ink-3 mt-0.5">Research Reports</p>
              </div>
              <button
                onClick={() => setPdfProject(null)}
                className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:border-p1 hover:text-p1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {pdfProject.pdfs.map((pdf) => (
                <div key={pdf.label} className="bg-background border border-border rounded-xl px-4 py-3.5 hover:border-p1/30 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-o1/10 to-o2/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-o1" />
                      </div>
                      <span className="text-[0.82rem] font-medium text-foreground truncate">{pdf.label}</span>
                    </div>
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.72rem] font-semibold text-p1 hover:text-p2 transition-colors px-3 py-1.5 rounded-lg bg-p1/10 hover:bg-p1/20 flex-shrink-0"
                    >
                      View ↗
                    </a>
                  </div>
                  {pdf.note && (
                    <p className="mt-3 pt-3 border-t border-border/60 text-[0.76rem] leading-[1.65] text-ink-3 whitespace-pre-line">
                      {pdf.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details modal */}
      {detailsProject && detailsProject.note && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setDetailsProject(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-[520px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{detailsProject.title}</h3>
                <p className="text-[0.75rem] text-ink-3 mt-0.5">A note from me</p>
              </div>
              <button
                onClick={() => setDetailsProject(null)}
                className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:border-p1 hover:text-p1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[0.88rem] leading-[1.75] text-ink-2 whitespace-pre-line">{detailsProject.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

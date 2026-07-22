import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const testimonials = [
  {
    initial: "T",
    bg: "from-p1 to-p2",
    text: "A dependable teammate who takes his share of the work seriously and is easy to coordinate with.",
    name: "Teammate",
    role: "MBA Group Partner",
  },
  {
    initial: "C",
    bg: "from-g1 to-g2",
    text: "Nitish usually comes prepared and shares useful ideas during our group discussions.",
    name: "Classmate",
    role: "MBA Group Partner",
  },
  {
    initial: "P",
    bg: "from-o1 to-o2",
    text: "Nitish is proactive in group work and follows through on what he commits to.",
    name: "Project Partner",
    role: "MBA Group Partner",
  },
  {
    initial: "M",
    bg: "from-p2 to-p3",
    text: "He often shows the team simple ways to use AI tools in our HR assignments, which has been genuinely helpful.",
    name: "Study Group Member",
    role: "MBA Colleague",
  },
  {
    initial: "R",
    bg: "from-g2 to-g1",
    text: "Nitish is a good listener in group discussions and is open to other people's ideas before settling on a direction.",
    name: "Research Partner",
    role: "Academic Collaborator",
  },
  {
    initial: "A",
    bg: "from-o2 to-o1",
    text: "Nitish is curious and keeps learning new things, and he's usually happy to share what he picks up with the rest of us.",
    name: "Assignment Partner",
    role: "MBA Peer",
  },
  {
    initial: "S",
    bg: "from-p1 to-p3",
    text: "Working with Nitish on our HR case study was smooth — he helps break the problem into smaller parts so the team can move forward.",
    name: "Case Study Partner",
    role: "MBA Classmate",
  },
  {
    initial: "D",
    bg: "from-g1 to-p1",
    text: "Nitish brings a positive energy to group work and keeps things organised when we're prepping for presentations.",
    name: "Presentation Teammate",
    role: "MBA Group Member",
  },
  {
    initial: "K",
    bg: "from-r1 to-p2",
    text: "Reliable and curious about the subject — Nitish does his part well and is easy to work alongside.",
    name: "Coursework Partner",
    role: "MBA Peer",
  },
  {
    initial: "V",
    bg: "from-p3 to-r1",
    text: "Nitish communicates clearly during our group vivas, which makes it easier for the rest of us to follow along.",
    name: "Viva Group Member",
    role: "MBA Colleague",
  },
];

const DESKTOP_PAGE_SIZE = 3;

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const totalDesktopPages = Math.ceil(testimonials.length / DESKTOP_PAGE_SIZE);

  const prev = () => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const prevDesktop = () => setDesktopPage((p) => (p === 0 ? totalDesktopPages - 1 : p - 1));
  const nextDesktop = () => setDesktopPage((p) => (p === totalDesktopPages - 1 ? 0 : p + 1));

  // Auto-advance every 2 seconds, paused on hover
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
      setDesktopPage((p) => (p + 1) % totalDesktopPages);
    }, 2000);
    return () => clearInterval(id);
  }, [totalDesktopPages, paused]);

  const desktopSlice = testimonials.slice(
    desktopPage * DESKTOP_PAGE_SIZE,
    desktopPage * DESKTOP_PAGE_SIZE + DESKTOP_PAGE_SIZE
  );

  return (
    <div className="bg-card border-y border-border">
      <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24">
        <SectionHeader
          number="07"
          label="Testimonials"
          title="From"
          titleAccent="Collaborators"
          description="Feedback from classmates and project partners."
        />

        {/* Mobile: single card with arrows */}
        <div className="md:hidden">
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <div key={t.name} className="w-full flex-shrink-0 px-1">
                    <TestimonialCard t={t} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-5">
              <button onClick={prev} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:border-p1 hover:text-p1 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-colors ${i === active ? "bg-p1" : "bg-border"}`} />
                ))}
              </div>
              <button onClick={next} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:border-p1 hover:text-p1 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: paginated 3 at a time */}
        <div
          className="hidden md:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {desktopSlice.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prevDesktop} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:border-p1 hover:text-p1 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalDesktopPages }).map((_, i) => (
                <button key={i} onClick={() => setDesktopPage(i)} className={`w-2 h-2 rounded-full transition-colors ${i === desktopPage ? "bg-p1" : "bg-border"}`} />
              ))}
            </div>
            <button onClick={nextDesktop} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:border-p1 hover:text-p1 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ t }: { t: typeof testimonials[number] }) => (
  <div className="bg-card border border-border rounded-[20px] px-6 py-7 transition-all duration-200 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] flex flex-col">
    <div className="flex items-center justify-between mb-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.bg} flex items-center justify-center font-heading font-extrabold text-[0.95rem] text-white`}>
        {t.initial}
      </div>
      <div className="text-[0.68rem] tracking-[2px] text-o1">★★★★★</div>
    </div>
    <p className="text-[0.9rem] text-foreground leading-[1.75] flex-1 mb-4 italic">"{t.text}"</p>
    <div className="pt-3.5 border-t border-border">
      <div className="text-[0.82rem] font-bold text-foreground">{t.name}</div>
      <div className="text-[0.7rem] text-ink-3 mt-0.5">{t.role}</div>
    </div>
  </div>
);

export default TestimonialsSection;

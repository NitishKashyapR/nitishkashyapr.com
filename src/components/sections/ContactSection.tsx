const ContactSection = () => (
  <div className="bg-gradient-to-br from-[#0f0a2e] via-[#1a0a3e] to-[#0d1a3e] relative overflow-hidden" id="contact">
    <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)] -top-[150px] -right-[100px] pointer-events-none" />
    <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] -bottom-[100px] -left-20 pointer-events-none" />

    <div className="max-w-[1200px] mx-auto px-5 md:px-14 py-16 md:py-24 grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-10 md:gap-20 relative z-[1]">
      <div>
        <div className="flex items-center gap-2 text-[0.66rem] font-bold tracking-[0.16em] uppercase text-p1/70 mb-5">
          <span className="w-4 h-0.5 bg-gradient-to-r from-p1 to-p2 rounded-full" />
          08 — Get In Touch
        </div>
        <h2 className="font-heading text-[clamp(2.4rem,5vw,5rem)] font-extrabold text-white leading-[0.92] tracking-[-0.04em] mb-6">
          Let's Build<br />Something<br /><span className="gradient-text-alt">Meaningful.</span>
        </h2>
        <p className="text-[0.88rem] text-white/45 leading-[1.85] mb-6 max-w-[400px]">
          I am always open to internships, learning opportunities, and collaborative projects that help me grow professionally.
        </p>
        <a
          href="mailto:nitishkashyapr8@gmail.com?subject=Hi%20Nitish"
          className="say-hi-btn group"
        >
          <span className="say-hi-shine" aria-hidden="true" />
          <span className="say-hi-label">Start By Saying Hi</span>
          <span className="say-hi-emoji" aria-hidden="true">👋🏻</span>
        </a>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-[7px] text-[0.68rem] font-bold tracking-[0.1em] uppercase text-white/35 mb-5">
          <span className="w-[7px] h-[7px] rounded-full bg-[#4ade80] animate-pulse-dot" />
          Available for opportunities
        </div>
        <div className="font-heading text-[1.2rem] font-bold text-white mb-4">Nitish Kashyap R</div>
        <ul>
          {["About", "Projects", "Education", "Skills", "Certifications"].map((link, i, arr) => (
            <li key={link}>
              <button
                onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-between w-full py-3.5 px-0.5 text-[0.82rem] font-medium text-white/35 transition-all duration-150 hover:text-white hover:pl-1.5 group"
              >
                {link}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
              {i < arr.length - 1 && (
                <div className="h-px bg-gradient-to-r from-white/[0.08] via-white/[0.15] to-white/[0.08]" />
              )}
            </li>
          ))}
        </ul>
        <a
          href="https://www.linkedin.com/in/nitishkashyapr"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-5 px-3.5 py-3.5 rounded-xl bg-gradient-to-br from-p1 to-p2 text-white font-bold text-[0.8rem] flex items-center justify-center gap-2 tracking-wide uppercase transition-all duration-200 hover:shadow-[0_4px_20px_rgba(10,102,194,0.5)] hover:-translate-y-px active:scale-[0.97]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          Connect on LinkedIn
        </a>
      </div>
    </div>
  </div>
);

export default ContactSection;

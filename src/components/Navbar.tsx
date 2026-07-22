import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = ["About", "Skills", "Education", "Certifications", "Projects", "Contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
    <nav
      className={`nav-desktop hidden md:flex sticky top-0 z-[900] h-[60px] px-6 md:px-14 items-center justify-between backdrop-blur-[20px] border-b transition-all duration-200 ${
        scrolled ? "border-border bg-background/85" : "border-transparent bg-background/85"
      }`}
    >
      <div className="flex items-center gap-2 font-heading text-[0.95rem] font-bold text-foreground">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-p1 to-p3 flex items-center justify-center text-[0.65rem] font-extrabold text-primary-foreground tracking-tight">
          NK
        </div>
        <span className="hidden sm:inline">Nitish Kashyap R</span>
      </div>

      <div className="hidden md:flex gap-0">
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => scrollTo(link)}
            className="px-3 py-1.5 text-[0.76rem] font-medium text-ink-3 rounded-[7px] transition-all duration-150 hover:text-foreground hover:bg-surface-1"
          >
            {link}
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollTo("contact")}
        className="hidden md:inline-flex px-5 py-2 rounded-lg bg-foreground text-background text-[0.76rem] font-semibold transition-all duration-200 hover:bg-gradient-to-br hover:from-p1 hover:to-p2 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)]"
      >
        Get In Touch
      </button>

      <button
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className="md:hidden w-11 h-11 -mr-2 rounded-lg flex items-center justify-center text-foreground hover:bg-surface-1 transition-colors"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </nav>

    {/* Mobile menu overlay */}
    <div
      className={`nav-mobile-overlay md:hidden fixed inset-x-0 top-[60px] bottom-0 z-[899] bg-background/98 backdrop-blur-xl transition-all duration-200 ${
        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="flex flex-col p-6 gap-1">
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => scrollTo(link)}
            className="w-full min-h-[48px] px-4 py-3 text-left text-base font-medium text-foreground rounded-xl hover:bg-surface-1 border border-transparent hover:border-border transition-all"
          >
            {link}
          </button>
        ))}
        <button
          onClick={() => scrollTo("Contact")}
          className="mt-4 w-full min-h-[48px] px-5 py-3 rounded-xl bg-gradient-to-br from-p1 to-p2 text-primary-foreground font-semibold text-sm shadow-[0_4px_16px_rgba(99,102,241,0.35)]"
        >
          Get In Touch →
        </button>
      </div>
    </div>
    </>
  );
};

export default Navbar;

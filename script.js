// ============================================================
// INTERACTIVE PLEXUS PARTICLE BACKGROUND ENGINE
// Dots + Lines + Triangulated Polygon fills
// Mouse-interactive magnetic attraction
// ============================================================
(function plexusEngine() {
  const initEngine = () => {
    const canvas = document.getElementById("plexusCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: null, y: null, radius: 220 };
    let animId = null;

    const config = {
      particleCount: 140,
      particleMaxRadius: 3.2,
      particleMinRadius: 1.2,
      lineLength: 145,
      particleSpeed: 0.25,
      dotColor: "rgba(165, 180, 252, 0.85)",
      lineColor: "rgba(129, 140, 248, 0.28)",
      polyColor: "rgba(167, 139, 250, 0.04)"
    };

    function updateThemeColors() {
      const theme = document.documentElement.getAttribute("data-theme") || "dark";
      if (theme === "dark") {
        config.dotColor = "rgba(165, 180, 252, 0.85)";
        config.lineColor = "rgba(129, 140, 248, 0.28)";
        config.polyColor = "rgba(167, 139, 250, 0.04)";
      } else {
        config.dotColor = "rgba(15, 23, 42, 0.75)";
        config.lineColor = "rgba(99, 102, 241, 0.22)";
        config.polyColor = "rgba(99, 102, 241, 0.03)";
      }
    }

    class Particle {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * config.particleSpeed;
        this.vy = (Math.random() - 0.5) * config.particleSpeed;
        this.radius = Math.random() * (config.particleMaxRadius - config.particleMinRadius) + config.particleMinRadius;
      }
      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }
      getScreenPos(yOffset, h) {
        let sy = (this.y - yOffset) % h;
        if (sy < 0) sy += h;
        return { x: this.x, y: sy };
      }
    }

    let targetScrollY = window.scrollY || 0;
    let currentScrollY = targetScrollY;
    window.addEventListener("scroll", () => {
      targetScrollY = window.scrollY || 0;
    }, { passive: true });

    function renderNetwork() {
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      const yOffset = (currentScrollY * 0.12) % displayHeight;

      // Calculate screen positions for all particles
      const screenNodes = [];
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(displayWidth, displayHeight);
        let pos = particles[i].getScreenPos(yOffset, displayHeight);
        screenNodes.push({ x: pos.x, y: pos.y, radius: particles[i].radius });
      }

      // Mouse interactive repulsion and direct cursor connection lines
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < screenNodes.length; i++) {
          let dx = mouse.x - screenNodes[i].x;
          let dy = mouse.y - screenNodes[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            let force = (mouse.radius - dist) / mouse.radius;

            // Draw interactive glowing connection line from cursor to particle
            let alpha = force * 0.65;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(screenNodes[i].x, screenNodes[i].y);
            ctx.strokeStyle = config.lineColor.replace(/[\d\.]+\)$/, `${alpha})`);
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Repel dots away from cursor
            screenNodes[i].x -= (dx / dist) * force * 24;
            screenNodes[i].y -= (dy / dist) * force * 24;
          }
        }
      }

      // Draw particle dots
      for (let i = 0; i < screenNodes.length; i++) {
        ctx.beginPath();
        ctx.arc(screenNodes[i].x, screenNodes[i].y, screenNodes[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = config.dotColor;
        ctx.fill();
      }

      // Draw connecting lines & mesh between particles
      for (let i = 0; i < screenNodes.length; i++) {
        let closeNodes = [];
        for (let j = i + 1; j < screenNodes.length; j++) {
          let dx = screenNodes[i].x - screenNodes[j].x;
          let dy = screenNodes[i].y - screenNodes[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.lineLength) {
            closeNodes.push({ index: j, dist: dist });
            ctx.beginPath();
            ctx.moveTo(screenNodes[i].x, screenNodes[i].y);
            ctx.lineTo(screenNodes[j].x, screenNodes[j].y);
            ctx.strokeStyle = config.lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        for (let k = 0; k < closeNodes.length; k++) {
          for (let m = k + 1; m < closeNodes.length; m++) {
            let p2 = screenNodes[closeNodes[k].index];
            let p3 = screenNodes[closeNodes[m].index];
            let dx2 = p2.x - p3.x;
            let dy2 = p2.y - p3.y;
            let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            if (dist2 < config.lineLength) {
              ctx.beginPath();
              ctx.moveTo(screenNodes[i].x, screenNodes[i].y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.closePath();
              ctx.fillStyle = config.polyColor;
              ctx.fill();
            }
          }
        }
      }
    }

    function init() {
      particles = [];
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle(displayWidth, displayHeight));
      }
    }

    function animate() {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      renderNetwork();
      animId = requestAnimationFrame(animate);
    }

    let lastWidth = 0;
    let lastHeight = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = displayWidth + "px";
      canvas.style.height = displayHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (Math.abs(displayWidth - lastWidth) > 10 || Math.abs(displayHeight - lastHeight) > 150 || particles.length === 0) {
        lastWidth = displayWidth;
        lastHeight = displayHeight;
        const area = displayWidth * displayHeight;
        config.particleCount = Math.min(140, Math.max(30, Math.floor(area / 10000)));
        updateThemeColors();
        init();
      }
    }

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      updateThemeColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    resize();
    animate();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEngine);
  } else {
    initEngine();
  }
})();

function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!toggleBtn) return;

  const sunIcon = toggleBtn.querySelector(".theme-icon-sun");
  const moonIcon = toggleBtn.querySelector(".theme-icon-moon");

  function updateIcon(theme) {
    if (theme === "dark") {
      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";
      toggleBtn.setAttribute("aria-label", "Switch to Light Theme");
      toggleBtn.setAttribute("title", "Switch to Light Theme");
    } else {
      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";
      toggleBtn.setAttribute("aria-label", "Switch to Dark Theme");
      toggleBtn.setAttribute("title", "Switch to Dark Theme");
    }
  }

  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  updateIcon(currentTheme);

  toggleBtn.addEventListener("click", () => {
    const active = document.documentElement.getAttribute("data-theme") || "dark";
    const next = active === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon(next);
  });
}

// SVG Vector Icon Definitions for Professional UI
const icons = {
  graduation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  lightbulb: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
  file: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  chevronUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`
};

// Certifications Data matching certifications.ts
const certCategories = [
  {
    id: "project-management",
    label: "Advanced Management",
    provider: "Coursera",
    mainCert: "Google Project Management",
    mainCertUrl: "https://www.credly.com/badges/f464ef88-cf24-4903-b934-62b937ae0eb4/linked_in_profile",
    iconKey: "chart",
    subGroups: [
      {
        heading: "Google Project Management",
        name: "Google Project Management Professional",
        provider: "Google — Coursera",
        mainCertUrl: "https://www.credly.com/badges/f464ef88-cf24-4903-b934-62b937ae0eb4/linked_in_profile",
        courses: [
          { name: "Foundations of Project Management", certUrl: "https://coursera.org/share/7d12077924b4d7c0aa386afc03d13542" },
          { name: "Project Initiation: Starting a Successful Project", certUrl: "https://coursera.org/share/ad0a89f52ff940eed1f9fac1e6a4b433" },
          { name: "Project Planning: Putting It All Together", certUrl: "https://coursera.org/share/1531ede393ffb408bdf2a23da19a8731" },
          { name: "Project Execution: Running the Project", certUrl: "https://coursera.org/share/e5b5d318e753692204f5823a27a9e9f3" },
          { name: "Agile Project Management", certUrl: "https://coursera.org/share/a3488fb4b77d771b92f67739a930e582" },
          { name: "Capstone: Applying Project Management in the Real World", certUrl: "https://coursera.org/share/b9128d055dc1d052d0e434b7cedb0a48" }
        ]
      },
      {
        heading: "Google People Management",
        provider: "Google — Coursera",
        mainCertUrl: "https://coursera.org/share/91475a0160cfc5c5ca48985966accb09",
        courses: [
          { name: "Create a High-Performing Team", certUrl: "https://coursera.org/share/9e8651ebdc8e1d337252050ffb14f99f" },
          { name: "Set and Achieve Team Goals", certUrl: "https://coursera.org/share/2a389054e5020d93444ce6222fe1a3e6" },
          { name: "Support Individual Growth and Development", certUrl: "https://coursera.org/share/b96d445a71d502d5ce6da56af212227c" },
          { name: "Grow as a Manager", certUrl: "https://coursera.org/share/0ad21312a768928a7afab27ad7be9dfc" }
        ]
      },
      {
        heading: "Introduction to Risk Management",
        provider: "NASBA — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/17b9bc3bdf92f6f869be2177296a5558a1e62c34e0319c5563707c9e2670dea1?trk=share_certificate",
        courses: [],
        description: "Introductory course on identifying, assessing, and mitigating organizational risks. Covers core risk management frameworks and how to apply them in day-to-day business decisions."
      }
    ],
    description: "Developed practical knowledge in project planning, stakeholder coordination, risk management, and team leadership."
  },
  {
    id: "artificial-intelligence",
    label: "AI & Technical Skills",
    provider: "Coursera",
    mainCert: "Google Prompting Essentials",
    iconKey: "lightbulb",
    subGroups: [
      {
        heading: "Google AI Essentials",
        provider: "Google — Coursera",
        mainCertUrl: "https://coursera.org/share/76947c58b085a4ad9addaf64fed98064",
        courses: [
          { name: "Introduction to AI", certUrl: "https://coursera.org/share/072518e57748c25ad453a4ea80307e10" },
          { name: "Maximize Productivity With AI Tools", certUrl: "https://coursera.org/share/ccd8ecc7f7509dad4083f27dd9cfb26b" },
          { name: "Discover the Art of Prompting", certUrl: "https://coursera.org/share/5c3f9ff973057e969378da6318eeb6e2" },
          { name: "Use AI Responsibly", certUrl: "https://coursera.org/share/e3db2c7274175f976322e38fa0158977" },
          { name: "Stay Ahead of the AI Curve", certUrl: "https://coursera.org/share/1bd232b9a54bf6af1ca3961248408e13" }
        ]
      },
      {
        heading: "Google Prompting Essentials",
        provider: "Google — Coursera",
        mainCertUrl: "https://www.credly.com/badges/a2bb066f-ecb9-4412-9e8a-dd63e1843c9d/linked_in_profile",
        courses: [
          { name: "Start Writing Prompts Like a Pro", certUrl: "https://coursera.org/share/538ec42f165d6a592b3512e88409acae" },
          { name: "Design Prompts for Everyday Work Tasks", certUrl: "https://coursera.org/share/13ef475b624eaf9b30e21d0abbe64699" },
          { name: "Speed Up Data Analysis and Presentation Building", certUrl: "https://coursera.org/share/16366880714aab81e43b8e0f10cf68d0" },
          { name: "Use AI as a Creative or Expert Partner", certUrl: "https://coursera.org/share/d43552bf86631558d7917da101ab305e" }
        ]
      },
      {
        heading: "Google AI Professional",
        provider: "Google — Coursera",
        mainCertUrl: "https://www.coursera.org/account/accomplishments/professional-cert/PF2G8XYT596M",
        courses: [
          { name: "AI Fundamentals", certUrl: "https://coursera.org/share/6e448ace7434ff8b204263a399677d4b" },
          { name: "AI for Brainstorming and Planning", certUrl: "https://coursera.org/share/d9d48c1a9f65b63a843f51c1accd401d" },
          { name: "AI for Research and Insights", certUrl: "https://coursera.org/share/445b33b978a074c7ce444639dbe35f27" },
          { name: "AI for Writing and Communicating", certUrl: "https://coursera.org/share/19307886df66fc8c08e49f5a5667e41d" },
          { name: "AI for Content Creation", certUrl: "https://coursera.org/share/060c2c87dc7d55d7bdba7e01e32ef8a3" },
          { name: "AI for Data Analytics", certUrl: "https://coursera.org/share/b5eba89bdaaa6d3b9d124f50b2fbce68" },
          { name: "AI for App Building", certUrl: "https://coursera.org/share/7e6286ec4b266f036f0c1683aefa483d" }
        ]
      },
      {
        heading: "Generative AI for Executives and Business Leaders",
        provider: "IBM — Coursera",
        mainCertUrl: "https://coursera.org/share/abb271ff47e79bbb482ff9d7887be85e",
        courses: [
          { name: "GenAI for Executives & Business Leaders: An Introduction", certUrl: "https://coursera.org/share/b6120c2a10a01d688707206820544088" },
          { name: "GenAI for Execs & Business Leaders: Integration Strategy", certUrl: "https://coursera.org/share/5b142b7c6c4e1211df292db52b7f80f6" },
          { name: "GenAI for Execs & Business Leaders: Formulate Your Use Case", certUrl: "https://coursera.org/share/fbe5fe481fb9236d8f8e9af5ff1bfe7e" }
        ]
      },
      {
        heading: "Cyber Security Overview",
        provider: "Infosys",
        mainCertUrl: "pdfs/Cyber Security Overview.pdf",
        courses: [],
        description: "Infosys foundational course covering essential cybersecurity principles, common threats, and best practices for safe digital behavior."
      },
      {
        heading: "Claude 101",
        provider: "Anthropic — Skilljar",
        mainCertUrl: "https://verify.skilljar.com/c/8wzvwcx4ckry",
        courses: [],
        description: "Anthropic's foundational course on Claude covering model capabilities, effective prompting, context management, and responsible AI usage."
      }
    ],
    description: "Focused on leveraging AI tools and core technology skills—including cybersecurity awareness—to enhance productivity, optimize workflows, and support smarter, safer decision-making."
  },
  {
    id: "psychology",
    label: "Psychology & Human Behavior",
    provider: "Coursera",
    mainCert: "Positive Psychology Specialization",
    iconKey: "heart",
    subGroups: [
      {
        heading: "Foundations of Positive Psychology",
        provider: "University of Pennsylvania — Coursera",
        mainCertUrl: "https://coursera.org/share/d8f1d19f5e93488584d6df9091492414",
        courses: [
          { name: "Positive Psychology: Martin E. P. Seligman's Visionary Science", certUrl: "https://coursera.org/share/f44a14c01038af49365ef361c426f049" },
          { name: "Positive Psychology: Applications and Interventions", certUrl: "https://coursera.org/share/ce6f3b16de23225e0c0e43c172f16b97" },
          { name: "Positive Psychology: Character, Grit and Research Methods", certUrl: "https://coursera.org/share/9f6855467f85da4fb60da7f4c1e5018d" },
          { name: "Positive Psychology: Resilience Skills", certUrl: "https://coursera.org/share/31ab59f391efabf994b23619df97d5b2" },
          { name: "Positive Psychology Specialization Project: Design Your Life for Well-being", certUrl: "https://coursera.org/share/fd5b4181926c36f469e3f11edebf7767" }
        ],
        description: "Comprehensive 5-course specialization exploring positive psychological interventions, grit, resilience, and wellbeing science."
      },
      {
        heading: "Introduction to Psychology",
        provider: "Yale University — Coursera",
        mainCertUrl: "https://coursera.org/share/5db216560664adf14989daa0d8223e00",
        courses: [],
        description: "Foundational course on psychological science, exploring perception, memory, social behavior, and human mental processes."
      },
      {
        heading: "The Science of Well-Being",
        provider: "Yale University — Coursera",
        mainCertUrl: "https://coursera.org/share/801ab23d109b8c5cadc40efd7d098d6f",
        courses: [],
        description: "Explores evidence-based strategies for increasing happiness, building productive habits, and fostering personal well-being."
      },
      {
        heading: "Moralities of Everyday Life",
        provider: "Yale University — Coursera",
        mainCertUrl: "https://coursera.org/share/eef5e61a89328c4f7d3010a4ed59cc05",
        courses: [],
        description: "Examines the psychological foundations of moral judgment, empathy, altruism, and human moral behavior."
      },
      {
        heading: "Social Psychology",
        provider: "Wesleyan University — Coursera",
        mainCertUrl: "https://coursera.org/share/30d561587636338817b20598a55b1f84",
        courses: [],
        description: "In-depth study of social influence, interpersonal relationships, group dynamics, and how individuals think about and relate to others."
      }
    ],
    description: "Built a strong understanding of human behavior, motivation, resilience, collaboration, and workplace well-being."
  },
  {
    id: "hr",
    label: "HR",
    provider: "LinkedIn Learning",
    mainCert: "HR Certifications",
    iconKey: "users",
    subGroups: [
      {
        heading: "HRCI Human Resource Associate",
        name: "Human Resource Associate Professional",
        provider: "HRCI — Coursera",
        mainCertUrl: "https://coursera.org/share/0677f1802c28bdf8f8ea40a0dc930750",
        courses: [
          { name: "Talent Acquisition", certUrl: "https://coursera.org/share/ec4c4ccc79accbd5900ae2da4f575235" },
          { name: "Learning and Development", certUrl: "https://coursera.org/share/8d80ad7e85a056d1aeeeae01e434a674" },
          { name: "Compensation and Benefits", certUrl: "https://coursera.org/share/d862fc715256db3c57e65c3bf85b9baa" },
          { name: "Employee Relations", certUrl: "https://coursera.org/share/7cf06002f79dc207504f2bcd1dfdaa79" },
          { name: "Compliance and Risk Management", certUrl: "https://coursera.org/share/0b221ec09e359b730570a38bc038689b" }
        ],
        description: "Comprehensive HRCI professional certification covering talent acquisition, learning & development, total rewards, employee relations, and compliance & risk management."
      },
      {
        heading: "Managing Organizational Change for HR Professionals",
        provider: "SHRM — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/6a758a5ef9ca2ed64b8a26393c9c5b032c74ab4365e990d067fa6da5062cb92b?trk=share_certificate",
        courses: [],
        description: "Focused on how HR professionals can lead and support organizational change initiatives. Covers change models, employee communication, and reducing resistance during transitions."
      },
      {
        heading: "Generative AI in HR",
        provider: "SHRM — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/c25f3a120f6adf4b4bf48854e1f44485a8b6362933f8b33bb533e37f999b8c44?trk=share_certificate",
        courses: [],
        description: "Explores practical use cases of generative AI across core HR functions. Covers policy drafting, employee communication, and everyday HR workflows."
      },
      {
        heading: "Generative AI: Recruiting and Talent Acquisition",
        provider: "NASBA — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/c41db3e9cb5342ac05bcbdbc85ece86db1cfcf974db6be852549e9a28a275177?trk=share_certificate",
        courses: [],
        description: "Covers how generative AI is reshaping recruiting and talent acquisition, candidate screening, and candidate experience."
      },
      {
        heading: "Leveraging Agentic AI in HR",
        provider: "SHRM — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/d7810c38ccb3af32748d4828b827466005ab4bae11136afa7ceec51a8bb2343f?trk=share_certificate",
        courses: [],
        description: "Explores how agentic AI systems and autonomous AI agents can support HR workflows — automating multi-step people processes, assisting decision-making, and reshaping HR operations."
      },
      {
        heading: "Data-Driven HR: AI-Powered People Analytics for Workforce Planning and Employee Experience",
        provider: "SHRM — LinkedIn Learning",
        mainCertUrl: "https://www.linkedin.com/learning/certificates/d309c26775d59ac3aab3da08894c1457f8b1e67861e5ffe8c033d1d187969c56?trk=share_certificate",
        courses: [],
        description: "Covers AI-powered people analytics for workforce planning, talent forecasting, and elevating employee experience through data-driven HR decisions."
      }
    ],
    description: "HR-focused certifications covering HRCI associate competencies, people-side change management, and generative AI in HR operations."
  }
];

// Helper to count main certifications: each program or standalone cert counts as 1
const countSubGroup = (sg) => 1;
const countCategory = (cat) => {
  if (cat.subGroups && cat.subGroups.length > 0) {
    return cat.subGroups.reduce((sum, sg) => sum + countSubGroup(sg), 0);
  }
  return 1;
};
const getTotalCertCount = () => certCategories.reduce((sum, cat) => sum + countCategory(cat), 0);

// Projects Data matching projects.ts
const projectsData = [
  {
    id: "digicolibri",
    title: "DigiColibri",
    subtitle: "Business Promotion Design",
    description: "A conceptual business designer to promote brands through strategic outreach and digital presence.",
    category: "Academic",
    status: "Completed",
    live: "https://digicolibri.lovable.app/",
    headerStyle: "linear-gradient(135deg, #1e1b4b, #4338ca)",
    skills: ["Business Model", "Market Strategy", "Digital Marketing"],
    note: "Undertaken during my 1st semester of MBA as part of an academic initiative. Our team of 12 members won 1st place in a Shark Tank-style college competition. I took on the website design and created a live working prototype using AI tools.",
    details: {
      overview: "DigiColibri is a conceptual business model built around helping small and medium-sized brands grow their digital presence through strategic outreach and creative content.",
      objective: "To create an accessible and affordable digital promotion service that empowers emerging brands to compete online.",
      summary: "The project explores the end-to-end process of brand promotion — from identifying a client's unique value proposition to crafting compelling campaigns."
    }
  },
  {
    id: "seva-setu",
    title: "Seva Setu",
    subtitle: "Public Services App Proposal",
    description: "A digital platform connecting citizens with government authorities to improve issue reporting and emergency response.",
    category: "Innovation",
    status: "Completed",
    headerStyle: "linear-gradient(135deg, #064e3b, #059669)",
    skills: ["Civic Tech", "App Design", "Public Policy"],
    pdf: "pdfs/Seva Satu.pdf",
    note: "Undertaken during my 1st semester of MBA as part of an academic initiative with four team members. I conceptualized the core idea for civic problem reporting and emergency response.",
    details: {
      overview: "Seva Setu is a digital platform concept designed to bridge the gap between citizens and government bodies.",
      objective: "To establish a seamless digital bridge for civic problem reporting, engineer assessment, public job creation, and emergency response.",
      summary: "The app features two core pillars: Civic Problem Resolution and Critical Emergency Response."
    }
  },
  {
    id: "union-bank",
    title: "Market Research Study",
    subtitle: "Union Bank of India",
    description: "An in-depth market research study on Union Bank of India, analyzing consumer perception, service positioning, and brand claims.",
    category: "Research",
    status: "Completed",
    headerStyle: "linear-gradient(135deg, #78350f, #b45309)",
    skills: ["Market Research", "Data Analysis", "Reporting"],
    pdf: "pdfs/Union bank of India.pdf",
    note: "Undertaken during my 1st semester of MBA as part of an academic initiative. A focused study examining customer perception and actual service delivery.",
    details: {
      overview: "A comprehensive market research study focused on analyzing consumer perceptions of product claims.",
      objective: "To understand the gap between product marketing claims and actual consumer experiences.",
      summary: "The study involved collecting and analyzing consumer feedback, comparing advertised claims with real-world product performance."
    }
  },
  {
    id: "portfolio",
    title: "This Portfolio Website",
    subtitle: "Vibe Coded & Built by Me",
    description: "This very website you're viewing — designed, vibe coded, and built entirely by me using modern web technologies.",
    category: "Personal",
    status: "Live",
    headerStyle: "linear-gradient(135deg, #4a1942, #9b59b6)",
    skills: ["Vibe Coding", "AI Tools", "Web Design"],
    details: {
      overview: "A fully responsive, modern portfolio website built from the ground up.",
      objective: "To create a polished, professional online presence that reflects my skills, personality, and growth.",
      summary: "Features smooth animations, dynamic certification listings, interactive project cards, and a clean aesthetic."
    }
  }
];

// Testimonials Data matching Screenshot 2
const testimonialsData = [
  { initial: "S", bg: "linear-gradient(135deg, #6366f1, #8b5cf6)", stars: 5, text: "Working with Nitish on our HR case study was smooth — he helps break the problem into smaller parts so the team can move forward.", name: "Case Study Partner", role: "MBA Classmate" },
  { initial: "D", bg: "linear-gradient(135deg, #2563eb, #3b82f6)", stars: 5, text: "Nitish brings a positive energy to group work and keeps things organised when we're prepping for presentations.", name: "Presentation Teammate", role: "MBA Group Member" },
  { initial: "K", bg: "linear-gradient(135deg, #d946ef, #a855f7)", stars: 5, text: "Reliable and curious about the subject — Nitish does his part well and is easy to work alongside.", name: "Coursework Partner", role: "MBA Peer" },
  { initial: "M", bg: "linear-gradient(135deg, #059669, #10b981)", stars: 5, text: "He often shows the team simple ways to use AI tools in our HR assignments, which has been genuinely helpful.", name: "Study Group Member", role: "MBA Colleague" },
  { initial: "R", bg: "linear-gradient(135deg, #f59e0b, #d97706)", stars: 5, text: "Nitish is a good listener in group discussions and is open to other people's ideas before settling on a direction.", name: "Research Partner", role: "Academic Collaborator" },
  { initial: "A", bg: "linear-gradient(135deg, #ec4899, #f43f5e)", stars: 5, text: "Nitish is curious and keeps learning new things, and he's usually happy to share what he picks up with the rest of us.", name: "Assignment Partner", role: "MBA Peer" }
];

// Digital Badges Catalog (23 Official Verified Badges)
const badgesData = [
  {
    "id": "google-prompting-essentials",
    "title": "Google Prompting Essentials",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-prompting-essentials-badge.png",
    "badgeUrl": "https://www.credly.com/badges/a2bb066f-ecb9-4412-9e8a-dd63e1843c9d/linked_in_profile",
    "description": "Demonstrates core expertise in designing effective prompts, context management, multi-turn AI workflows, and optimizing Generative AI tools for professional productivity.",
    "skills": [
      "Prompt Engineering",
      "Generative AI",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "google-project-management",
    "title": "Google Project Management Professional",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-project-management-badge.png",
    "badgeUrl": "https://www.credly.com/badges/f464ef88-cf24-4903-b934-62b937ae0eb4/linked_in_profile",
    "description": "Verified professional qualification in traditional and Agile project management, project documentation, risk management, strategic planning, and team leadership.",
    "skills": [
      "Project Management",
      "Agile & Scrum",
      "Risk Management"
    ],
    "verified": true
  },
  {
    "id": "google-people-management-essentials-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google People Management Essentials",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-people-management-essentials-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/b5d6d8b1-789d-4b75-81d7-5b19abb02844/public_url",
    "description": "Those who earn the Google People Management Essentials Certificate have demonstrated their competence in foundational people management skills. Through hands-on activities and a...",
    "skills": [
      "HR Management",
      "People Strategy",
      "Organizational Change"
    ],
    "verified": true
  },
  {
    "id": "human-resource-associate-professional-certificate-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Human Resource Associate Professional Certificate",
    "issuer": "HRCI",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/human-resource-associate-professional-certificate-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/8b78593b-64fc-403d-9b90-7f0d4e00d6ad/public_url",
    "description": "Human Resource professionals have a significant impact on an organization\u2019s success. They play a vital role in hiring the right people, developing employee policies, and creatin...",
    "skills": [
      "HR Management",
      "People Strategy",
      "Organizational Change"
    ],
    "verified": true
  },
  {
    "id": "artificial-intelligence-fundamentals-was-issued-by-ibm-skillsbuild-to-nitish-kashyap-r",
    "title": "Artificial Intelligence Fundamentals",
    "issuer": "IBM",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/artificial-intelligence-fundamentals-was-issued-by-ibm-skillsbuild-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/37fee686-d4a0-4ad6-9c4a-d3aecf7a4683/public_url",
    "description": "This credential earner demonstrates knowledge of artificial intelligence (AI) concepts, such as natural language processing, computer vision, machine learning, deep learning, ch...",
    "skills": [
      "Professional Skills",
      "Certified Credential"
    ],
    "verified": true
  },
  {
    "id": "genai-for-execs-business-leaders-formulate-your-use-case-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "GenAI for Execs & Business Leaders: Formulate Your Use Case",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/genai-for-execs-business-leaders-formulate-your-use-case-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/afe55edb-02dd-4069-b252-16f25b8e6ed6/public_url",
    "description": "The badge earner can use Generative AI (GenAI) to support business goals by crafting effective prompts, identifying pain points, and selecting appropriate GenAI applications to ...",
    "skills": [
      "Generative AI",
      "Prompting",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "genai-for-execs-business-leaders-integration-strategy-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "GenAI for Execs & Business Leaders: Integration Strategy",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/genai-for-execs-business-leaders-integration-strategy-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/36a0781a-3935-4536-94ba-d82bea2233c3/public_url",
    "description": "The badge earner understands factors to consider when choosing a business case for scaling AI to drive ROI. They can explain complexities in relation to AI regulations. They can...",
    "skills": [
      "Generative AI",
      "Prompting",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "genai-for-executives-business-leaders-an-introduction-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "GenAI for Executives & Business Leaders: An Introduction",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/genai-for-executives-business-leaders-an-introduction-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/8dac2b42-f543-46e8-9abd-de5818831543/public_url",
    "description": "This credential earner can demonstrate a foundation level understanding of Generative AI (GenAI) as it relates to a business leader or executive's expected level of knowledge. T...",
    "skills": [
      "Generative AI",
      "Prompting",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "generative-ai-for-business-leaders-executives-specialization-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Generative AI for Business Leaders & Executives Specialization",
    "issuer": "IBM",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/generative-ai-for-business-leaders-executives-specialization-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/d1ab23b2-2d9a-41fe-bae9-646069a9a84e/public_url",
    "description": "The badge earner has foundational knowledge of generative AI governance and applications, and can effectively align AI strategies with organizational goals. Using IBM watsonx or...",
    "skills": [
      "Generative AI",
      "LLM Strategy",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "google-ai-for-app-building-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI for App Building",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-for-app-building-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/b7fc1d97-b0ea-41c1-844d-6286624fd88e/public_url",
    "description": "Those who earn the AI for App Building badge from Google can apply \"vibe coding\"\u2014a technique where natural language is used to generate fully functioning code. They have mapped ...",
    "skills": [
      "Vibe Coding",
      "AI App Building",
      "Prompt Engineering"
    ],
    "verified": true
  },
  {
    "id": "google-ai-for-brainstorming-and-planning-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI for Brainstorming and Planning",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-for-brainstorming-and-planning-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/dd0518b2-21bb-4fec-bd22-4153c1b018cf/public_url",
    "description": "Those who earn the AI for Brainstorming and Planning badge from Google can transform abstract ideas into actionable project plans using AI. They have demonstrated the ability to...",
    "skills": [
      "AI Planning",
      "Brainstorming",
      "Project Strategy"
    ],
    "verified": true
  },
  {
    "id": "google-ai-for-content-creation-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI for Content Creation",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-for-content-creation-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/381716eb-4d8b-4bae-bef0-f16b69d677e3/public_url",
    "description": "Those who earn the AI for Content Creation badge from Google can use AI to generate and transform multimedia content. They have demonstrated the ability to create marketing asse...",
    "skills": [
      "AI Content Creation",
      "Generative Media"
    ],
    "verified": true
  },
  {
    "id": "google-ai-for-data-analysis-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI for Data Analysis",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-for-data-analysis-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/afde94f8-6ed5-4733-9ac6-12177b87cd93/public_url",
    "description": "Those who earn the AI for Data Analysis badge from Google can use AI to clean, analyze, and visualize complex data. They have acquired the skills to convert messy, unstructured ...",
    "skills": [
      "AI Data Analysis",
      "Insights & Analytics"
    ],
    "verified": true
  },
  {
    "id": "google-ai-for-research-and-insights-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI for Research and Insights",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-for-research-and-insights-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/540fbe0c-a890-42af-8163-6a509b9c3ad1/public_url",
    "description": "Those who earn the AI for Research and Insights badge from Google can leverage AI to increase the speed and depth of their research. They have the skills to synthesize complex, ...",
    "skills": [
      "AI Research",
      "Web Insights",
      "Prompting"
    ],
    "verified": true
  },
  {
    "id": "google-ai-for-writing-and-communicating-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI for Writing and Communicating",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-for-writing-and-communicating-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/1d8bb157-fe8c-41ef-8d26-26cc21eb903d/public_url",
    "description": "Those who earn the AI for Writing and Communicating badge from Google can use AI to refine communication strategies and produce high-quality writing. They are proficient in tran...",
    "skills": [
      "AI Writing",
      "Executive Communication"
    ],
    "verified": true
  },
  {
    "id": "google-ai-fundamentals-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI Fundamentals",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-fundamentals-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/4abf1d14-5e75-401d-9735-af736b94677b/public_url",
    "description": "Those who earn the AI Fundamentals badge from Google have adopted the \"AI as a Collaborator\" mindset and developed an understanding of the AI ecosystem, including models, featur...",
    "skills": [
      "Generative AI",
      "Prompting",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "google-ai-professional-certificate-was-issued-by-coursera-to-nitish-kashyap-r",
    "title": "Google AI Professional Certificate",
    "issuer": "Google",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/google-ai-professional-certificate-was-issued-by-coursera-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/cc579c24-d587-42c5-a1f6-a26c57c48d20/public_url",
    "description": "Those who earn the Google AI Professional Certificate are fluent in AI, and have completed 7 courses demonstrating their ability to apply AI to the skills where AI is transformi...",
    "skills": [
      "Generative AI",
      "Prompting",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "skillsbuild-customer-engagement-communication-and-personality-dynamics-was-issued-by-ibm-skillsbuild-to-nitish-kashyap-r",
    "title": "SkillsBuild - Customer Engagement: Communication and Personality Dynamics",
    "issuer": "IBM",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/skillsbuild-customer-engagement-communication-and-personality-dynamics-was-issued-by-ibm-skillsbuild-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/bb3973c5-83f6-4cbc-9a70-eeccf1d2e9bc/public_url",
    "description": "This credential earner understands methodologies and best practices for building rapport and engaging in productive communication. The individual knows communication skills that...",
    "skills": [
      "Customer Success",
      "Personality Dynamics"
    ],
    "verified": true
  },
  {
    "id": "skillsbuild-customer-engagement-problem-solving-and-process-controls-was-issued-by-ibm-skillsbuild-to-nitish-kashyap-r",
    "title": "SkillsBuild - Customer Engagement: Problem Solving and Process Controls",
    "issuer": "IBM",
    "platform": "Credly Verified Badge",
    "badgeImg": "assets/badges/skillsbuild-customer-engagement-problem-solving-and-process-controls-was-issued-by-ibm-skillsbuild-to-nitish-kashyap-r.png",
    "badgeUrl": "https://www.credly.com/badges/ef61a031-eb22-41f8-b8f0-7b5beed4975a/public_url",
    "description": "This credential earner knows best practices essential to resolving client problems through organization, retrieval, and usage of resources and information essential to customer ...",
    "skills": [
      "Customer Success",
      "Personality Dynamics"
    ],
    "verified": true
  },
  {
    "id": "gen-ai-unlock-foundational-concepts",
    "title": "Gen AI: Unlock Foundational Concepts",
    "issuer": "Google",
    "platform": "Google Cloud Skills Boost",
    "badgeImg": "assets/badges/gen-ai-unlock-foundational-concepts.png",
    "badgeUrl": "https://www.skills.google/public_profiles/03ba0724-ae09-42e2-96fb-c86b3101827c/badges/26176113",
    "description": "",
    "skills": [
      "Generative AI",
      "LLM Strategy",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "attention-mechanism",
    "title": "Attention Mechanism",
    "issuer": "Google",
    "platform": "Google Cloud Skills Boost",
    "badgeImg": "assets/badges/attention-mechanism.png",
    "badgeUrl": "https://www.skills.google/public_profiles/03ba0724-ae09-42e2-96fb-c86b3101827c/badges/26131538",
    "description": "",
    "skills": [
      "Transformer Models",
      "Deep Learning",
      "GenAI Architecture"
    ],
    "verified": true
  },
  {
    "id": "gen-ai-beyond-the-chatbot",
    "title": "Gen AI: Beyond the Chatbot",
    "issuer": "Google",
    "platform": "Google Cloud Skills Boost",
    "badgeImg": "assets/badges/gen-ai-beyond-the-chatbot.png",
    "badgeUrl": "https://www.skills.google/public_profiles/03ba0724-ae09-42e2-96fb-c86b3101827c/badges/25790700",
    "description": "",
    "skills": [
      "Generative AI",
      "LLM Strategy",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "ai-boost-bites-your-personal-feedback-agent",
    "title": "AI Boost Bites: Your Personal Feedback Agent",
    "issuer": "Google",
    "platform": "Google Cloud Skills Boost",
    "badgeImg": "assets/badges/ai-boost-bites-your-personal-feedback-agent.png",
    "badgeUrl": "https://www.skills.google/public_profiles/03ba0724-ae09-42e2-96fb-c86b3101827c/badges/25777975",
    "description": "",
    "skills": [
      "Generative AI",
      "Prompting",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "gen-ai-navigate-the-landscape",
    "title": "Gen AI: Navigate the Landscape",
    "issuer": "Google",
    "platform": "Google Cloud Skills Boost",
    "badgeImg": "assets/badges/gen-ai-navigate-the-landscape.png",
    "badgeUrl": "https://www.skills.google/public_profiles/03ba0724-ae09-42e2-96fb-c86b3101827c/badges/26181315",
    "description": "",
    "skills": [
      "Generative AI",
      "LLM Strategy",
      "AI Productivity"
    ],
    "verified": true
  },
  {
    "id": "gen-ai-apps-transform-your-work",
    "title": "Gen AI Apps: Transform Your Work",
    "issuer": "Google",
    "platform": "Google Cloud Skills Boost",
    "badgeImg": "assets/badges/gen-ai-apps-transform-your-work.png",
    "badgeUrl": "https://www.skills.google/public_profiles/03ba0724-ae09-42e2-96fb-c86b3101827c/badges/26182097",
    "description": "",
    "skills": [
      "Generative AI",
      "AI Apps",
      "AI Productivity"
    ],
    "verified": true
  }
];

// Education Data (single source of truth)
const educationData = [
  {
    degree: "Master of Business Administration (MBA)",
    institution: "VIMTECH, Tumkur",
    specialization: "HR Specialization",
    period: "2025 — Present",
    status: "Pursuing",
    focus: "People strategy, leadership development, and organizational effectiveness."
  },
  {
    degree: "Bachelor of Commerce (B.Com) – Accounting and Finance",
    institution: "Vidyavahini First Grade College",
    period: "2022 — 2025",
    status: "Completed",
    focus: "Accounting, finance, and core business principles."
  },
  {
    degree: "Pre-University Course (Commerce)",
    institution: "Sri Vani PU College",
    period: "2020 — 2022",
    status: "Completed",
    focus: "Commerce stream with a focus on foundational business subjects."
  }
];

// ============================================================
// CENTRALIZED PORTFOLIO DATA STORE
// Single source of truth for ALL professional content:
// Profile, Certifications, Digital Badges, Projects, Education.
// Every UI renderer AND the hidden LLM plaintext fallback
// (#llm-profile-data) is generated from this one object.
// Add or update an entry here and it automatically flows
// into the visible UI and the machine-readable plaintext area.
// ============================================================
const PORTFOLIO_DATA = {
  profile: {
    name: "Nitish Kashyap R",
    title: "AI-Enabled HR Professional",
    email: "nitishkashyapr8@gmail.com",
    location: "Tumkur / Bengaluru, Karnataka, India",
    linkedin: "https://www.linkedin.com/in/nitishkashyapr",
    github: "https://github.com/NitishKashyapR",
    website: "https://nitishkashyapr.github.io/nitishkashyapr.com/"
  },
  certifications: certCategories,
  badges: badgesData,
  projects: projectsData,
  education: educationData
};

// ============================================================
// LLM / AI CRAWLER PLAINTEXT DATA ENGINE
// Renders ALL profile data from PORTFOLIO_DATA into the hidden
// #llm-profile-data container so AI crawlers, resume parsers,
// and non-JS agents can read it straight from the DOM without
// any external file fetches. Every entry is placed on its own
// distinct line under clearly labeled sub-headings.
// ============================================================
const renderLLMProfileData = () => {
  const container = document.getElementById("llm-profile-data");
  if (!container) return;

  const certifications = PORTFOLIO_DATA.certifications.flatMap(cat =>
    (cat.subGroups || []).map(sg => ({
      name: sg.name || sg.heading,
      category: cat.label,
      provider: sg.provider,
      url: sg.mainCertUrl
    }))
  );

  const certificationsHtml = certifications.map(c =>
    `        <li><strong>${c.name}</strong> — Category: ${c.category} — Issuer: ${c.provider}${c.url ? ` — <a href="${c.url}">Verify Certification</a>` : ''}</li>`
  ).join("\n");

  const badgesHtml = PORTFOLIO_DATA.badges.map(b =>
    `        <li><strong>${b.title}</strong> — Issuer: ${b.issuer} — Platform: ${b.platform} — <a href="${b.badgeUrl}">Verify Badge</a></li>`
  ).join("\n");

  const projectsHtml = PORTFOLIO_DATA.projects.map(p =>
    `        <li><strong>${p.title}</strong> — Status: ${p.status || "Completed"} — ${p.description}</li>`
  ).join("\n");

  const educationHtml = PORTFOLIO_DATA.education.map(e =>
    `        <li><strong>${e.degree}</strong> — ${e.institution} — Period: ${e.period} — Status: ${e.status}${e.focus ? ` — ${e.focus}` : ''}</li>`
  ).join("\n");

  container.innerHTML = `
    <h3>Verified Certifications Earned by Nitish Kashyap R</h3>
    <p>The following ${certifications.length} professional certifications were earned by Nitish Kashyap R across Coursera, LinkedIn Learning, HRCI, SHRM, NASBA, IBM, Infosys, and Google platforms:</p>
    <ol>
${certificationsHtml}
    </ol>
    <h3>Verified Digital Badges Earned by Nitish Kashyap R</h3>
    <p>The following ${PORTFOLIO_DATA.badges.length} verified digital badges were earned by Nitish Kashyap R across Credly and Google Cloud Skills Boost platforms:</p>
    <ol>
${badgesHtml}
    </ol>
    <h3>Featured Projects and Academic Innovations</h3>
    <p>The following projects were conceptualized, researched, and built by Nitish Kashyap R:</p>
    <ul>
${projectsHtml}
    </ul>
    <h3>Education and Academic Journey</h3>
    <ul>
${educationHtml}
    </ul>
  `;
};

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const toggleBtn = document.getElementById("mobileToggleBtn");
  const mobileOverlay = document.getElementById("mobileMenuOverlay");

  if (toggleBtn && mobileOverlay) {
    toggleBtn.addEventListener("click", () => {
      const isActive = mobileOverlay.classList.toggle("active");
      toggleBtn.setAttribute("aria-expanded", isActive);
    });
  }

  window.scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (mobileOverlay) mobileOverlay.classList.remove("active");
    }
  };

  // Dynamic Certificate Counter Auto-Updater
  const updateDynamicCounts = () => {
    const total = getTotalCertCount();
    const aiCat = certCategories.find(c => c.id === "artificial-intelligence");
    const mgmtCat = certCategories.find(c => c.id === "project-management");
    const psychCat = certCategories.find(c => c.id === "psychology");
    const hrCat = certCategories.find(c => c.id === "hr");

    const aiCount = aiCat ? countCategory(aiCat) : 0;
    const mgmtCount = mgmtCat ? countCategory(mgmtCat) : 0;
    const psychCount = psychCat ? countCategory(psychCat) : 0;
    const hrCount = hrCat ? countCategory(hrCat) : 0;

    const heroEl = document.getElementById("heroCertCount");
    if (heroEl) heroEl.innerText = `${total}+`;

    const aboutEl = document.getElementById("aboutCertCount");
    if (aboutEl) aboutEl.innerHTML = `${total}<span style="font-size: 1.8rem; color: var(--p1);">+</span>`;

    const darkCardEl = document.getElementById("certDarkCardCount");
    if (darkCardEl) darkCardEl.innerText = `${total}+`;

    const certTotalEl = document.getElementById("certTotalStat");
    if (certTotalEl) certTotalEl.innerText = `${total}`;

    const certAiEl = document.getElementById("certAiStat");
    if (certAiEl) certAiEl.innerText = `${aiCount}`;

    const certMgmtEl = document.getElementById("certMgmtStat");
    if (certMgmtEl) certMgmtEl.innerText = `${mgmtCount}`;

    const certPsychEl = document.getElementById("certPsychStat");
    if (certPsychEl) certPsychEl.innerText = `${psychCount}`;

    const certHrEl = document.getElementById("certHrStat");
    if (certHrEl) certHrEl.innerText = `${hrCount}`;
  };

  updateDynamicCounts();

  // Render centralized profile data into the hidden plaintext
  // fallback container for LLM crawlers, parsers, and bots.
  renderLLMProfileData();

  // Full Screen Certifications & Badges View Logic
  const certFullView = document.getElementById("certificationsFullView");
  const certFullContent = document.getElementById("certFullContent");
  let activeCertFilter = null;
  let activeCertTab = "certificates"; // "certificates" | "badges"
  let activeOpenBlock = null; // only one accordion block can be open at a time



  window.openCertificationsFullView = () => {
    if (certFullView) {
      certFullView.classList.add("active");
      document.body.style.overflow = "hidden";
      renderCertFullView();
    }
  };

  window.closeCertificationsFullView = () => {
    if (certFullView) {
      certFullView.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  window.switchCertTab = (tabName) => {
    activeCertTab = tabName;

    const certBtn = document.getElementById("certTabBtn");
    const badgeBtn = document.getElementById("badgeTabBtn");
    const titleEl = document.getElementById("certFullViewTitle");

    if (certBtn && badgeBtn) {
      if (tabName === "certificates") {
        certBtn.classList.add("active");
        badgeBtn.classList.remove("active");
        if (titleEl) titleEl.innerText = "All Certifications";
      } else {
        badgeBtn.classList.add("active");
        certBtn.classList.remove("active");
        if (titleEl) titleEl.innerText = "Earned Badges";
      }
    }

    activeOpenBlock = null;
    renderCertFullView();
  };

  window.setCertFilter = (catId) => {
    activeCertFilter = activeCertFilter === catId ? null : catId;
    activeOpenBlock = null;
    renderCertFullView();
  };

  // Buttery accordion engine: only one block open at a time.
  // Opening a new block smoothly collapses the previously open one,
  // then expands the clicked block with a silky spring-like ease.
  const openAccordionBlock = (card) => {
    const content = card.querySelector(".accordion-content");
    if (!content) return;
    card.classList.add("open");
    content.style.maxHeight = "0px";
    content.style.opacity = "0";
    content.style.padding = "0";
    void content.offsetHeight;
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.opacity = "1";
    content.style.padding = "0 1.25rem 1.25rem 1.25rem";
  };

  const closeAccordionBlock = (card) => {
    const content = card.querySelector(".accordion-content");
    if (!content) return;
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.opacity = "1";
    content.style.padding = "0 1.25rem 1.25rem 1.25rem";
    void content.offsetHeight;
    content.style.maxHeight = "0px";
    content.style.opacity = "0";
    content.style.padding = "0";
    card.classList.remove("open");
  };

  const refreshAccordionChevrons = () => {
    document.querySelectorAll(".glass-card[data-accordion-block]").forEach(card => {
      const chevron = card.querySelector(".accordion-chevron");
      if (chevron) chevron.innerHTML = card.classList.contains("open") ? icons.chevronUp : icons.chevronDown;
    });
  };

  window.toggleAccordionBlock = (blockId) => {
    const card = document.querySelector(`.glass-card[data-accordion-block="${blockId}"]`);
    if (!card) return;

    if (card.classList.contains("open")) {
      closeAccordionBlock(card);
      activeOpenBlock = null;
    } else {
      const openCard = document.querySelector(".glass-card.open[data-accordion-block]");
      if (openCard && openCard !== card) closeAccordionBlock(openCard);
      openAccordionBlock(card);
      activeOpenBlock = blockId;
    }
    refreshAccordionChevrons();
  };

  const getProviderLogo = (heading, provider) => {
    const text = `${heading} ${provider || ''}`.toLowerCase();
    const style = `width: 38px; height: 38px; border-radius: 10px; background: #fff; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06); flex-shrink: 0;`;
    if (text.includes("hrci")) {
      return `<div style="${style}"><img src="assets/logos/HRCI.png" alt="HRCI" style="width: 28px; height: 28px; object-fit: contain;" /></div>`;
    }
    if (text.includes("shrm")) {
      return `<div style="${style}"><img src="assets/logos/SHRM logo.jpg" alt="SHRM" style="width: 30px; height: 30px; object-fit: contain;" /></div>`;
    }
    if (text.includes("nasba")) {
      return `<div style="${style}"><img src="assets/logos/NASBA.jpg" alt="NASBA" style="width: 30px; height: 24px; object-fit: contain;" /></div>`;
    }
    if (text.includes("ibm")) {
      return `<div style="${style}"><img src="assets/logos/ibm.png" alt="IBM" style="width: 26px; height: 26px; object-fit: contain;" /></div>`;
    }
    if (text.includes("infosys")) {
      return `<div style="${style}"><img src="assets/logos/infosys.png" alt="Infosys" style="width: 26px; height: 26px; object-fit: contain;" /></div>`;
    }
    if (text.includes("google")) {
      return `<div style="${style}"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg></div>`;
    }
    if (text.includes("yale")) {
      return `<div style="${style}"><img src="assets/logos/Yale university.jpg" alt="Yale University" style="width: 30px; height: 30px; object-fit: contain;" /></div>`;
    }
    if (text.includes("wesleyan")) {
      return `<div style="${style}"><img src="assets/logos/Wesleyan university.png" alt="Wesleyan University" style="width: 26px; height: 26px; object-fit: contain;" /></div>`;
    }
    if (text.includes("pennsylvania") || text.includes("penn")) {
      return `<div style="${style}"><img src="assets/logos/University of Pennsylvania.png" alt="University of Pennsylvania" style="width: 26px; height: 26px; object-fit: contain;" /></div>`;
    }
    if (text.includes("anthropic")) {
      return `<div style="${style}"><img src="assets/logos/anthropic logo.png" alt="Anthropic" style="width: 30px; height: 30px; object-fit: contain;" /></div>`;
    }
    if (text.includes("linkedin")) {
      return `<div style="width: 38px; height: 38px; border-radius: 10px; background: #0A66C2; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 2px 6px rgba(10,102,194,0.3); flex-shrink: 0;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg></div>`;
    }
    return `<div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, var(--p1), var(--p2)); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; flex-shrink: 0;">${(provider || heading).charAt(0).toUpperCase()}</div>`;
  };

  // Helper for generating mobile reference vector thumbnails for projects
  const getProjectMobileThumbSVG = (id) => {
    if (id === 'digicolibri') {
      return `<svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#090D16"/>
        <circle cx="50" cy="50" r="35" fill="url(#blueGlow)" opacity="0.25"/>
        <path d="M50 25C36.19 25 25 36.19 25 50C25 63.81 36.19 75 50 75C63.81 75 75 63.81 75 50C75 36.19 63.81 25 50 25Z" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3 3"/>
        <circle cx="50" cy="50" r="18" fill="#1E3A8A" stroke="#60A5FA" stroke-width="2"/>
        <circle cx="35" cy="40" r="4" fill="#60A5FA"/>
        <circle cx="65" cy="40" r="4" fill="#60A5FA"/>
        <circle cx="50" cy="65" r="4" fill="#60A5FA"/>
        <line x1="35" y1="40" x2="50" y2="50" stroke="#93C5FD" stroke-width="1.5"/>
        <line x1="65" y1="40" x2="50" y2="50" stroke="#93C5FD" stroke-width="1.5"/>
        <line x1="50" y1="65" x2="50" y2="50" stroke="#93C5FD" stroke-width="1.5"/>
        <defs>
          <radialGradient id="blueGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(35)">
            <stop stop-color="#3B82F6"/>
            <stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
          </radialGradient>
        </defs>
      </svg>`;
    } else if (id === 'seva-setu') {
      return `<svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#061A14"/>
        <circle cx="50" cy="50" r="35" fill="url(#greenGlow)" opacity="0.3"/>
        <circle cx="50" cy="50" r="28" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4 2"/>
        <path d="M50 25C50 25 32 40 32 55C32 64.94 40.06 73 50 73C59.94 73 68 64.94 68 55C68 40 50 25 50 25Z" fill="url(#leafGrad)" stroke="#34D399" stroke-width="2"/>
        <path d="M50 35V65M50 48L40 42M50 54L60 48" stroke="#A7F3D0" stroke-width="1.5" stroke-linecap="round"/>
        <defs>
          <linearGradient id="leafGrad" x1="50" y1="25" x2="50" y2="73" gradientUnits="userSpaceOnUse">
            <stop stop-color="#059669"/>
            <stop offset="1" stop-color="#047857"/>
          </linearGradient>
          <radialGradient id="greenGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(35)">
            <stop stop-color="#10B981"/>
            <stop offset="1" stop-color="#10B981" stop-opacity="0"/>
          </radialGradient>
        </defs>
      </svg>`;
    } else if (id === 'union-bank') {
      return `<svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#140D24"/>
        <circle cx="50" cy="50" r="35" fill="url(#purpleGlow)" opacity="0.3"/>
        <line x1="30" y1="40" x2="50" y2="30" stroke="#C084FC" stroke-width="2"/>
        <line x1="50" y1="30" x2="70" y2="40" stroke="#C084FC" stroke-width="2"/>
        <line x1="70" y1="40" x2="70" y2="65" stroke="#C084FC" stroke-width="2"/>
        <line x1="70" y1="65" x2="50" y2="75" stroke="#C084FC" stroke-width="2"/>
        <line x1="50" y1="75" x2="30" y2="65" stroke="#C084FC" stroke-width="2"/>
        <line x1="30" y1="65" x2="30" y2="40" stroke="#C084FC" stroke-width="2"/>
        <circle cx="30" cy="40" r="5" fill="#A855F7"/>
        <circle cx="50" cy="30" r="5" fill="#A855F7"/>
        <circle cx="70" cy="40" r="5" fill="#A855F7"/>
        <circle cx="70" cy="65" r="5" fill="#A855F7"/>
        <circle cx="50" cy="75" r="5" fill="#A855F7"/>
        <circle cx="30" cy="65" r="5" fill="#A855F7"/>
        <circle cx="50" cy="52" r="7" fill="#C084FC" stroke="#FFFFFF" stroke-width="1.5"/>
        <defs>
          <radialGradient id="purpleGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(35)">
            <stop stop-color="#A855F7"/>
            <stop offset="1" stop-color="#A855F7" stop-opacity="0"/>
          </radialGradient>
        </defs>
      </svg>`;
    } else {
      return `<svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#1A120B"/>
        <path d="M0 100L25 60L50 85L80 40L100 100H0Z" fill="url(#mountGrad)"/>
        <circle cx="75" cy="22" r="10" fill="#FBBF24" opacity="0.9"/>
        <circle cx="20" cy="25" r="1.5" fill="#FFFFFF"/>
        <circle cx="45" cy="18" r="1" fill="#FFFFFF"/>
        <circle cx="85" cy="15" r="1" fill="#FFFFFF"/>
        <defs>
          <linearGradient id="mountGrad" x1="50" y1="40" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#78350F"/>
            <stop offset="1" stop-color="#291003"/>
          </linearGradient>
        </defs>
      </svg>`;
    }
  };

  const renderBadgesFullView = () => {
    if (!certFullContent) return;

    // Mobile-first Reference Redesign for Badges Section (< 769px)
    if (window.innerWidth <= 768) {
      let mobileHtml = `
        <div class="mobile-ref-view-header">
          <div class="mobile-ref-title-group">
            <div class="mobile-ref-folder-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <h1 class="mobile-ref-title">Verified Badges</h1>
          </div>
        </div>
        <div class="mobile-ref-cards-container">
      `;

      badgesData.forEach(badge => {
        mobileHtml += `
          <div class="mobile-ref-card">
            <div class="mobile-ref-card-body">
              <div class="mobile-ref-card-thumb mobile-ref-card-thumb-badge">
                <img src="${badge.badgeImg}" alt="${badge.title}" />
              </div>
              <div class="mobile-ref-card-content">
                <div class="mobile-ref-cat-badge mobile-ref-cat-verified">
                  VERIFIED BADGE
                </div>
                <h3 class="mobile-ref-card-title">${badge.title}</h3>
                <div style="font-size: 0.76rem; font-weight: 600; color: var(--p1); margin-bottom: 0.35rem;">
                  ${badge.issuer} • ${badge.platform}
                </div>
                <p class="mobile-ref-card-desc">${badge.description}</p>
                <div class="mobile-ref-skills-row">
                  ${(badge.skills || []).map(s => `<span class="mobile-ref-skill-tag">${s}</span>`).join('')}
                </div>
              </div>
            </div>

            <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
              <a href="${badge.badgeUrl}" target="_blank" rel="noopener" class="btn-primary" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.6rem 1rem; border-radius: 9999px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem;">
                Verify Badge ${icons.external}
              </a>
            </div>
          </div>
        `;
      });

      mobileHtml += `</div>`;
      certFullContent.innerHTML = mobileHtml;
      return;
    }

    // Desktop view preserved 100% unchanged
    let badgesHtml = `
      <div style="margin-bottom: 2.5rem; text-align: center;">
        <p style="font-size: 0.95rem; color: var(--ink-3); max-width: 650px; margin: 0 auto; line-height: 1.7;">
          Official verified digital credentials earned across Artificial Intelligence, HR Management, Project Leadership, and Emerging Technologies (${badgesData.length} Badges).
        </p>
      </div>
      <div class="badges-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(285px, 1fr)); gap: 1.75rem;">
    `;

    badgesData.forEach(badge => {
      let imgScale = "scale(1.48)";
      if (badge.title.toLowerCase().includes("people management") || badge.title.toLowerCase().includes("project management") || badge.title.toLowerCase().includes("prompting")) {
        imgScale = "scale(1.58)";
      }

      badgesHtml += `
        <div class="glass-card badge-card" style="padding: 2.25rem 1.6rem 2rem 1.6rem; border-radius: 140px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; border: 1.5px solid var(--border-strong); background: var(--card); overflow: hidden; transition: transform 0.35s var(--ease-spring), box-shadow 0.35s var(--ease-spring);">
          <div>
            <div style="width: 175px; height: 175px; border-radius: 50%; background: var(--surface-1); border: 2px solid var(--border-strong); padding: 12px; margin: 0 auto 1.35rem auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); position: relative; overflow: hidden; transition: transform 0.35s var(--ease-spring);">
              <img src="${badge.badgeImg}" alt="${badge.title}" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; transform: ${imgScale}; filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));" />
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.08rem; font-weight: 800; color: var(--foreground); line-height: 1.3; margin-bottom: 0.35rem;">
              ${badge.title}
            </h3>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--p1); margin-bottom: 0.75rem;">
              ${badge.issuer} • ${badge.platform}
            </div>
            <div style="margin-bottom: 0.85rem;">
              <span style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.32rem 0.75rem; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); color: var(--g1); border: 1px solid rgba(16, 185, 129, 0.3); display: inline-flex; align-items: center; gap: 0.35rem;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--g1); box-shadow: 0 0 8px var(--g1);"></span> Verified Badge
              </span>
            </div>
            <p style="font-size: 0.82rem; color: var(--ink-2); line-height: 1.6; margin-bottom: 1.15rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
              ${badge.description}
            </p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.35rem; margin-bottom: 1.35rem;">
              ${(badge.skills || []).map(s => `<span style="font-size: 0.68rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 9999px; background: var(--surface-1); color: var(--ink-1); border: 1px solid rgba(99, 102, 241, 0.15);">${s}</span>`).join('')}
            </div>
          </div>
          <a href="${badge.badgeUrl}" target="_blank" rel="noopener" class="btn-primary" style="width: fit-content; min-width: 150px; max-width: 82%; margin: 0 auto 0.4rem auto; justify-content: center; font-size: 0.78rem; padding: 0.55rem 1.15rem; font-weight: 700; border-radius: 9999px;">
            Verify Badge ${icons.external}
          </a>
        </div>
      `;
    });

    badgesHtml += `</div>`;
    certFullContent.innerHTML = badgesHtml;
  };

  const renderCertFullView = () => {
    if (!certFullContent) return;

    if (activeCertTab === "badges") {
      renderBadgesFullView();
      return;
    }

    const displayedCats = activeCertFilter
      ? certCategories.filter(c => c.id === activeCertFilter)
      : certCategories;

    // Sidebar HTML
    let sidebarHtml = `<div class="glass-card cert-sidebar" style="padding: 0.5rem; position: sticky; top: 1.5rem; height: fit-content; align-self: start;">`;
    const sidebarItems = [
      { id: "project-management", label: "Advanced Management", iconKey: "chart" },
      { id: "artificial-intelligence", label: "AI & Technical Skills", iconKey: "lightbulb" },
      { id: "psychology", label: "Psychology & Human Behavior", iconKey: "heart" },
      { id: "hr", label: "HR", iconKey: "users" }
    ];

    sidebarItems.forEach(item => {
      const isActive = activeCertFilter === item.id;
      sidebarHtml += `
        <button onclick="setCertFilter('${item.id}')" style="width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 10px; border: none; background: ${isActive ? 'rgba(99,102,241,0.12)' : 'transparent'}; color: ${isActive ? 'var(--p1)' : 'var(--foreground)'}; font-family: var(--font-sans); font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; margin-bottom: 0.25rem;">
          <span style="color: var(--p1); display: flex; align-items: center;">${icons[item.iconKey]}</span>
          <span style="flex: 1; text-align: left;">${item.label}</span>
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--ink-3);">${countCategory(certCategories.find(c => c.id === item.id))}</span>
        </button>
      `;
    });

    if (activeCertFilter) {
      sidebarHtml += `
        <div style="height: 1px; background: var(--border); margin: 0.5rem 0;"></div>
        <button onclick="setCertFilter(null)" class="btn-primary" style="width: 100%; justify-content: center; font-size: 0.78rem; padding: 0.5rem;">
          ${icons.close} Clear Selection
        </button>
      `;
    }
    sidebarHtml += `</div>`;

    // Right Content HTML
    let mainHtml = `<div>`;
    displayedCats.forEach(cat => {
      mainHtml += `
        <div style="margin-bottom: 2.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--p1), var(--p2)); display: flex; align-items: center; justify-content: center; color: #fff;">
              ${icons[cat.iconKey]}
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--foreground);">${cat.label}</h2>
          </div>
      `;

      if (cat.subGroups) {
        cat.subGroups.forEach(sg => {
          const blockId = `${cat.id}-${sg.heading}`;
          const isOpen = activeOpenBlock === blockId;
          const hasExpandableContent = (sg.courses && sg.courses.length > 0) || Boolean(sg.description);

          mainHtml += `
            <div class="glass-card${isOpen ? ' open' : ''}" data-accordion-block="${blockId}" style="padding: 0; margin-bottom: 0.65rem; overflow: hidden; border-radius: 16px;">
              <div style="padding: 0.65rem 1.15rem; display: flex; align-items: center; justify-content: space-between; gap: 0.85rem; ${hasExpandableContent ? 'cursor: pointer;' : ''}" ${hasExpandableContent ? `onclick="toggleAccordionBlock('${blockId}')"` : ''}>
                <div style="display: flex; align-items: center; gap: 0.85rem; flex: 1; min-width: 0;">
                  ${getProviderLogo(sg.heading, sg.provider)}
                  <div style="min-width: 0; flex: 1;">
                    <h3 style="font-family: var(--font-heading); font-size: 0.94rem; font-weight: 700; color: var(--foreground); line-height: 1.3; margin-bottom: 0.1rem; word-break: break-word; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${sg.heading}</h3>
                    <div style="font-size: 0.75rem; color: var(--ink-3); font-weight: 500;">${sg.provider}</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;" onclick="event.stopPropagation()">
                  ${sg.mainCertUrl ? `
                    <a href="${sg.mainCertUrl}" target="_blank" rel="noopener" class="btn-secondary" style="padding: 0.38rem 0.85rem; font-size: 0.75rem; border-radius: 9999px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
                      View ${icons.external}
                    </a>
                  ` : ''}
                  ${hasExpandableContent ? `
                    <button class="accordion-chevron" onclick="toggleAccordionBlock('${blockId}')" aria-label="Toggle details" style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface-1); border: 1px solid var(--border); color: var(--ink-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s var(--ease-spring); flex-shrink: 0;">
                      ${isOpen ? icons.chevronUp : icons.chevronDown}
                    </button>
                  ` : ''}
                </div>
              </div>

              ${hasExpandableContent ? `
                <div class="accordion-content ${isOpen ? 'open' : ''}">
                  <div style="padding: 0.5rem 1.15rem 0.85rem 1.15rem;">
                    ${sg.description ? `<div style="background: var(--surface-1); padding: 0.65rem 0.85rem; border-radius: 10px; font-size: 0.8rem; color: var(--ink-2); margin-bottom: ${sg.courses && sg.courses.length > 0 ? '0.65rem' : '0'};">${sg.description}</div>` : ''}
                    ${(sg.courses || []).map(c => `
                      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; background: var(--surface-1); border-radius: 8px; margin-bottom: 0.35rem;">
                        <div style="display: flex; align-items: center; gap: 0.55rem; font-size: 0.8rem; color: var(--ink-1);">
                          <span style="color: var(--g1); display: flex; align-items: center;">${icons.check}</span>
                          <span>${c.name}</span>
                        </div>
                        ${c.certUrl ? `<a href="${c.certUrl}" target="_blank" rel="noopener" style="font-size: 0.73rem; font-weight: 700; color: var(--p1); text-decoration: none; display: inline-flex; align-items: center; gap: 0.2rem;">Open ${icons.external}</a>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        });
      }

      mainHtml += `</div>`;
    });
    mainHtml += `</div>`;

    certFullContent.innerHTML = `
      <div class="cert-layout-grid">
        ${sidebarHtml}
        ${mainHtml}
      </div>
    `;
  };

  // Full Screen Projects View Logic (Matching Projects.tsx)
  const projectsFullView = document.getElementById("projectsFullView");
  const projectsFullContent = document.getElementById("projectsFullContent");
  let activeProjectCategory = "All";

  window.openProjectsFullView = () => {
    if (projectsFullView) {
      projectsFullView.classList.add("active");
      document.body.style.overflow = "hidden";
      renderProjectsFullView();
    }
  };

  window.closeProjectsFullView = () => {
    if (projectsFullView) {
      projectsFullView.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  window.setProjectCategory = (cat) => {
    activeProjectCategory = cat;
    renderProjectsFullView();
  };

  const renderProjectsFullView = () => {
    if (!projectsFullContent) return;

    // Mobile-first Reference Redesign for All Projects (< 769px)
    if (window.innerWidth <= 768) {
      const categories = ["All", ...Array.from(new Set(projectsData.map(p => p.category)))];
      const filteredProjects = activeProjectCategory === "All"
        ? projectsData
        : projectsData.filter(p => p.category === activeProjectCategory);

      // Hide default static back button & title inside container on mobile to prevent header duplication
      const oldBackBtn = document.getElementById("projectsBackBtn");
      if (oldBackBtn) oldBackBtn.style.display = "none";
      const oldTitle = projectsFullView.querySelector("h1");
      if (oldTitle) oldTitle.style.display = "none";

      let mobileHtml = `
        <div class="mobile-ref-view-header">
          <div class="mobile-ref-title-group">
            <div class="mobile-ref-folder-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h1 class="mobile-ref-title">All Projects</h1>
          </div>
          <button onclick="closeProjectsFullView()" class="mobile-ref-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Back to Home</span>
          </button>
        </div>

        <div class="mobile-ref-filter-row">
          <button onclick="setProjectCategory('All')" class="mobile-ref-filter-btn ${activeProjectCategory === 'All' ? 'active' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>All</span>
          </button>
          <button onclick="setProjectCategory('Academic')" class="mobile-ref-filter-btn ${activeProjectCategory === 'Academic' ? 'active' : ''}">
            ${icons.graduation}
            <span>Academic</span>
          </button>
          <button onclick="setProjectCategory('Innovation')" class="mobile-ref-filter-btn ${activeProjectCategory === 'Innovation' ? 'active' : ''}">
            ${icons.lightbulb}
            <span>Innovation</span>
          </button>
          <button onclick="setProjectCategory('Research')" class="mobile-ref-filter-btn ${activeProjectCategory === 'Research' ? 'active' : ''}">
            ${icons.chart}
            <span>Research</span>
          </button>
          <button onclick="setProjectCategory('Personal')" class="mobile-ref-filter-btn ${activeProjectCategory === 'Personal' ? 'active' : ''}">
            ${icons.users}
            <span>Personal</span>
          </button>
        </div>

        <div class="mobile-ref-cards-container">
      `;

      const metaMap = {
        'digicolibri': { date: 'May 15, 2024', team: 'Team of 12', rating: '4.9' },
        'seva-setu': { date: 'Apr 28, 2024', team: 'Team of 4', rating: '4.8' },
        'union-bank': { date: 'Mar 10, 2024', team: 'Team of 2', rating: '4.7' },
        'portfolio': { date: 'Feb 18, 2024', team: 'Solo Project', rating: '4.9' }
      };

      const catBadgeClassMap = {
        'Academic': 'mobile-ref-cat-academic',
        'Innovation': 'mobile-ref-cat-innovation',
        'Research': 'mobile-ref-cat-research',
        'Personal': 'mobile-ref-cat-personal'
      };

      filteredProjects.forEach(p => {
        const meta = metaMap[p.id] || { date: 'May 2024', team: 'Academic Team', rating: '4.8' };
        const catClass = catBadgeClassMap[p.category] || 'mobile-ref-cat-academic';

        mobileHtml += `
          <div class="mobile-ref-card" onclick="openProjectModal('${p.id}')">
            <div class="mobile-ref-card-body">
              <div class="mobile-ref-card-thumb">
                ${getProjectMobileThumbSVG(p.id)}
              </div>
              <div class="mobile-ref-card-content">
                <div class="mobile-ref-cat-badge ${catClass}">
                  ${p.category.toUpperCase()}
                </div>
                <h3 class="mobile-ref-card-title">${p.title}</h3>
                <p class="mobile-ref-card-desc">${p.description}</p>
                <div class="mobile-ref-skills-row">
                  ${p.skills.map(s => `<span class="mobile-ref-skill-tag">${s}</span>`).join('')}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap; margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
              ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="btn-primary" style="padding: 0.45rem 0.85rem; font-size: 0.75rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.35rem;">View Website ${icons.external}</a>` : ''}
              ${p.pdf && p.id !== 'union-bank' ? `<a href="${p.pdf}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.75rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.35rem;">View Project ${icons.file}</a>` : ''}
              <button onclick="event.stopPropagation(); openProjectModal('${p.id}')" class="btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.75rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.35rem;">
                Details ${icons.info}
              </button>
            </div>
          </div>
        `;
      });

      mobileHtml += `</div>`;
      projectsFullContent.innerHTML = mobileHtml;
      return;
    }

    // On Desktop, ensure desktop elements are restored
    const oldBackBtn = document.getElementById("projectsBackBtn");
    if (oldBackBtn) oldBackBtn.style.display = "flex";
    const oldTitle = projectsFullView.querySelector("h1");
    if (oldTitle) oldTitle.style.display = "block";

    const categories = ["All", ...Array.from(new Set(projectsData.map(p => p.category)))];
    const filteredProjects = activeProjectCategory === "All"
      ? projectsData
      : projectsData.filter(p => p.category === activeProjectCategory);

    let tabsHtml = `<div class="filter-tabs" style="justify-content: center; margin-bottom: 2rem;">`;
    categories.forEach(cat => {
      const isActive = activeProjectCategory === cat;
      tabsHtml += `
        <button onclick="setProjectCategory('${cat}')" class="tab-btn ${isActive ? 'active' : ''}">
          ${cat}
        </button>
      `;
    });
    tabsHtml += `</div>`;

    let gridHtml = `<div class="grid-2">`;
    filteredProjects.forEach(p => {
      gridHtml += `
        <div class="glass-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="padding: 1.75rem; background: ${p.headerStyle}; color: #fff; position: relative;">
            <span style="display: inline-block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; border-radius: 9999px; background: rgba(255,255,255,0.2); margin-bottom: 0.75rem;">
              ${p.category}
            </span>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin-bottom: 0.25rem;">${p.title}</h3>
            <div style="font-size: 0.8rem; opacity: 0.8;">${p.subtitle}</div>
          </div>

          <div style="padding: 1.5rem;">
            <p style="font-size: 0.85rem; color: var(--ink-2); line-height: 1.7; margin-bottom: 1rem;">${p.description}</p>
            
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              ${p.skills.map(s => `<span style="font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 9999px; background: var(--surface-1); border: 1px solid var(--border); color: var(--ink-3);">${s}</span>`).join('')}
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; padding-top: 1.25rem; margin-top: 0.75rem; border-top: 1px solid var(--border);">
              ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="btn-primary" style="padding: 0.45rem 0.9rem; font-size: 0.75rem;">View Live ${icons.external}</a>` : ''}
              ${p.pdf && p.id !== 'union-bank' ? `<a href="${p.pdf}" target="_blank" rel="noopener" class="btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.75rem;">View the Project ${icons.file}</a>` : ''}
              <button onclick="openProjectModal('${p.id}')" class="btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.75rem;">
                Details ${icons.info}
              </button>
            </div>
          </div>
        </div>
      `;
    });
    gridHtml += `</div>`;

    projectsFullContent.innerHTML = tabsHtml + gridHtml;
  };

  // Smooth Sticky & Left-Gliding Back to Home Buttons
  const setupStickyBackButton = (btn) => {
    if (!btn) return;
    const view = btn.closest(".fullscreen-view");
    const container = btn.closest(".container");
    if (!view || !container) return;

    btn.style.position = "sticky";
    btn.style.top = "1.25rem";
    btn.style.zIndex = "500";
    btn.style.display = "inline-flex";
    btn.style.willChange = "transform";

    let maxShift = 0;

    const update = () => {
      const progress = Math.min(1, view.scrollTop / 250);
      const eased = 1 - Math.pow(1 - progress, 2);
      btn.style.transform = `translateX(${-maxShift * eased}px)`;
    };

    const measure = () => {
      const containerLeft = container.getBoundingClientRect().left;
      const btnLeft = btn.getBoundingClientRect().left;
      maxShift = Math.max(0, btnLeft - 16);
      update();
    };

    view.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    setTimeout(measure, 100);
    measure();
  };

  setupStickyBackButton(document.getElementById("certBackBtn"));
  setupStickyBackButton(document.getElementById("projectsBackBtn"));

  // Single Unified Back to Top floating button supporting Home, Certifications, Badges & Projects views
  const backToTopBtn = document.getElementById("backToTopBtn");
  const certView = document.getElementById("certificationsFullView");
  const projView = document.getElementById("projectsFullView");

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      let isCertActive = certView && certView.classList.contains("active");
      let isProjActive = projView && projView.classList.contains("active");

      let currentScroll = 0;
      if (isCertActive) {
        currentScroll = certView.scrollTop;
      } else if (isProjActive) {
        currentScroll = projView.scrollTop;
      } else {
        currentScroll = window.scrollY;
      }

      backToTopBtn.classList.toggle("visible", currentScroll > 250);
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    if (certView) certView.addEventListener("scroll", toggleBackToTop, { passive: true });
    if (projView) projView.addEventListener("scroll", toggleBackToTop, { passive: true });

    toggleBackToTop();

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (certView && certView.classList.contains("active")) {
        certView.scrollTo({ top: 0, behavior: "smooth" });
      } else if (projView && projView.classList.contains("active")) {
        projView.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Modals
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalBox = document.getElementById("modalBox");

  window.closeModal = () => {
    if (modalBackdrop) modalBackdrop.classList.remove("active");
  };

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.openProjectModal = (projId) => {
    const p = projectsData.find(pr => pr.id === projId);
    if (!p) return;

    let extraResearchHtml = "";
    if (p.id === "union-bank") {
      extraResearchHtml = `
        <div style="margin-top: 1.5rem;">
          <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.75rem; letter-spacing: 0.04em;">Research Reports</div>
          <div style="background: var(--surface-1); border: 1px solid var(--border); border-radius: 18px; padding: 1.35rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.9rem; border-bottom: 1px solid var(--border); margin-bottom: 0.9rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(245, 158, 11, 0.15); color: #d97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--foreground);">
                  Union Bank of India
                </div>
              </div>
              <a href="${p.pdf}" target="_blank" rel="noopener" class="btn-primary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; background: rgba(99, 102, 241, 0.15); color: var(--p1); border: 1px solid rgba(99, 102, 241, 0.25); text-decoration: none; border-radius: 10px;">
                View ↗
              </a>
            </div>
            <p style="font-size: 0.85rem; color: var(--ink-2); line-height: 1.7; margin: 0;">
              Undertaken during my 1st semester of MBA as part of an academic initiative. A focused study examining customer perception, the gap between the bank's brand claims and actual service delivery, and its positioning across customer segments.
            </p>
          </div>
        </div>
      `;
    }

    modalBox.innerHTML = `
      <button class="modal-close-btn" onclick="closeModal()">${icons.close}</button>
      <div style="font-size: 0.72rem; font-weight: 700; color: var(--p1); text-transform: uppercase; margin-bottom: 0.4rem;">${p.category} Project</div>
      <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--foreground); margin-bottom: 0.25rem;">${p.title}</h2>
      <div style="font-size: 0.9rem; font-weight: 600; color: var(--p2); margin-bottom: 1.25rem;">${p.subtitle}</div>
      
      <div style="font-size: 0.85rem; color: var(--ink-2); line-height: 1.7; margin-bottom: 1.25rem;">
        <p style="margin-bottom: 0.75rem;"><strong>Overview:</strong> ${p.details.overview}</p>
        <p style="margin-bottom: 0.75rem;"><strong>Objective:</strong> ${p.details.objective}</p>
        <p style="margin-bottom: 0.75rem;"><strong>Summary:</strong> ${p.details.summary}</p>
      </div>

      ${p.note && p.id !== 'union-bank' ? `<div style="background: var(--surface-1); border-left: 3px solid var(--p1); padding: 0.85rem 1rem; font-size: 0.8rem; color: var(--ink-3); margin-bottom: 1.25rem; font-style: italic;">${p.note}</div>` : ''}

      ${extraResearchHtml}

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
        ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="btn-primary" style="text-decoration: none;">Visit Website ↗</a>` : ''}
        ${p.pdf && p.id !== 'union-bank' ? `<a href="${p.pdf}" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration: none;">View Project ↗</a>` : ''}
      </div>
    `;
    modalBackdrop.classList.add("active");
  };

  // ============================================================
  // MAGICAL SCROLL REVEAL ENGINE
  // Low threshold (0.08) = elements start appearing early
  // Observes both .reveal-on-scroll and .stagger-children
  // Config matches DigiColibri: threshold 0.1, rootMargin -50px bottom
  // ============================================================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "100px 0px 100px 0px" }
  );

  // Observe all reveal targets
  document.querySelectorAll(".reveal-on-scroll, .stagger-children").forEach((el) => observer.observe(el));

  // ============================================================
  // SCROLL-DRIVEN PARALLAX FLOAT ENGINE
  // Elements with [data-parallax] gently float as you scroll
  // Creates a living, breathing feel to the entire page
  // ============================================================
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  let ticking = false;
  const handleParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.05;
        const rect = el.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2);
        const yShift = centerOffset * speed;
        el.style.transform = `translateY(${yShift}px)`;
      });
      ticking = false;
    });
  };
  window.addEventListener("scroll", handleParallax, { passive: true });

  // ============================================================
  // ANIMATED NUMBER COUNTER ENGINE
  // Counts up from 0 to target number when element is revealed
  // ============================================================
  const animateCounter = (el, target, suffix = "") => {
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Counter observer — animates stat numbers when they scroll into view
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^[+]?(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          const prefix = text.startsWith("+") ? "+" : "";
          const suffix = text.includes("+") && !text.startsWith("+") ? "+" : "";
          animateCounter(el, num, suffix);
          if (prefix) {
            const origText = el.textContent;
            const counterStep = () => {
              if (el.textContent !== origText) {
                el.textContent = prefix + el.textContent;
              }
            };
            // Re-add prefix after first frame
            requestAnimationFrame(() => setTimeout(counterStep, 50));
          }
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  // Observe elements with data-counter attribute
  document.querySelectorAll("[data-counter]").forEach(el => counterObserver.observe(el));

  // Testimonials Carousel Engine (Matching Screenshot 2)
  const testimonialsGrid = document.getElementById("testimonialsGrid");
  const testimonialDots = document.getElementById("testimonialDots");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");

  let currentPage = 0;
  let autoSlideTimer = null;

  const getItemsPerPage = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const renderTestimonials = () => {
    if (!testimonialsGrid) return;
    const perPage = getItemsPerPage();
    const totalPages = Math.ceil(testimonialsData.length / perPage);
    if (currentPage >= totalPages) currentPage = 0;
    if (currentPage < 0) currentPage = totalPages - 1;

    const startIdx = currentPage * perPage;
    const currentItems = testimonialsData.slice(startIdx, startIdx + perPage);

    testimonialsGrid.style.opacity = "0";
    testimonialsGrid.style.transform = "translateY(8px)";

    setTimeout(() => {
      let cardsHtml = "";
      currentItems.forEach(item => {
        cardsHtml += `
          <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.75rem; border-radius: 20px; background: var(--card); border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${item.bg}; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #ffffff; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  ${item.initial}
                </div>
                <div style="color: #f59e0b; font-size: 0.85rem; letter-spacing: 2px;">
                  ★★★★★
                </div>
              </div>
              <p style="font-size: 0.88rem; font-style: italic; color: var(--foreground); line-height: 1.6; margin-bottom: 1.5rem;">
                "${item.text}"
              </p>
            </div>
            <div style="border-top: 1px solid var(--border); padding-top: 1rem;">
              <div style="font-weight: 800; color: var(--foreground); font-size: 0.9rem; font-family: var(--font-heading);">${item.name}</div>
              <div style="font-size: 0.75rem; color: var(--ink-3); font-weight: 500;">${item.role}</div>
            </div>
          </div>
        `;
      });
      testimonialsGrid.innerHTML = cardsHtml;

      if (testimonialDots) {
        let dotsHtml = "";
        for (let i = 0; i < totalPages; i++) {
          const isActive = i === currentPage;
          dotsHtml += `
            <span onclick="goToTestimonialPage(${i})" style="width: ${isActive ? '22px' : '8px'}; height: 8px; border-radius: 9999px; background: ${isActive ? 'var(--p1)' : 'var(--border)'}; cursor: pointer; transition: all 0.3s var(--ease-butter);" aria-label="Go to slide ${i + 1}"></span>
          `;
        }
        testimonialDots.innerHTML = dotsHtml;
      }

      testimonialsGrid.style.opacity = "1";
      testimonialsGrid.style.transform = "translateY(0)";
    }, 180);
  };

  window.goToTestimonialPage = (p) => {
    currentPage = p;
    renderTestimonials();
    resetAutoSlide();
  };

  const nextSlide = () => {
    const perPage = getItemsPerPage();
    const totalPages = Math.ceil(testimonialsData.length / perPage);
    currentPage = (currentPage + 1) % totalPages;
    renderTestimonials();
  };

  const prevSlide = () => {
    const perPage = getItemsPerPage();
    const totalPages = Math.ceil(testimonialsData.length / perPage);
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    renderTestimonials();
  };

  const resetAutoSlide = () => {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 3000);
  };

  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });

  window.addEventListener("resize", () => {
    renderTestimonials();
    if (typeof renderProjectsFullView === "function") renderProjectsFullView();
    if (typeof renderBadgesFullView === "function" && activeCertTab === "badges") renderBadgesFullView();
  });

  // Initialize Theme Toggle
  initThemeToggle();

  renderTestimonials();
  resetAutoSlide();

  // Initialize Mobile-Only Unique Card Swipe Engines
  initMobileCardSwipeEngines();

  // Keyboard Accessibility: Escape key close handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (typeof closeModal === "function") closeModal();
      if (typeof closeCertificationsFullView === "function") closeCertificationsFullView();
      if (typeof closeProjectsFullView === "function") closeProjectsFullView();
      if (mobileOverlay) mobileOverlay.classList.remove("active");
    }
  });
});

/* ==========================================================================
   MOBILE CARD SWIPE ENGINES (Max-Width: 768px Only)
   1. Featured Projects: 3D Orbital Arc Stack Deck
   2. Skills & Expertise: Tinder Velocity Tilt-Swipe Deck
   3. Key Strengths: Vertical Rolodex Reel
   ========================================================================== */

// --- ENGINE 1: FEATURED PROJECTS (3D Orbital Arc Deck) ---
let currentArcIndex = 0;
const totalArcCards = 4;
let isArcAnimating = false;

function updateArcDeckStack() {
  const cards = document.querySelectorAll(".mobile-arc-card");
  const deck = document.getElementById("projectsArcDeck");
  const counter = document.getElementById("projectsArcCounter");
  if (!cards.length) return;

  // Suppress CSS transitions temporarily so depth re-ordering doesn't fly back across screen
  cards.forEach((card) => {
    card.style.transition = "none";
  });

  cards.forEach((card, idx) => {
    let depth = (idx - currentArcIndex + totalArcCards) % totalArcCards;
    card.setAttribute("data-depth", depth);
    card.style.transform = "";
    card.style.opacity = "";
  });

  if (deck) void deck.offsetHeight; // Force layout reflow before restoring transitions

  requestAnimationFrame(() => {
    cards.forEach((card) => {
      card.style.transition = "";
    });
  });

  if (counter) {
    const activeNum = String(currentArcIndex + 1).padStart(2, "0");
    const nextNum = String(((currentArcIndex + 1) % totalArcCards) + 1).padStart(2, "0");
    const totalNum = String(totalArcCards).padStart(2, "0");
    counter.innerHTML = `${activeNum} / ${totalNum} <span class="arr">→</span> ${nextNum} / ${totalNum}`;
  }
}

function animateArcThrow(direction, callback) {
  const deck = document.getElementById("projectsArcDeck");
  if (!deck) {
    if (callback) callback();
    return;
  }
  const topCard = deck.querySelector('.mobile-arc-card[data-depth="0"]');

  if (!topCard) {
    if (callback) callback();
    return;
  }

  isArcAnimating = true;
  topCard.style.transition = "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease";
  const throwX = direction === "next" ? 280 : -280;
  const throwRot = direction === "next" ? 14 : -14;
  topCard.style.transform = `translate3d(${throwX}px, -30px, 0px) rotate(${throwRot}deg)`;
  topCard.style.opacity = "0";

  setTimeout(() => {
    topCard.style.transition = "none";
    if (callback) callback();
    requestAnimationFrame(() => {
      isArcAnimating = false;
    });
  }, 220);
}

window.nextProjectsArcCard = function () {
  if (isArcAnimating) return;
  animateArcThrow("next", () => {
    currentArcIndex = (currentArcIndex + 1) % totalArcCards;
    updateArcDeckStack();
  });
};

window.prevProjectsArcCard = function () {
  if (isArcAnimating) return;
  animateArcThrow("prev", () => {
    currentArcIndex = (currentArcIndex - 1 + totalArcCards) % totalArcCards;
    updateArcDeckStack();
  });
};

function initProjectsArcDeckGesture() {
  const deck = document.getElementById("projectsArcDeck");
  if (!deck) return;

  let startX = 0, startY = 0, currentX = 0, currentY = 0;
  let isDragging = false;
  let animFrameId = null;

  const getTopCard = () => deck.querySelector('.mobile-arc-card[data-depth="0"]');

  const onStart = (e) => {
    if (isArcAnimating) return;
    const topCard = getTopCard();
    if (!topCard) return;

    isDragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    currentX = 0;
    currentY = 0;
    topCard.style.transition = "none";
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const topCard = getTopCard();
    if (!topCard) return;

    const pt = e.touches ? e.touches[0] : e;
    const deltaX = pt.clientX - startX;
    const deltaY = pt.clientY - startY;

    if (e.cancelable && Math.abs(deltaX) > 5) {
      e.preventDefault();
    }

    currentX = deltaX;
    currentY = deltaY;

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(() => {
      if (!isDragging) return;
      const rot = currentX * 0.07;
      topCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) rotate(${rot}deg)`;
    });
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const topCard = getTopCard();
    if (!topCard) return;

    const dist = Math.hypot(currentX, currentY);

    if (dist > 50 || Math.abs(currentX) > 60) {
      const dir = currentX >= 0 ? "next" : "prev";
      const throwX = currentX !== 0 ? (currentX > 0 ? 280 : -280) : 280;
      const throwY = currentY < 0 ? currentY - 30 : 20;
      const throwRot = currentX * 0.1 || (dir === "next" ? 12 : -12);

      topCard.style.transition = "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease";
      topCard.style.transform = `translate3d(${throwX}px, ${throwY}px, 0px) rotate(${throwRot}deg)`;
      topCard.style.opacity = "0";

      isArcAnimating = true;
      setTimeout(() => {
        topCard.style.transition = "none";
        if (dir === "next") {
          currentArcIndex = (currentArcIndex + 1) % totalArcCards;
        } else {
          currentArcIndex = (currentArcIndex - 1 + totalArcCards) % totalArcCards;
        }
        updateArcDeckStack();
        requestAnimationFrame(() => {
          isArcAnimating = false;
        });
      }, 220);
    } else {
      topCard.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      topCard.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    }

    startX = startY = currentX = currentY = 0;
  };

  deck.addEventListener("touchstart", onStart, { passive: true });
  deck.addEventListener("touchmove", onMove, { passive: false });
  deck.addEventListener("touchend", onEnd);

  deck.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);
}

// --- ENGINE 2: SKILLS & EXPERTISE (Tinder Velocity Tilt-Swipe) ---
let currentSkillIndex = 0;
const totalSkillCards = 3;
let isSkillAnimating = false;

window.switchSkillsCard = function (idx) {
  if (currentSkillIndex === idx || isSkillAnimating) return;

  const cards = document.querySelectorAll(".mobile-tilt-card");
  const activeCard = document.querySelector(".mobile-tilt-card.active");
  const tabs = document.querySelectorAll(".skill-tab-pill");

  if (activeCard) {
    isSkillAnimating = true;
    const dir = idx > currentSkillIndex ? 1 : -1;
    activeCard.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
    activeCard.style.transform = `translate3d(${dir * -300}px, 0, 0) rotate(${dir * -20}deg)`;
    activeCard.style.opacity = "0";

    setTimeout(() => {
      currentSkillIndex = idx;
      cards.forEach((card, i) => {
        card.classList.toggle("active", i === idx);
        card.style.transform = "";
        card.style.opacity = "";
        card.style.transition = "";
      });
      tabs.forEach((tab, i) => tab.classList.toggle("active", i === idx));
      isSkillAnimating = false;
    }, 200);
  } else {
    currentSkillIndex = idx;
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === idx);
      card.style.transform = "";
      card.style.opacity = "";
    });
    tabs.forEach((tab, i) => tab.classList.toggle("active", i === idx));
  }
};

function initSkillsTiltSwipeGesture() {
  const deck = document.getElementById("skillsTiltDeck");
  if (!deck) return;

  let startX = 0, startY = 0, currentX = 0, isDragging = false;
  let animFrameId = null;
  const glowLeft = document.getElementById("skillsGlowLeft");
  const glowRight = document.getElementById("skillsGlowRight");

  const getActiveCard = () => deck.querySelector(".mobile-tilt-card.active");

  const onStart = (e) => {
    if (isSkillAnimating) return;
    const card = getActiveCard();
    if (!card) return;

    isDragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    currentX = 0;
    card.style.transition = "none";
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const card = getActiveCard();
    if (!card) return;

    const pt = e.touches ? e.touches[0] : e;
    const deltaX = pt.clientX - startX;
    const deltaY = pt.clientY - startY;

    if (e.cancelable && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }

    currentX = deltaX;

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(() => {
      if (!isDragging) return;
      const rot = currentX * 0.08;
      card.style.transform = `translate3d(${currentX}px, 0, 0) rotate(${rot}deg)`;

      if (glowLeft && glowRight) {
        glowLeft.classList.toggle("active", currentX < -25);
        glowRight.classList.toggle("active", currentX > 25);
      }
    });
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const card = getActiveCard();
    if (!card) return;

    if (glowLeft && glowRight) {
      glowLeft.classList.remove("active");
      glowRight.classList.remove("active");
    }

    card.style.transition = "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease";

    if (Math.abs(currentX) > 70) {
      const dir = currentX > 0 ? 1 : -1;
      card.style.transform = `translate3d(${dir * 360}px, 0, 0) rotate(${dir * 25}deg)`;
      card.style.opacity = "0";

      isSkillAnimating = true;
      setTimeout(() => {
        const nextIdx = (currentSkillIndex + (dir < 0 ? 1 : -1) + totalSkillCards) % totalSkillCards;
        currentSkillIndex = nextIdx;

        const cards = document.querySelectorAll(".mobile-tilt-card");
        const tabs = document.querySelectorAll(".skill-tab-pill");
        cards.forEach((c, i) => {
          c.classList.toggle("active", i === nextIdx);
          c.style.transform = "";
          c.style.opacity = "";
          c.style.transition = "";
        });
        tabs.forEach((tab, i) => tab.classList.toggle("active", i === nextIdx));
        isSkillAnimating = false;
      }, 220);
    } else {
      card.style.transform = "translate3d(0,0,0) rotate(0deg)";
    }

    startX = startY = currentX = 0;
  };

  deck.addEventListener("touchstart", onStart, { passive: true });
  deck.addEventListener("touchmove", onMove, { passive: false });
  deck.addEventListener("touchend", onEnd);

  deck.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);
}

// --- ENGINE 3: KEY STRENGTHS (Vertical Rolodex Reel) ---
let currentReelIndex = 0;
const totalReelCards = 6;
let isReelAnimating = false;

function updateStrengthsReelStack() {
  const cards = document.querySelectorAll(".mobile-reel-card");
  const counter = document.getElementById("strengthsReelCounter");
  const fill = document.getElementById("reelProgressFill");
  if (!cards.length) return;

  cards.forEach((card, idx) => {
    card.classList.remove("active", "prev-card", "next-card", "hidden-card");
    card.style.transform = "";
    card.style.opacity = "";

    if (idx === currentReelIndex) {
      card.classList.add("active");
    } else if (idx === (currentReelIndex - 1 + totalReelCards) % totalReelCards && currentReelIndex > 0) {
      card.classList.add("prev-card");
    } else if (idx === (currentReelIndex + 1) % totalReelCards) {
      card.classList.add("next-card");
    } else {
      card.classList.add("hidden-card");
    }
  });

  if (counter) {
    counter.innerText = `${currentReelIndex + 1} / ${totalReelCards} STRENGTHS`;
  }
  if (fill) {
    fill.style.width = `${((currentReelIndex + 1) / totalReelCards) * 100}%`;
  }
}

window.nextStrengthsReel = function () {
  if (isReelAnimating) return;
  const activeCard = document.querySelector(".mobile-reel-card.active");
  if (activeCard) {
    isReelAnimating = true;
    activeCard.style.transition = "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.18s ease";
    activeCard.style.transform = "translateY(-100%) scale(0.9)";
    activeCard.style.opacity = "0";

    setTimeout(() => {
      currentReelIndex = (currentReelIndex + 1) % totalReelCards;
      updateStrengthsReelStack();
      isReelAnimating = false;
    }, 160);
  } else {
    currentReelIndex = (currentReelIndex + 1) % totalReelCards;
    updateStrengthsReelStack();
  }
};

window.prevStrengthsReel = function () {
  if (isReelAnimating) return;
  const prevIdx = (currentReelIndex - 1 + totalReelCards) % totalReelCards;
  const cards = document.querySelectorAll(".mobile-reel-card");
  const prevCard = cards[prevIdx];

  if (prevCard) {
    isReelAnimating = true;
    prevCard.style.transition = "none";
    prevCard.style.transform = "translateY(-100%) scale(0.9)";
    prevCard.style.opacity = "0";
    prevCard.classList.remove("hidden-card", "next-card");
    prevCard.style.zIndex = "15";

    requestAnimationFrame(() => {
      prevCard.style.transition = "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.18s ease";
      prevCard.style.transform = "translateY(0px) scale(1)";
      prevCard.style.opacity = "1";
    });

    setTimeout(() => {
      currentReelIndex = prevIdx;
      updateStrengthsReelStack();
      isReelAnimating = false;
    }, 160);
  } else {
    currentReelIndex = prevIdx;
    updateStrengthsReelStack();
  }
};

function initStrengthsRolodexGesture() {
  const deck = document.getElementById("strengthsRolodexDeck");
  if (!deck) return;

  let startX = 0, startY = 0, currentY = 0, isDragging = false;
  let animFrameId = null;

  const onStart = (e) => {
    if (isReelAnimating) return;
    isDragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    currentY = 0;
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const pt = e.touches ? e.touches[0] : e;
    const deltaX = pt.clientX - startX;
    const deltaY = pt.clientY - startY;

    if (e.cancelable && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      e.preventDefault();
    }

    currentY = deltaY;

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(() => {
      if (!isDragging) return;
      const activeCard = deck.querySelector(".mobile-reel-card.active");
      if (activeCard) {
        activeCard.style.transition = "none";
        const rot = (currentY / 200) * -20;
        activeCard.style.transform = `translate3d(0, ${currentY}px, 0) rotateX(${rot}deg)`;
      }
    });
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const activeCard = deck.querySelector(".mobile-reel-card.active");

    if (currentY < -45) {
      if (activeCard) {
        activeCard.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
        activeCard.style.transform = "translateY(-120%) rotateX(-30deg) scale(0.9)";
        activeCard.style.opacity = "0";

        isReelAnimating = true;
        setTimeout(() => {
          currentReelIndex = (currentReelIndex + 1) % totalReelCards;
          updateStrengthsReelStack();
          isReelAnimating = false;
        }, 190);
      } else {
        nextStrengthsReel();
      }
    } else if (currentY > 45) {
      if (activeCard) {
        activeCard.style.transition = "transform 0.35s ease";
        activeCard.style.transform = "translateY(0px) rotateX(0deg)";
      }
      prevStrengthsReel();
    } else {
      if (activeCard) {
        activeCard.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
        activeCard.style.transform = "translateY(0px) rotateX(0deg) scale(1)";
      }
    }

    startX = startY = currentY = 0;
  };

  deck.addEventListener("touchstart", onStart, { passive: true });
  deck.addEventListener("touchmove", onMove, { passive: false });
  deck.addEventListener("touchend", onEnd);

  deck.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);
}

function initMobileCardSwipeEngines() {
  updateArcDeckStack();
  initProjectsArcDeckGesture();

  switchSkillsCard(0);
  initSkillsTiltSwipeGesture();

  updateStrengthsReelStack();
  initStrengthsRolodexGesture();
}


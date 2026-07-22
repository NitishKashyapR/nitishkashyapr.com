import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealSection from "@/components/RevealSection";
import HeroSection from "@/components/sections/HeroSection";
import TickerSection from "@/components/sections/TickerSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import EducationSection from "@/components/sections/EducationSection";
import StrengthsSection from "@/components/sections/StrengthsSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import MobileHome from "@/components/mobile/MobileHome";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      {/* Mobile layout — portrait on touch devices */}
      <div className="layout-mobile">
        <MobileHome />
      </div>

      {/* Desktop layout — always on desktops, and landscape on touch devices */}
      <div className="layout-desktop">
        <HeroSection />
        <TickerSection />
        <RevealSection><AboutSection /></RevealSection>
        <RevealSection delay={60}><SkillsSection /></RevealSection>
        <RevealSection><EducationSection /></RevealSection>
        <RevealSection delay={60}><StrengthsSection /></RevealSection>
        <RevealSection><CertificationsSection /></RevealSection>
        <RevealSection delay={60}><ProjectsSection /></RevealSection>
        <RevealSection><TestimonialsSection /></RevealSection>
        <RevealSection><ContactSection /></RevealSection>
      </div>
    </main>
    <div className="layout-desktop">
      <Footer />
    </div>
  </div>
);

export default Index;

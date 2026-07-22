import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const RevealSection = ({ children, delay = 0, className = "" }: RevealSectionProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-5 blur-[4px]"
      } ${className}`}
      style={{
        transitionDuration: "700ms",
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

export default RevealSection;

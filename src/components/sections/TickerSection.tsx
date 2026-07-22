const tickerItems = [
  "Human Resources", "AI-Enabled HR", "Talent Management", "Organizational Development",
  "People Strategy", "Workplace Culture", "Leadership Development", "MBA Student",
];

const TickerSection = () => (
  <div className="overflow-hidden bg-gradient-to-r from-p1 via-p2 to-r1 py-3">
    <div className="flex animate-ticker whitespace-nowrap">
      {[...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-3.5 px-5 text-[0.67rem] font-bold tracking-[0.13em] uppercase text-primary-foreground/70 flex-shrink-0">
          {item}
          <span className="w-[3px] h-[3px] rounded-full bg-primary-foreground/50 flex-shrink-0" />
        </span>
      ))}
    </div>
  </div>
);

export default TickerSection;

interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  titleAccent: string;
  description?: string;
  chip?: string;
}

const SectionHeader = ({ number, label, title, titleAccent, description, chip }: SectionHeaderProps) => (
  <div className="mb-12 md:mb-14">
    <div className="flex items-end justify-between gap-6 flex-wrap mb-2">
      <div>
        <div className="flex items-center gap-1.5 text-[0.66rem] font-bold tracking-[0.14em] uppercase text-p1 mb-2.5">
          <span className="w-4 h-0.5 bg-gradient-to-r from-p1 to-p2 rounded-full" />
          {number} — {label}
        </div>
        <h2 className="font-heading text-[clamp(1.8rem,3vw,2.8rem)] font-bold text-foreground tracking-[-0.03em] leading-[1.05]">
          {title} <span className="gradient-text">{titleAccent}</span>
        </h2>
      </div>
      {description && (
        <p className="text-[0.84rem] text-ink-3 leading-[1.75] max-w-[340px] text-right">
          {description}
          {chip && (
            <span className="inline-block ml-2 text-[0.65rem] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full bg-surface-1 text-p1 border border-p1/15">
              {chip}
            </span>
          )}
        </p>
      )}
    </div>
  </div>
);

export default SectionHeader;

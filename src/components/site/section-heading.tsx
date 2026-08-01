import { ArrowDownRight } from "lucide-react";

export function SectionHeading({ pos, eyebrow, title, copy, light = false }: {
  pos: string;
  eyebrow: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <header className={`section-heading${light ? " section-heading--light" : ""}`}>
      <div className="section-heading__marker">
        <span>{pos}</span>
        <ArrowDownRight size={17} aria-hidden="true" />
      </div>
      <div>
        <p className="utility-label">{eyebrow}</p>
        <h2>{title}</h2>
        {copy && <p className="section-heading__copy">{copy}</p>}
      </div>
    </header>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero__terrain" aria-hidden="true" />
      <div className="shell page-hero__inner">
        <p className="utility-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="shell page-hero__scale" aria-hidden="true">0M <span /> 250M <span /> 500M <span /> 750M</div>
    </section>
  );
}

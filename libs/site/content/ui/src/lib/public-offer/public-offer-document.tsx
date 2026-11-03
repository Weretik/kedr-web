import type { PublicOfferDictionary } from '@site/content/model';

/** All clauses stay in initial HTML and outside disclosure or client boundaries. */
export function PublicOfferDocument({ dictionary }: { dictionary: PublicOfferDictionary }) {
  return (
    <article
      data-offer-document
      aria-label={dictionary.fullTitle}
      className="min-w-0 max-w-[75ch] space-y-8"
    >
      {dictionary.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={section.id + '-title'}
          className="scroll-mt-48 border-t border-border pt-6 md:scroll-mt-20"
        >
          <h2 id={section.id + '-title'} className="text-xl font-bold tracking-tight sm:text-2xl">
            {section.title}
            {section.subtitle && (
              <span className="mt-2 block text-base font-normal leading-relaxed text-muted-foreground">
                {' '}
                {section.subtitle}
              </span>
            )}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-7">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} data-offer-clause>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
      <p
        data-offer-note
        className="rounded-xl border border-border bg-muted/60 p-5 text-base leading-7 text-muted-foreground"
      >
        {dictionary.note}
      </p>
    </article>
  );
}

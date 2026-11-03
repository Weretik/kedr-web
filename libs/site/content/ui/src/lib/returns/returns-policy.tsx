import type { ReturnsDictionary, ReturnsPolicySection } from '@site/content/model';

function PolicySection({
  section,
  nested = false,
}: {
  section: ReturnsPolicySection;
  nested?: boolean;
}) {
  const Heading = nested ? 'h4' : 'h3';
  return (
    <section className="space-y-3">
      <Heading className={nested ? 'font-semibold' : 'text-lg font-semibold'}>
        {section.title}
      </Heading>
      {section.intro && <p>{section.intro}</p>}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.items && (
        <ul className="list-disc space-y-2 pl-5">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.sections?.map((child) => (
        <PolicySection key={child.title} section={child} nested />
      ))}
    </section>
  );
}

export function ReturnsPolicy({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <section
      id="return-full-rules"
      aria-labelledby="return-full-rules-title"
      className="scroll-mt-48 border-t border-border pt-8"
    >
      <h2 id="return-full-rules-title" className="text-xl font-bold tracking-tight sm:text-2xl">
        {dictionary.policyTitle}
      </h2>
      <div className="mt-4 max-w-4xl space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>{dictionary.policyLead}</p>
        {dictionary.policy.map((section) => (
          <PolicySection key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}

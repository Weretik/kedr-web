import type { PrivacyDictionary, PrivacyInline } from '@site/content/model';

function InlineContent({ content }: { content: readonly PrivacyInline[] }) {
  return content.map((part, index) =>
    part.href ? (
      <a
        key={index}
        href={part.href}
        className="break-words text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {part.text}
      </a>
    ) : (
      part.text
    ),
  );
}

export function PrivacyPolicy({ dictionary }: { dictionary: PrivacyDictionary }) {
  return (
    <article
      data-privacy-document
      aria-label={dictionary.title}
      className="min-w-0 max-w-[75ch] space-y-8"
    >
      {dictionary.sections.map((section, index) => (
        <section
          key={section.id}
          aria-labelledby={section.id}
          className={index === 0 ? undefined : 'border-t border-border pt-8'}
        >
          <h2
            id={section.id}
            data-privacy-heading
            tabIndex={-1}
            className="scroll-mt-48 break-words text-lg font-bold leading-snug tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-xl"
          >
            {section.title}
          </h2>
          <div className="mt-4 space-y-4 break-words text-base leading-relaxed">
            {section.blocks.map((block, blockIndex) =>
              block.kind === 'paragraph' ? (
                <p key={block.sourceKey} data-privacy-source={block.sourceKey}>
                  <InlineContent content={block.content} />
                </p>
              ) : (
                <ul key={blockIndex} className="list-disc space-y-2 pl-6 marker:text-brand">
                  {block.items.map((item) => (
                    <li key={item.sourceKey} data-privacy-source={item.sourceKey}>
                      <InlineContent content={item.content} />
                    </li>
                  ))}
                </ul>
              ),
            )}
          </div>
        </section>
      ))}
    </article>
  );
}

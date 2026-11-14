import { PlusIcon } from 'lucide-react';

import type { ReturnsDictionary } from '@site/content/model';

export function ReturnsFaq({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <section aria-labelledby="returns-faq-title" className="border-t border-border pt-8">
      <h2 id="returns-faq-title" className="text-xl font-bold tracking-tight sm:text-2xl">
        {dictionary.faqTitle}
      </h2>
      <div className="mt-4 divide-y divide-border">
        {dictionary.questions.map((question) => (
          <details key={question.title} name="returns-faq" className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {question.title}
              <PlusIcon
                aria-hidden
                className="size-5 shrink-0 group-open:rotate-45"
                strokeWidth={1.75}
              />
            </summary>
            <p className="max-w-4xl pb-4 text-sm leading-relaxed text-muted-foreground">
              {question.text}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

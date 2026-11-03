import { ReturnsContact } from './returns-contact';

import type { ReturnsDictionary } from '@site/content/model';

export function ReturnsSupport({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
      <section aria-labelledby="returns-important-title">
        <h2 id="returns-important-title" className="text-xl font-bold tracking-tight sm:text-2xl">
          {dictionary.importantTitle}
        </h2>
        <ul className="mt-3 space-y-2">
          {dictionary.notes.map((note) => (
            <li key={note} className="flex items-start gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              {note}
            </li>
          ))}
        </ul>
        <a
          href="#return-full-rules"
          className="mt-4 inline-block text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {dictionary.fullRulesLink}
        </a>
      </section>
      <ReturnsContact dictionary={dictionary} />
    </div>
  );
}

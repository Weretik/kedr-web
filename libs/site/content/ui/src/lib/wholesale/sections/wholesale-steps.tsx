import { ChevronRightIcon } from 'lucide-react';

import type { WholesaleDictionary } from '@site/content/model';

export function WholesaleSteps({ dictionary }: { dictionary: WholesaleDictionary['steps'] }) {
  return (
    <section
      aria-labelledby="wholesale-steps-title"
      className="min-w-0 rounded-xl bg-brand-soft p-5 sm:p-6"
    >
      <h2
        id="wholesale-steps-title"
        className="text-xl leading-tight font-bold tracking-tight sm:text-2xl"
      >
        {dictionary.title}
      </h2>
      <ol className="mt-5 grid gap-5 lg:grid-cols-3 lg:gap-8">
        {dictionary.items.map((step, index) => (
          <li key={step.title} className="relative flex min-w-0 items-start gap-3 lg:pr-5">
            <span
              aria-hidden
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-foreground"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm leading-snug font-bold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed">{step.text}</p>
            </div>
            {index < dictionary.items.length - 1 && (
              <ChevronRightIcon
                aria-hidden
                className="absolute top-1 right-[-1rem] hidden size-5 lg:block"
                strokeWidth={1.75}
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

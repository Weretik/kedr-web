import { ChevronRightIcon } from 'lucide-react';

import type { ReturnsDictionary } from '@site/content/model';

export function ReturnsProcess({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <section
      id="return-process"
      aria-labelledby="return-process-title"
      className="scroll-mt-48 rounded-xl bg-brand/5 p-4 sm:p-6 dark:bg-brand/10"
    >
      <h2 id="return-process-title" className="text-xl font-bold tracking-tight sm:text-2xl">
        {dictionary.processTitle}
      </h2>
      <ol className="mt-5 grid gap-5 md:grid-cols-3 md:gap-8">
        {dictionary.steps.map((step, index) => (
          <li key={step.title} className="relative min-w-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-brand bg-background font-semibold text-brand-text"
              >
                {index + 1}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
            </div>
            <p className="mt-2 pl-10 text-sm leading-relaxed md:pl-0">{step.text}</p>
            {index < dictionary.steps.length - 1 && (
              <ChevronRightIcon
                aria-hidden
                className="absolute top-6 -right-6 hidden size-5 md:block"
                strokeWidth={1.75}
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

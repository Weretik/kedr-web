import { DatabaseIcon, TargetIcon, UserRoundIcon } from 'lucide-react';

import type { PrivacyDictionary } from '@site/content/model';

const summaryIcons = { data: DatabaseIcon, purpose: TargetIcon, rights: UserRoundIcon };

export function PrivacySummary({ dictionary }: { dictionary: PrivacyDictionary }) {
  return (
    <dl
      data-privacy-summary
      className="grid divide-y divide-border rounded-xl bg-brand-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      {dictionary.summary.map((item) => {
        const Icon = summaryIcons[item.id];
        return (
          <div key={item.id} className="min-w-0 px-5 py-4 sm:py-5">
            <dt className="flex items-start gap-3 font-bold">
              <Icon aria-hidden className="size-6 shrink-0 text-brand" strokeWidth={1.75} />
              <span>{item.title}</span>
            </dt>
            <dd className="mt-2 text-sm leading-relaxed sm:pl-9">{item.body}</dd>
          </div>
        );
      })}
    </dl>
  );
}

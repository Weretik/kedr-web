import {
  BoxIcon,
  FileTextIcon,
  LayersIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-react';

import { HomeSection } from '../layout/home-section';

import type { CompanyDictionary } from '../i18n/company-dictionary';

const ICONS = [
  LayersIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  SparklesIcon,
  FileTextIcon,
  BoxIcon,
] as const;

export function HomeAdvantages({ dictionary }: { dictionary: CompanyDictionary }) {
  return (
    <HomeSection id="home-advantages" title={dictionary.advantagesTitle}>
      <p className="-mt-2 mb-6 text-base text-muted-foreground sm:text-lg">
        {dictionary.advantagesLead}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dictionary.advantages.map((item, index) => {
          const Icon = ICONS[index] ?? BoxIcon;
          return (
            <li key={item.title} className="rounded-xl border border-border p-5 sm:p-6">
              <Icon aria-hidden className="mb-4 size-10 text-brand-text" strokeWidth={1.75} />
              <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </HomeSection>
  );
}

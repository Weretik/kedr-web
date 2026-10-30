import { PackageCheckIcon, TruckIcon, WarehouseIcon } from 'lucide-react';

import type { HomeDictionary } from '../i18n/home-dictionary';

const ICONS = [WarehouseIcon, PackageCheckIcon, TruckIcon] as const;

/** Three short facts about stock, wholesale and retail, and delivery. */
export function HomeFacts({ dictionary }: { dictionary: HomeDictionary }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {dictionary.facts.map((fact, index) => {
        const Icon = ICONS[index % ICONS.length] ?? WarehouseIcon;
        return (
          <li key={fact.title} className="flex gap-3 rounded-xl bg-muted p-5">
            <Icon aria-hidden className="size-6 shrink-0 text-brand-text" strokeWidth={1.75} />
            <div>
              <h3 className="font-semibold">{fact.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{fact.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

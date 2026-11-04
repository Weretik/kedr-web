import { MinusIcon, PlusIcon } from 'lucide-react';

import { cn } from './cn';
import styles from './faq-list.module.css';

export type FaqListItem = { question: string; answer: string };

type FaqListProps = {
  items: readonly FaqListItem[];
  /** Shared `name` of the `<details>`: opening one closes the others where browsers support it. */
  group: string;
  /** Open the first answer on load. */
  openFirst?: boolean;
  className?: string;
};

/**
 * Questions as native `<details>`: answers stay in the HTML for search engines and work without JavaScript.
 * The plus turns into a minus; the content slot animates where supported and not under reduced motion.
 */
export function FaqList({ className, group, items, openFirst = false }: FaqListProps) {
  return (
    <div
      className={cn(
        'min-w-0 divide-y divide-border rounded-xl border border-border px-4 sm:px-6',
        className,
      )}
    >
      {items.map((item, index) => (
        <details
          key={item.question}
          name={group}
          open={openFirst && index === 0}
          className={styles.item}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            {item.question}
            <span aria-hidden className="relative size-5 shrink-0">
              <PlusIcon className={styles.plus} size={20} strokeWidth={1.75} />
              <MinusIcon className={styles.minus} size={20} strokeWidth={1.75} />
            </span>
          </summary>
          <div className="min-h-0 overflow-hidden">
            <p className="pb-5 leading-relaxed whitespace-pre-line text-muted-foreground">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

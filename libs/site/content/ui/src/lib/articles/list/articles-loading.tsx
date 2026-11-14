import { getArticlesDictionary } from '@site/content/model';

import type { Locale } from '@site/core/i18n';

export function ArticlesLoading({ locale }: { locale: Locale }) {
  const dictionary = getArticlesDictionary(locale);

  return (
    <div role="status" aria-live="polite" className="space-y-5">
      <p className="text-sm text-muted-foreground">{dictionary.loading}</p>
      <div aria-hidden className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="aspect-video rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

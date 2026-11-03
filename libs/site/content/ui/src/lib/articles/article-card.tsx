import { articlePath, getArticlesDictionary } from '@site/content/model';
import { localizedPath } from '@site/core/i18n';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { ArticleCover } from './article-cover';

import type { Article } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

export function ArticleCard({
  locale,
  article,
  eager = false,
}: {
  locale: Locale;
  article: Article;
  eager?: boolean;
}) {
  const dictionary = getArticlesDictionary(locale);
  const titleId = `article-card-title-${locale}-${article.id}`;

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border">
      <Link
        href={localizedPath(locale, articlePath(article.slug))}
        aria-labelledby={titleId}
        className="group flex h-full flex-col rounded-xl outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset motion-reduce:transition-none"
      >
        <ArticleCover
          image={article.image}
          missingLabel={dictionary.missingCover}
          eager={eager}
          sizes="(min-width: 1536px) 450px, (min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <h2
            id={titleId}
            className="break-words text-lg leading-snug font-semibold tracking-tight group-hover:text-brand-text"
          >
            {article.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-medium text-brand-text underline underline-offset-4">
            {dictionary.readArticle}
            <ArrowRightIcon aria-hidden className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </article>
  );
}

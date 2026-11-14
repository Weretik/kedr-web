import { ARTICLES_PATH, getArticlesDictionary } from '@site/content/model';
import { localizedPath } from '@site/core/i18n';
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { ArticleCover } from './list/article-cover';

import type { Article } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Shop pages an article leads to; the feature owns the catalog and wholesale routes. */
export type ArticleNextStepLinks = { catalog: string; wholesale: string };

export function ArticleContent({
  locale,
  article,
  links,
}: {
  locale: Locale;
  article: Article;
  links: ArticleNextStepLinks;
}) {
  const dictionary = getArticlesDictionary(locale);
  const listPath = localizedPath(locale, ARTICLES_PATH);
  const publicationDate = new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'ru-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(article.publishedAt));
  const linkClass =
    'rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

  return (
    <div className="min-w-0 space-y-7 py-5 sm:py-8 lg:space-y-8 lg:py-10">
      <nav aria-label={dictionary.breadcrumbs} className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={localizedPath(locale, '/')}
              aria-label={dictionary.home}
              className={`inline-flex ${linkClass}`}
            >
              <HomeIcon aria-hidden size={18} strokeWidth={1.75} />
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={listPath} className={`${linkClass} underline underline-offset-4`}>
              {dictionary.title}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="min-w-0 break-words">
            {article.title}
          </li>
        </ol>
      </nav>
      <article className="mx-auto max-w-[70ch] space-y-6">
        <header>
          <h1 className="text-3xl leading-tight font-bold tracking-tight break-words text-balance sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {dictionary.published} <time dateTime={article.publishedAt}>{publicationDate}</time>
          </p>
        </header>
        <div className="overflow-hidden rounded-xl">
          <ArticleCover
            image={article.image}
            missingLabel={dictionary.missingCover}
            eager
            sizes="(min-width: 768px) 70ch, 100vw"
          />
        </div>
        {/* Sanitized by the backend when an admin saves the article, so it is rendered as is. */}
        <div
          className="space-y-5 text-base leading-8 break-words [&_a]:text-brand-text [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:pt-2 [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
        />
        <aside
          aria-labelledby="article-next-step-title"
          className="rounded-xl border border-border bg-card p-5 sm:p-6"
        >
          <h2 id="article-next-step-title" className="text-lg leading-snug font-semibold">
            {dictionary.nextStep.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {dictionary.nextStep.text}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <Link
              href={links.catalog}
              className={`inline-flex items-center gap-2 text-brand-text underline underline-offset-4 ${linkClass}`}
            >
              {dictionary.nextStep.catalog}
              <ArrowRightIcon aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
            <Link
              href={links.wholesale}
              className={`inline-flex items-center gap-2 text-brand-text underline underline-offset-4 ${linkClass}`}
            >
              {dictionary.nextStep.wholesale}
              <ArrowRightIcon aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        </aside>
        <Link
          href={listPath}
          className={`inline-flex items-center gap-2 font-medium text-brand-text underline underline-offset-4 ${linkClass}`}
        >
          <ArrowLeftIcon aria-hidden className="size-4" strokeWidth={1.75} />
          {dictionary.backToList}
        </Link>
      </article>
    </div>
  );
}

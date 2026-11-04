import { cn } from '@site/shared/ui';

/** Typography for admin-written document HTML (paragraphs, lists, h3/h4, quotes, links). */
const DOCUMENT_HTML_CLASS =
  'space-y-4 break-words [&_a]:text-brand-text [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:rounded-xl [&_blockquote]:border [&_blockquote]:border-border [&_blockquote]:bg-muted/60 [&_blockquote]:p-5 [&_blockquote]:text-muted-foreground [&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:font-semibold [&_li]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:marker:text-brand';

/** Renders a part of a published document; the backend sanitizes the HTML when the admin saves it. */
export function DocumentHtml({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  return (
    <div
      data-document-html
      className={cn(DOCUMENT_HTML_CLASS, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

import type {
  LegalDocument,
  LegalDocumentBindings,
  LegalDocumentSection,
  LegalDocumentSource,
} from './legal-document-types';
import type { Locale } from '@site/core/i18n';

const HEADING = /<h2>([\s\S]*?)<\/h2>/g;
const ENTITIES: Readonly<Record<string, string>> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Plain text of a heading: tags dropped, common entities decoded, spaces collapsed. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, ' ')
    .trim();
}

/** Puts the site host and the saved contacts into the body; contacts become links. */
export function fillDocumentPlaceholders(html: string, bindings: LegalDocumentBindings): string {
  const email = escapeHtml(bindings.email);
  const site = escapeHtml(bindings.siteHost);
  const emailLink = `<a href="mailto:${email}">${email}</a>`;
  const phoneLink = `<a href="${escapeHtml(bindings.phoneHref)}">${escapeHtml(bindings.phoneDisplay)}</a>`;
  // Function replacers keep `$` in the values literal.
  return html
    .replace(/\{site\}/g, () => site)
    .replace(/\{email\}/g, () => emailLink)
    .replace(/\{phone\}/g, () => phoneLink);
}

/** Lowers every heading one level (h2 → h3, h3 → h4) for a document shown inside a page section. */
export function demoteHeadings(html: string): string {
  return html.replace(/<(\/?)h([2-5])>/g, (_, slash: string, level: string) => {
    return `<${slash}h${Number(level) + 1}>`;
  });
}

/** Splits a body at its `<h2>` headings; ids are `{prefix}-1`, `{prefix}-2`… in order. */
export function splitDocumentSections(
  html: string,
  idPrefix: string,
): { readonly leadHtml: string; readonly sections: readonly LegalDocumentSection[] } {
  const headings = [...html.matchAll(HEADING)];
  if (headings.length === 0) return { leadHtml: html.trim(), sections: [] };

  const sections = headings.map((match, index) => {
    const start = match.index + match[0].length;
    const end = headings[index + 1]?.index ?? html.length;
    return {
      id: `${idPrefix}-${index + 1}`,
      title: htmlToText(match[1]),
      html: html.slice(start, end).trim(),
    };
  });
  return { leadHtml: html.slice(0, headings[0].index).trim(), sections };
}

/** API edition → rendered document: placeholders filled, body split into sections. */
export function buildLegalDocument(
  source: LegalDocumentSource,
  locale: Locale,
  bindings: LegalDocumentBindings,
  idPrefix: string,
): LegalDocument {
  const { leadHtml, sections } = splitDocumentSections(
    fillDocumentPlaceholders(source.bodyHtml, bindings),
    idPrefix,
  );
  return {
    locale,
    kind: source.kind,
    number: source.number,
    effectiveFrom: source.effectiveFrom,
    title: source.title,
    leadHtml,
    sections,
  };
}

/** «Редакція від 3 листопада 2026 р.» date part for the page header. */
export function formatEffectiveDate(effectiveFrom: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'ru-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${effectiveFrom}T00:00:00Z`));
}

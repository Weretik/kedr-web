import type { MetadataRoute } from 'next';

export const PRODUCT_SITEMAP_MAX_URLS = 20_000;
/** Conservative margin below the sitemap 50 MB uncompressed XML ceiling. */
export const PRODUCT_SITEMAP_XML_BUDGET = 40 * 1024 * 1024;

const XML_ENVELOPE =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
  'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n</urlset>\n';
const bytes = (value: string) => new TextEncoder().encode(value).byteLength;
const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => XML_ESCAPES[character] ?? character);
function entryXmlBytes(entry: MetadataRoute.Sitemap[number]): number {
  // This helper sizes product entries only. Additional sitemap fields must first gain explicit sizing.
  if (
    entry.lastModified !== undefined ||
    entry.changeFrequency !== undefined ||
    entry.priority !== undefined ||
    entry.images !== undefined ||
    entry.videos !== undefined
  ) {
    throw new TypeError('Unsupported field in a product sitemap entry');
  }
  let xml = '<url>\n<loc>' + escapeXml(entry.url) + '</loc>\n';
  for (const [language, url] of Object.entries(entry.alternates?.languages ?? {})) {
    if (typeof url !== 'string')
      throw new TypeError('A product alternate must be an absolute URL string');
    xml +=
      '<xhtml:link rel="alternate" hreflang="' +
      escapeXml(language) +
      '" href="' +
      escapeXml(url) +
      '" />\n';
  }
  return bytes(xml + '</url>\n');
}

/** Conservative UTF-8 size, including an XHTML envelope and escaped values. */
export function estimateProductSitemapXmlBytes(entries: MetadataRoute.Sitemap): number {
  return bytes(XML_ENVELOPE) + entries.reduce((total, entry) => total + entryXmlBytes(entry), 0);
}

export function shardProductSitemapEntries(
  entries: MetadataRoute.Sitemap,
  options: { maxUrls?: number; maxXmlBytes?: number } = {},
): MetadataRoute.Sitemap[] {
  const maxUrls = options.maxUrls ?? PRODUCT_SITEMAP_MAX_URLS;
  const maxXmlBytes = options.maxXmlBytes ?? PRODUCT_SITEMAP_XML_BUDGET;
  const envelopeBytes = bytes(XML_ENVELOPE);
  if (
    !Number.isSafeInteger(maxUrls) ||
    maxUrls < 1 ||
    maxUrls > PRODUCT_SITEMAP_MAX_URLS ||
    !Number.isSafeInteger(maxXmlBytes) ||
    maxXmlBytes <= envelopeBytes ||
    maxXmlBytes > PRODUCT_SITEMAP_XML_BUDGET
  ) {
    throw new RangeError('Invalid product sitemap shard budget');
  }

  const shards: MetadataRoute.Sitemap[] = [];
  let current: MetadataRoute.Sitemap = [];
  let currentBytes = envelopeBytes;
  for (const entry of entries) {
    const size = entryXmlBytes(entry);
    if (envelopeBytes + size >= maxXmlBytes) {
      throw new RangeError('One product sitemap entry exceeds the XML budget');
    }
    if (current.length === maxUrls || currentBytes + size >= maxXmlBytes) {
      shards.push(current);
      current = [];
      currentBytes = envelopeBytes;
    }
    current.push(entry);
    currentBytes += size;
  }
  if (current.length) shards.push(current);
  return shards;
}

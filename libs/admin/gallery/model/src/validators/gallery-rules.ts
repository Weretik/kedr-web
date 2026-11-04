import { galleryCaptionMaxLength, galleryTitleMaxLength } from '../entities/gallery-item';

import type { GalleryTexts } from '../entities/gallery-item';

const idPattern = /^[A-Za-z0-9_-]{11}$/;
const youtubeHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

/**
 * The 11-character video ID from a pasted link (watch, youtu.be, shorts, embed, live) or the bare ID;
 * null for anything else. Mirrors the backend so the dialog can answer before any request.
 */
export function parseYoutubeId(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  if (idPattern.test(text)) return text;
  let url: URL;
  try {
    url = new URL(text.includes('://') ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);
  let candidate: string | null | undefined = null;
  if (host === 'youtu.be') candidate = segments[0];
  else if (youtubeHosts.has(host)) {
    if (segments.length === 1 && segments[0] === 'watch') candidate = url.searchParams.get('v');
    else if (segments.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(segments[0]))
      candidate = segments[1];
  }
  return candidate && idPattern.test(candidate) ? candidate : null;
}

/** Field → message for texts over the limits; empty when the texts can be saved. */
export function galleryTextsIssues(
  texts: GalleryTexts,
): Partial<Record<keyof GalleryTexts, string>> {
  const issues: Partial<Record<keyof GalleryTexts, string>> = {};
  for (const field of ['titleUk', 'titleRu'] as const)
    if (texts[field].trim().length > galleryTitleMaxLength)
      issues[field] = `Не більше ${galleryTitleMaxLength} символів.`;
  for (const field of ['captionUk', 'captionRu'] as const)
    if (texts[field].trim().length > galleryCaptionMaxLength)
      issues[field] = `Не більше ${galleryCaptionMaxLength} символів.`;
  return issues;
}

/** The IDs after moving one card to another place, for the order request. */
export function moveGalleryItem(ids: readonly number[], id: number, to: number): number[] {
  const from = ids.indexOf(id);
  const target = Math.max(0, Math.min(ids.length - 1, to));
  if (from < 0 || from === target) return [...ids];
  const next = ids.filter((value) => value !== id);
  next.splice(target, 0, id);
  return next;
}

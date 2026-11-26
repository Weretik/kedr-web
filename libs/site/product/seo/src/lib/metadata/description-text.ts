/** Google shows about 160 characters of a description. */
const DESCRIPTION_MAX_LENGTH = 160;

/**
 * A meta description from a model text: its first paragraph, cut at a word with «…» when it is too long. The
 * text is plain (the page shows it with its line breaks), so no markup is removed.
 */
export function descriptionFromText(text: string, max = DESCRIPTION_MAX_LENGTH): string {
  const paragraph =
    text
      .split(/\n/)
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .find(Boolean) ?? '';
  if (paragraph.length <= max) return paragraph;
  const cut = paragraph.slice(0, max - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(' ')).trimEnd();
  return `${atWord || cut}…`;
}

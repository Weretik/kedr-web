/** Cover limits of the Content backend: JPEG, PNG, or WebP up to 10 MB and at least 600 px wide. */
export const articleCoverAcceptedTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const articleCoverMaxBytes = 10 * 1024 * 1024;
export const articleCoverRulesHint = 'JPEG, PNG або WebP до 10 МБ, ширина від 600 px.';

/** A message when the file cannot be a cover, or `undefined`; the server also checks the width. */
export function articleCoverFileError(file: { type: string; size: number }): string | undefined {
  if (!(articleCoverAcceptedTypes as readonly string[]).includes(file.type))
    return 'Оберіть зображення JPEG, PNG або WebP.';
  if (file.size > articleCoverMaxBytes) return 'Файл більший за 10 МБ.';
  return undefined;
}

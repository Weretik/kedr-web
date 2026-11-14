export const ARTICLES_PATH = '/articles';

export function articlePath(slug: string): string {
  return '/articles/' + encodeURIComponent(slug);
}

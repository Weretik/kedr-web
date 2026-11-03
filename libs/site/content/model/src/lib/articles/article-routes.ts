export const ARTICLES_PATH = '/articles';
export const ARTICLE_SLUGS: Readonly<Record<number, string>> = {
  1: 'zamina-dvernoi-furnitury',
  2: 'postachannia-dlia-vyrobnykiv-dverei',
  3: 'zamak-chy-aliuminii',
  4: 'prykhovani-petli',
  5: 'vrizna-bronenakladka',
  6: 'zvukoizoliatsiia-dverei',
};

export function articlePath(slug: string): string {
  return '/articles/' + encodeURIComponent(slug);
}

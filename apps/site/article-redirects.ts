/**
 * Deployment redirect map for the six migrated Angular article IDs.
 * Keep destinations in sync with ARTICLE_SLUGS; list and sitemap use only slugs.
 */
const LEGACY_ARTICLE_SLUGS: Readonly<Record<string, string>> = {
  '1': 'zamina-dvernoi-furnitury',
  '2': 'postachannia-dlia-vyrobnykiv-dverei',
  '3': 'zamak-chy-aliuminii',
  '4': 'prykhovani-petli',
  '5': 'vrizna-bronenakladka',
  '6': 'zvukoizoliatsiia-dverei',
};

export const articleRedirects = Object.entries(LEGACY_ARTICLE_SLUGS).map(([id, slug]) => ({
  source: '/:locale(uk|ru)/articles/' + id,
  destination: '/:locale/articles/' + slug,
  statusCode: 301 as const,
}));

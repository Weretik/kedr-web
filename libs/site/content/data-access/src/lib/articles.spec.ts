import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getArticle, getArticles } from './articles';

vi.mock('server-only', () => ({}));

// Golden digests were computed from the existing storefront titles and every full paragraph.
const LEGACY_CONTENT_HASHES = {
  uk: [
    '6dc3458c70628e878e1ad4fa4ca436fb091dee7629fe7f136479658775925a44',
    'cb04e32e656b8f4934ab8f90dfdc8f0fd9941b77ccbd78ee9853a352b70a005d',
    '9e06d69e07e71067a3c2c731bef561f5005408256d3def3a0c24690b73fdd115',
    '7cca5e9a39b3fc0993a38026181d807994dec24573221d774a665e5da9325646',
    '02439f0c40bd3874f558666be1a477c664f0a86f1220b948e48ab88a8a055b4f',
    'b3900f04d3982f337a718ad9cd330379f0e44831870636857782742e349025d2',
  ],
  ru: [
    'cfa8eb08b03d2ac5d764bf27d1b51478dfaab874c694b9db69239e6d6bdbf27b',
    'e145a95732a5ff5222fd136cb2487ec39f9cd08d5941a6f3dffcbd39d00f796f',
    '8bdeffb1c54acecaba5351ca8dc3b8944ed54b67222715fe033f24df3146fa3a',
    '6b09b5aa59c26e653ef2630210fc72110b3d661729ac6f41756c0504836877ac',
    '1b7d9ec882807de02c385f126facb26dd99ab1272d1891bfba6be44c5400deb7',
    '36f993e00bddb5b59641f82eafe0eccf2ab4b10f8e6032c20e69ca7b2a5a3088',
  ],
} as const;
const SLUGS = [
  'zamina-dvernoi-furnitury',
  'postachannia-dlia-vyrobnykiv-dverei',
  'zamak-chy-aliuminii',
  'prykhovani-petli',
  'vrizna-bronenakladka',
  'zvukoizoliatsiia-dverei',
];
const repositoryRoot = resolve(import.meta.dirname, '../../../../../..');

describe('temporary server-only article source', () => {
  it.each(['uk', 'ru'] as const)(
    'returns exactly six ordered immutable %s articles with stable slugs',
    (locale) => {
      const articles = getArticles(locale);

      expect(articles).toHaveLength(6);
      expect(articles.map((article) => article.id)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(articles.map((article) => article.slug)).toEqual(SLUGS);
      expect(Object.isFrozen(articles)).toBe(true);
      for (const article of articles) {
        expect(Object.isFrozen(article)).toBe(true);
        expect(Object.isFrozen(article.paragraphs)).toBe(true);
        expect(article.publishedAt).toBe('2026-03-24');
        expect(article.image).toBe('/images/articles/Article_' + article.id + '.jpg');
        expect(article.excerpt.length).toBeGreaterThan(0);
        expect(article.paragraphs[0].startsWith(article.excerpt)).toBe(true);
      }
    },
  );

  it.each(['uk', 'ru'] as const)(
    'preserves every complete %s title and paragraph from the legacy source',
    (locale) => {
      const hashes = getArticles(locale).map(({ title, paragraphs }) =>
        createHash('sha256').update(JSON.stringify({ title, paragraphs })).digest('hex'),
      );

      expect(hashes).toEqual(LEGACY_CONTENT_HASHES[locale]);
    },
  );

  it.each(['uk', 'ru'] as const)(
    'looks up full %s articles by slug and rejects unknown slugs and old IDs',
    (locale) => {
      for (const article of getArticles(locale)) {
        expect(getArticle(locale, article.slug)).toBe(article);
      }
      expect(getArticle(locale, 'unknown-article')).toBeUndefined();
      expect(getArticle(locale, '1')).toBeUndefined();
      expect(getArticle(locale, '')).toBeUndefined();
    },
  );

  it('retains byte-identical cover files from the storefront', () => {
    for (let id = 1; id <= 6; id += 1) {
      const filename = 'Article_' + id + '.jpg';
      const legacy = readFileSync(
        resolve(repositoryRoot, 'apps/storefront/public/assets/images/articles', filename),
      );
      const migrated = readFileSync(
        resolve(repositoryRoot, 'apps/site/public/images/articles', filename),
      );
      expect(createHash('sha256').update(migrated).digest('hex')).toBe(
        createHash('sha256').update(legacy).digest('hex'),
      );
    }
  });
});

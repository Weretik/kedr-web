import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Source-level audit evidence; this file is outside production Nx libraries.
const root = new URL('../../../../../../', import.meta.url);
const publicModel = readFileSync(new URL('libs/site/content/model/src/index.ts', root), 'utf8');
const exportsFrom = (path) =>
  [...publicModel.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)]
    .filter((entry) => entry[2] === path)
    .flatMap((entry) => entry[1].split(',').map((name) => name.trim()));
for (const name of ['ARTICLE_SLUGS', 'ARTICLES_PATH', 'articlePath']) {
  assert.ok(
    exportsFrom('./lib/articles/article-routes').includes(name),
    'Public route API: ' + name,
  );
}
assert.ok(
  exportsFrom('./lib/articles/article-page-window').includes('articlePageNumbers'),
  'Public page window API',
);
const project = (path) => JSON.parse(readFileSync(new URL(path + '/project.json', root), 'utf8'));
const { validateProjectBoundary } = await import(
  new URL('tools/architecture/project-boundary-rules.mjs', root)
);
const model = project('libs/site/content/model');
const data = project('libs/site/content/data-access');
const ui = project('libs/site/content/ui');
const seo = project('libs/site/content/seo');
const feature = project('libs/site/content/feature');
const core = ['config', 'i18n', 'seo'].map((name) => project('libs/site/core/' + name));
const allowed = [
  [feature, model],
  [feature, data],
  [feature, ui],
  [feature, seo],
  [ui, model],
  [data, model],
  ...core.map((target) => [seo, target]),
];
const forbidden = [
  [model, feature],
  [data, feature],
  [ui, feature],
  [seo, model],
  [seo, data],
];
for (const [from, to] of allowed) {
  assert.equal(validateProjectBoundary(from, to), null, from.name + ' -> ' + to.name);
}
for (const [from, to] of forbidden) {
  assert.notEqual(validateProjectBoundary(from, to), null, from.name + ' -> ' + to.name);
}

const { articleRedirects } = await import(new URL('apps/site/article-redirects.ts', root));
const { ARTICLE_SLUGS } = await import(
  new URL('libs/site/content/model/src/lib/articles/article-routes.ts', root)
);
assert.equal(articleRedirects.length, 6);
assert.equal(new Set(articleRedirects.map(({ source }) => source)).size, 6);
for (const [id, slug] of Object.entries(ARTICLE_SLUGS)) {
  const redirect = articleRedirects.find(
    ({ source }) => source === '/:locale(uk|ru)/articles/' + id,
  );
  assert.ok(redirect, 'Missing legacy ID ' + id);
  assert.equal(redirect.destination, '/:locale/articles/' + slug);
  assert.equal(redirect.statusCode, 301);
}
const config = readFileSync(new URL('apps/site/next.config.ts', root), 'utf8');
assert.match(config, /import\s*\{\s*articleRedirects\s*\}\s*from\s*['"]\.\/article-redirects['"]/);
assert.match(config, /redirects\s*\(\s*\)\s*\{[\s\S]*return\s*\[[\s\S]*\.\.\.articleRedirects/);
console.log(
  'Verified 9 allowed and 5 forbidden edges; six locale-preserving 301 mappings and config wiring.',
);

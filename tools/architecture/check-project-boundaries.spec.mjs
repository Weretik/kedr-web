import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { requiredTagErrors, validateProjectBoundary } from './project-boundary-rules.mjs';

const project = (name, ...tags) => ({ name, tags });

const siteProject = (path) =>
  JSON.parse(
    readFileSync(new URL(`../../libs/site/${path}/project.json`, import.meta.url), 'utf8'),
  );
const contentSeo = siteProject('content/seo');

for (const path of ['core/config', 'core/i18n', 'core/seo']) {
  const target = siteProject(path);
  test(`allows content SEO to depend on ${target.name}`, () => {
    assert.equal(validateProjectBoundary(contentSeo, target), null);
  });
}

for (const path of ['content/feature', 'content/ui', 'content/model', 'core/shell']) {
  const target = siteProject(path);
  test(`rejects content SEO depending on ${target.name}`, () => {
    assert.ok(
      validateProjectBoundary(contentSeo, target),
      `${contentSeo.name} -> ${target.name} must be rejected`,
    );
  });
}

test('accepts documented downward dependencies', () => {
  assert.equal(
    validateProjectBoundary(
      project('catalog-feature', 'scope:mobile', 'domain:catalog', 'type:feature'),
      project('catalog-data', 'scope:mobile', 'domain:catalog', 'type:data-access'),
    ),
    null,
  );
  assert.equal(
    validateProjectBoundary(
      project('mobile-catalog-feature', 'scope:mobile', 'domain:catalog', 'type:feature'),
      project('mobile-cart-model', 'scope:mobile', 'domain:cart', 'type:model'),
    ),
    null,
  );
  assert.equal(
    validateProjectBoundary(
      project('admin-orders-feature', 'scope:admin', 'domain:orders', 'type:feature'),
      project('admin-products-data-access', 'scope:admin', 'domain:products', 'type:data-access'),
    ),
    null,
  );
});

test('rejects core to domain', () => {
  assert.match(
    validateProjectBoundary(
      project('shell', 'scope:mobile', 'domain:core', 'type:core'),
      project('orders-model', 'scope:mobile', 'domain:orders', 'type:model'),
    ),
    /cannot depend on domain/,
  );
});

test('rejects cross-domain models', () => {
  assert.match(
    validateProjectBoundary(
      project('cart-model', 'scope:mobile', 'domain:cart', 'type:model'),
      project('orders-model', 'scope:mobile', 'domain:orders', 'type:model'),
    ),
    /cannot depend/,
  );
});

test('rejects feature to feature', () => {
  assert.match(
    validateProjectBoundary(
      project('catalog-feature', 'scope:mobile', 'domain:catalog', 'type:feature'),
      project('cart-feature', 'scope:mobile', 'domain:cart', 'type:feature'),
    ),
    /cannot depend on feature/,
  );
});

test('requires scope and type tags', () => {
  assert.deepEqual(requiredTagErrors(project('untagged')), [
    'missing scope:* tag',
    'missing type:* tag',
  ]);
});

// Wholesale composition may consume only documented catalog public layers.
const wholesaleContentFeature = siteProject('content/feature');
for (const targetPath of ['catalog/data-access', 'catalog/model', 'catalog/ui']) {
  const target = siteProject(targetPath);
  test(`allows wholesale content feature to depend on ${target.name}`, () => {
    assert.equal(validateProjectBoundary(wholesaleContentFeature, target), null);
  });
}
for (const sourcePath of ['content/ui', 'content/model']) {
  for (const targetPath of ['catalog/data-access', 'catalog/model', 'catalog/ui']) {
    const source = siteProject(sourcePath);
    const target = siteProject(targetPath);
    test(`rejects wholesale non-feature dependency ${source.name} -> ${target.name}`, () => {
      assert.ok(validateProjectBoundary(source, target));
    });
  }
}
test('rejects wholesale content feature importing catalog feature', () => {
  assert.ok(validateProjectBoundary(wholesaleContentFeature, siteProject('catalog/feature')));
});

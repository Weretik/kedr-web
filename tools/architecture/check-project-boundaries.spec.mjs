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

// The product page consumes only the shared catalog root/path policy.
test('product detail boundary allows the documented model policy flow', () => {
  assert.equal(
    validateProjectBoundary(siteProject('product/feature'), siteProject('catalog/model')),
    null,
  );
});
for (const sourcePath of ['product/ui', 'product/model', 'product/data-access']) {
  test(`product detail boundary rejects ${sourcePath} importing catalog model`, () => {
    assert.ok(validateProjectBoundary(siteProject(sourcePath), siteProject('catalog/model')));
  });
}
test('product detail boundary rejects product feature importing catalog feature', () => {
  assert.ok(
    validateProjectBoundary(siteProject('product/feature'), siteProject('catalog/feature')),
  );
});

// Cart navigation consumes one product path policy; presentation and features stay isolated.
test('cart feature may map product destinations through the public product model', () => {
  assert.equal(
    validateProjectBoundary(siteProject('cart/feature'), siteProject('product/model')),
    null,
  );
});
test('cart presentation may not own product model policy', () => {
  assert.ok(validateProjectBoundary(siteProject('cart/ui'), siteProject('product/model')));
});
test('cart cannot import another domain feature', () => {
  assert.ok(validateProjectBoundary(siteProject('cart/feature'), siteProject('product/feature')));
});

// The Site core shell receives domain nodes through slots, never imports them.
for (const layer of ['model', 'data-access', 'ui', 'seo', 'feature']) {
  test(`Site core shell rejects cart/${layer}`, () => {
    assert.ok(validateProjectBoundary(siteProject('core/shell'), siteProject(`cart/${layer}`)));
  });
}
for (const targetPath of ['core/config', 'core/i18n', 'shared/ui']) {
  test(`Site core shell retains its neutral dependency ${targetPath}`, () => {
    assert.equal(validateProjectBoundary(siteProject('core/shell'), siteProject(targetPath)), null);
  });
}

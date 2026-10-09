import assert from 'node:assert/strict';
import test from 'node:test';

import { requiredTagErrors, validateProjectBoundary } from './project-boundary-rules.mjs';

const project = (name, ...tags) => ({ name, tags });

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

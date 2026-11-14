import assert from 'node:assert/strict';
import test from 'node:test';

import { compareWithBaseline, findStructureViolations } from './structure-rules.mjs';

const lines = (count) => Array.from({ length: count }, (_, index) => `// ${index}`).join('\n');

/** Runs the rules over an in-memory tree: path -> file text. */
const check = (tree) =>
  findStructureViolations({ files: Object.keys(tree), read: (path) => tree[path] });

const lib = 'libs/admin/orders';

test('accepts a library laid out by role folders with tests', () => {
  assert.deepEqual(
    check({
      [`${lib}/model/project.json`]: '{}',
      [`${lib}/model/src/index.ts`]: '',
      [`${lib}/model/src/entities/order.ts`]: '',
      [`${lib}/model/src/mappers/order-total.ts`]: '',
      [`${lib}/model/src/mappers/order-total.spec.ts`]: '',
    }),
    [],
  );
});

test('rejects catch-all folder and file names', () => {
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/common/thumb.tsx`]: '',
      [`${lib}/ui/src/components/order.types.ts`]: '',
      [`${lib}/ui/src/components/order.spec.tsx`]: '',
    }),
    [
      `forbidden-name: ${lib}/ui/src/common`,
      `forbidden-name: ${lib}/ui/src/components/order.types.ts`,
      `role-folder: ${lib}/ui/src/common`,
    ],
  );
});

test('rejects a shared folder inside a domain library but not the shared scope', () => {
  assert.deepEqual(
    check({
      'libs/site/cart/ui/project.json': '{}',
      'libs/site/cart/ui/src/lib/shared/cart-format.ts': '',
      'libs/site/cart/ui/src/lib/shared/cart-format.spec.ts': '',
      'libs/admin/shared/ui/project.json': '{}',
      'libs/admin/shared/ui/src/lib/inputs/slug-field.tsx': '',
      'libs/admin/shared/ui/src/lib/inputs/slug-field.spec.tsx': '',
    }),
    ['forbidden-name: libs/site/cart/ui/src/lib/shared'],
  );
});

test('flags a folder with more than six production files', () => {
  const tree = { [`${lib}/feature/project.json`]: '{}' };
  for (let index = 0; index < 7; index += 1) tree[`${lib}/feature/src/hooks/use-${index}.ts`] = '';
  for (let index = 0; index < 6; index += 1)
    tree[`${lib}/feature/src/pages/page-${index}.tsx`] = '';
  tree[`${lib}/feature/src/hooks/use-0.spec.ts`] = '';
  tree[`${lib}/feature/src/hooks/index.ts`] = '';
  assert.deepEqual(check(tree), [`crowded-folder: ${lib}/feature/src/hooks`]);
});

test('does not count generated code in a crowded folder', () => {
  const tree = { [`${lib}/data-access/project.json`]: '{}' };
  for (let index = 0; index < 9; index += 1) {
    tree[`${lib}/data-access/src/api/generated/operation-${index}.ts`] = '';
  }
  tree[`${lib}/data-access/src/api/orders.api.spec.ts`] = '';
  tree[`${lib}/data-access/src/api/orders.api.ts`] = '';
  assert.deepEqual(check(tree), []);
});

test('flags a wrapper folder that holds only one subfolder', () => {
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/components/order-tree/order-tree.tsx`]: '',
      [`${lib}/ui/src/components/order-tree/order-tree.spec.tsx`]: '',
      [`${lib}/ui/src/forms/order-form.tsx`]: '',
    }),
    [`wrapper-folder: ${lib}/ui/src/components`],
  );
});

test('flags a folder that mixes files and subfolders', () => {
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/tables/orders-table.tsx`]: '',
      [`${lib}/ui/src/tables/orders-table.spec.tsx`]: '',
      [`${lib}/ui/src/tables/cells/status-cell.tsx`]: '',
      [`${lib}/ui/src/tables/cells/total-cell.tsx`]: '',
      [`${lib}/ui/src/forms/order-form.tsx`]: '',
    }),
    [`mixed-folder: ${lib}/ui/src/tables`],
  );
});

test('allows entry files next to folders at a library root and in file-based routers', () => {
  assert.deepEqual(
    check({
      [`${lib}/feature/project.json`]: '{}',
      [`${lib}/feature/src/index.ts`]: '',
      [`${lib}/feature/src/orders.routes.tsx`]: '',
      [`${lib}/feature/src/testing.ts`]: '',
      [`${lib}/feature/src/pages/orders-page.tsx`]: '',
      [`${lib}/feature/src/pages/orders-page.spec.tsx`]: '',
      [`${lib}/feature/src/hooks/use-orders.ts`]: '',
      'libs/site/catalog/data-access/project.json': '{}',
      'libs/site/catalog/data-access/src/lib/cache-tags.ts': '',
      'libs/site/catalog/data-access/src/lib/loaders/catalog-loader.ts': '',
      'libs/site/catalog/data-access/src/lib/loaders/catalog-loader.spec.ts': '',
      'libs/site/catalog/data-access/src/lib/mappers/catalog.mapper.ts': '',
      'apps/site/src/app/[locale]/page.tsx': '',
      'apps/site/src/app/[locale]/catalog/page.tsx': '',
      'apps/mobile/src/app/(work)/_layout.tsx': '',
      'apps/mobile/src/app/(work)/orders/index.tsx': '',
      'apps/admin/src/app/app.tsx': '',
      'apps/admin/src/app/router/routes.tsx': '',
    }),
    [],
  );
});

test('requires role folders in admin and mobile domain libraries only', () => {
  assert.deepEqual(
    check({
      'libs/mobile/catalog/model/project.json': '{}',
      'libs/mobile/catalog/model/src/search/search.ts': '',
      'libs/mobile/catalog/model/src/search/search.spec.ts': '',
      'libs/mobile/core/shell/project.json': '{}',
      'libs/mobile/core/shell/src/providers/app-providers.tsx': '',
      'libs/mobile/core/shell/src/providers/app-providers.spec.tsx': '',
    }),
    ['role-folder: libs/mobile/catalog/model/src/search'],
  );
});

test('allows mobile data-access local, store, and sync roles', () => {
  assert.deepEqual(
    check({
      'libs/mobile/sync/data-access/project.json': '{}',
      'libs/mobile/sync/data-access/src/local/rows.ts': '',
      'libs/mobile/sync/data-access/src/store/sync-store.ts': '',
      'libs/mobile/sync/data-access/src/sync/runner.ts': '',
      'libs/mobile/sync/data-access/src/sync/runner.spec.ts': '',
    }),
    [],
  );
});

test('flags loose files next to folders in src/lib of a site library', () => {
  assert.deepEqual(
    check({
      'libs/site/content/seo/project.json': '{}',
      'libs/site/content/seo/src/lib/metadata/contacts-metadata.ts': '',
      'libs/site/content/seo/src/lib/metadata/contacts-metadata.spec.ts': '',
      'libs/site/content/seo/src/lib/contacts-json-ld.ts': '',
    }),
    ['mixed-folder: libs/site/content/seo/src/lib'],
  );
});

test('keeps a small one-page site library flat', () => {
  assert.deepEqual(
    check({
      'libs/site/home/seo/project.json': '{}',
      'libs/site/home/seo/src/lib/home-metadata.ts': '',
      'libs/site/home/seo/src/lib/home-metadata.spec.ts': '',
    }),
    [],
  );
});

test('flags long components and hooks, without counting a style sheet', () => {
  const styled = `${lines(140)}\nconst stylesSheet = createStyles(() => ({\n${lines(80)}\n}));`;
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/components/long.tsx`]: lines(151),
      [`${lib}/ui/src/components/styled.tsx`]: styled,
      [`${lib}/ui/src/components/long.spec.tsx`]: lines(400),
      [`${lib}/ui/src/hooks/use-long.ts`]: lines(201),
      [`${lib}/ui/src/hooks/use-short.ts`]: lines(200),
    }),
    [`long-file: ${lib}/ui/src/components/long.tsx`, `long-file: ${lib}/ui/src/hooks/use-long.ts`],
  );
});

test('does not count static copy, generated code, or test helpers as long files', () => {
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/testing/fixtures.spec.ts`]: '',
      'libs/site/cart/ui/project.json': '{}',
      'libs/site/cart/ui/src/lib/i18n/cart-dictionary.ts': lines(400),
      'libs/site/cart/ui/src/lib/i18n/cart-dictionary.spec.ts': '',
      [`${lib}/ui/src/testing/fixtures.ts`]: lines(400),
    }),
    [],
  );
});

test('flags a component with more than three useState or more than one useEffect', () => {
  const state = 'const [a, setA] = useState(0);\n'.repeat(4);
  const effects = 'useEffect(() => {}, []);\n'.repeat(2);
  assert.deepEqual(
    check({
      [`${lib}/feature/project.json`]: '{}',
      [`${lib}/feature/src/pages/state-page.tsx`]: state,
      [`${lib}/feature/src/pages/effect-page.tsx`]: effects,
      [`${lib}/feature/src/pages/effect-page.spec.tsx`]: effects + effects,
    }),
    [
      `component-state: ${lib}/feature/src/pages/effect-page.tsx`,
      `component-state: ${lib}/feature/src/pages/state-page.tsx`,
    ],
  );
});

test('flags a library with production code and no test', () => {
  assert.deepEqual(
    check({
      'libs/admin/users/data-access/project.json': '{}',
      'libs/admin/users/data-access/src/index.ts': '',
      'libs/admin/users/data-access/src/api/users.api.ts': '',
    }),
    ['missing-tests: libs/admin/users/data-access'],
  );
});

test('allows only composition folders in the Admin application folder', () => {
  assert.deepEqual(
    check({
      'apps/admin/src/app/app.tsx': '',
      'apps/admin/src/app/store.ts': '',
      'apps/admin/src/app/router/app-router.tsx': '',
      'apps/admin/src/app/slots/customer-picker.tsx': '',
      'apps/admin/src/app/customer-picker.tsx': '',
      'apps/admin/src/app/pickers/picker.tsx': '',
    }),
    [
      'app-folder: apps/admin/src/app/customer-picker.tsx',
      'app-folder: apps/admin/src/app/pickers',
    ],
  );
});

test('ignores the frozen Angular storefront', () => {
  assert.deepEqual(
    check({
      'libs/storefront/util/project.json': '{}',
      'libs/storefront/util/src/lib/utils/format.ts': lines(500),
      'libs/shared/util/project.json': '{}',
      'libs/shared/util/src/lib/helpers.ts': '',
      'apps/storefront/src/app/types.ts': '',
    }),
    [],
  );
});

test('compares violations with the baseline both ways', () => {
  assert.deepEqual(compareWithBaseline(['a', 'b'], ['b', 'c']), { added: ['a'], fixed: ['c'] });
});

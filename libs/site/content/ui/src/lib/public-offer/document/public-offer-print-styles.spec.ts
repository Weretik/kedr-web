import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import postcss from 'postcss';

const require = createRequire(resolve(process.cwd(), 'public-offer-css-test.cjs'));
const local = require('next/dist/compiled/postcss-modules-local-by-default');
const scope = require('next/dist/compiled/postcss-modules-scope');

const projectPath = resolve(process.cwd(), 'src/lib/public-offer/document/public-offer-print.module.css');
const cssPath = existsSync(projectPath)
  ? projectPath
  : resolve(
      process.cwd(),
      'libs/site/content/ui/src/lib/public-offer/document/public-offer-print.module.css',
    );

let pageClass = '';
const selectors: string[] = [];
const hidingSelectors: string[] = [];

beforeAll(async () => {
  const result = await postcss([local({ mode: 'pure' }), scope()]).process(
    readFileSync(cssPath, 'utf8'),
    { from: cssPath },
  );
  result.root.walkRules((rule) => {
    if (rule.selector === ':export') {
      rule.walkDecls('page', (declaration) => {
        pageClass = declaration.value;
      });
    } else {
      selectors.push(...postcss.list.comma(rule.selector));
      if (
        rule.nodes.some(
          (node) => node.type === 'decl' && node.prop === 'display' && node.value === 'none',
        )
      ) {
        hidingSelectors.push(...postcss.list.comma(rule.selector));
      }
    }
  });
  expect(pageClass).not.toBe('');
});

afterEach(() => {
  document.body.innerHTML = '';
});

function fixture() {
  document.body.innerHTML =
    '<header id="shop-header"></header><main><div id="other-page">Current page</div><div id="cached-boundary"><div data-public-offer><header id="offer-header"></header><article data-offer-document id="legal-document">Complete legal text</article></div></div></main><footer id="shop-footer"></footer>';
  const page = document.querySelector<HTMLElement>('[data-public-offer]')!;
  page.className = pageClass;
  return { page, boundary: document.getElementById('cached-boundary')! };
}

function matches(rules: readonly string[]) {
  return new Set(rules.flatMap((selector) => [...document.querySelectorAll(selector)]));
}

it('prints the active offer while hiding the shop frame and keeping its own title/document', () => {
  fixture();
  const targeted = matches(selectors);
  const hidden = matches(hidingSelectors);
  expect(targeted.has(document.getElementById('legal-document')!)).toBe(true);
  expect(hidden.has(document.getElementById('shop-header')!)).toBe(true);
  expect(hidden.has(document.getElementById('shop-footer')!)).toBe(true);
  expect(hidden.has(document.getElementById('offer-header')!)).toBe(false);
  expect(hidden.has(document.getElementById('legal-document')!)).toBe(false);
});

it.each(['activity-host', 'activity-ancestor', 'hidden-ancestor'] as const)(
  'leaves another route untouched when the cached offer is hidden by %s',
  (mode) => {
    const { page, boundary } = fixture();
    if (mode === 'activity-host') page.style.setProperty('display', 'none', 'important');
    else if (mode === 'activity-ancestor') boundary.setAttribute('style', 'display:none');
    else boundary.hidden = true;
    expect(matches(selectors).size).toBe(0);
  },
);

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';

import { ORIGINAL, PATCHED, WRAPPER_FILES, patchUseCacheWrapper } from './patch-next-use-cache.mjs';

test('turns cross-request sharing off', () => {
  const { source, changed } = patchUseCacheWrapper(`a;\n        ${ORIGINAL}\nb;`);
  assert.equal(changed, true);
  assert.equal(source, `a;\n        ${PATCHED}\nb;`);
});

test('leaves an already patched file as it is', () => {
  const input = `a;\n${PATCHED}\nb;`;
  assert.deepEqual(patchUseCacheWrapper(input), { source: input, changed: false });
});

test('fails when Next.js changed the line', () => {
  assert.throws(() => patchUseCacheWrapper('const skipCrossRequestDedupe = false;'), /changed/);
});

test('matches the installed Next.js', () => {
  const nextRoot = path.dirname(createRequire(import.meta.url).resolve('next/package.json'));
  for (const relative of WRAPPER_FILES) {
    const source = readFileSync(path.join(nextRoot, relative), 'utf8');
    assert.ok(source.includes(ORIGINAL) || source.includes(PATCHED), relative);
  }
});

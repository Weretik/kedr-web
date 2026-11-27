// Run by the site's Cloudflare build (apps/site/open-next.config.ts) before `next build`.
//
// Next.js `'use cache'` lets concurrent requests share one unfinished cache read (a module-level map in
// use-cache-wrapper.js). On Cloudflare Workers a request cannot wait for I/O owned by another request, so the
// joining request hangs, Workers cancels it, and the page shows the 500 error view: fast clicks between products
// opened several requests for one page (investigation 2026-11-27). Next.js 16.4.6 and OpenNext 1.20.19 do not
// handle it, so the build turns the sharing off: every request reads the cache itself. A Next.js update that
// changes this line fails the build here, so the patch is checked again instead of silently dropped.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORIGINAL =
  'const skipCrossRequestDedupe = isPrivate && !process.env.__NEXT_DEV_SERVER || workStore.isDraftMode;';
export const PATCHED =
  'const skipCrossRequestDedupe = true; // kedr-web: no cross-request sharing on Cloudflare Workers';

/** Both module formats; Turbopack bundles whichever one a server chunk imports. */
export const WRAPPER_FILES = [
  'dist/server/use-cache/use-cache-wrapper.js',
  'dist/esm/server/use-cache/use-cache-wrapper.js',
];

/** The patched source, or the same source when it is already patched; throws when Next.js changed the line. */
export function patchUseCacheWrapper(source, file = 'use-cache-wrapper.js') {
  if (source.includes(PATCHED)) return { source, changed: false };
  const count = source.split(ORIGINAL).length - 1;
  if (count !== 1) {
    throw new Error(
      `${file}: expected the cross-request dedupe line once, found ${count}. ` +
        'Next.js changed use-cache-wrapper.js; check tools/scripts/patch-next-use-cache.mjs.',
    );
  }
  return { source: source.replace(ORIGINAL, PATCHED), changed: true };
}

function main() {
  const require = createRequire(import.meta.url);
  const nextRoot = path.dirname(require.resolve('next/package.json'));
  for (const relative of WRAPPER_FILES) {
    const file = path.join(nextRoot, relative);
    const { source, changed } = patchUseCacheWrapper(readFileSync(file, 'utf8'), relative);
    if (changed) writeFileSync(file, source);
    console.log(`${changed ? 'patched' : 'already patched'}: next/${relative}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

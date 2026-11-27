import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue';
import kvNextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';

// Cloudflare Workers adapter (owner decision 2026-10-30, migration step 0).
// 'use cache' data and prerendered pages live in Workers KV;
// the tag cache makes /api/revalidate from KedrStore reach every isolate.
const config = defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: kvNextTagCache,
  queue: memoryQueue,
});

// apps/site has no package.json: OpenNext starts in the workspace root, and next.config.mjs must be loaded from its own folder.
// The patch turns off Next.js sharing of one 'use cache' read between concurrent requests, which hangs on Workers.
config.buildCommand =
  'node tools/scripts/patch-next-use-cache.mjs && cd apps/site && npx next build';

export default config;

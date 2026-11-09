import { createRevalidationConfig } from '@site/core/config';
import { handleRevalidateRequest } from '@site/core/revalidation';
import { revalidateTag } from 'next/cache';

/** KedrStore's «Оновити сайт зараз»: the next visit reads fresh content and catalog data. */
export function POST(request: Request) {
  // Read on every request: on Cloudflare Workers a runtime-only secret is not in process.env when the module loads.
  const { secret } = createRevalidationConfig(process.env);
  return handleRevalidateRequest(request, {
    secret,
    // The admin asked for «now», so stale data is not served while the next request refetches it.
    revalidate: (tag) => revalidateTag(tag, { expire: 0 }),
  });
}

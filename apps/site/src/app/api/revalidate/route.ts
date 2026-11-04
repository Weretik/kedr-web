import { createRevalidationConfig } from '@site/core/config';
import { handleRevalidateRequest } from '@site/core/revalidation';
import { revalidateTag } from 'next/cache';

const { secret } = createRevalidationConfig(process.env);

/** KedrStore's «Оновити сайт зараз»: the next visit reads fresh content and catalog data. */
export function POST(request: Request) {
  return handleRevalidateRequest(request, {
    secret,
    // The admin asked for «now», so stale data is not served while the next request refetches it.
    revalidate: (tag) => revalidateTag(tag, { expire: 0 }),
  });
}

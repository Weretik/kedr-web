import { siteConfig } from '@site/core/config';
import { DEFAULT_LOCALE, isLocale } from '@site/core/i18n';
import { createRedirectList, redirectTarget } from '@site/core/redirects';
import { NextResponse } from 'next/server';

import type { NextFetchEvent, NextRequest } from 'next/server';

const redirects = createRedirectList({ apiUrl: siteConfig.apiUrl });

/**
 * 1. An old address from the admin «Переадресації» answers 301 to its new address (spec content/013).
 * 2. Paths whose first segment is not a locale still match `[locale]`, and the root layout cannot render a
 *    framed 404 for them. Rewriting them to an unmatched path under the default locale serves
 *    `global-not-found.tsx` with status 404 while the address bar keeps the requested URL.
 */
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const list = await redirects.get((promise) => event.waitUntil(promise));
  const target = redirectTarget(list, pathname, request.url);
  if (target) return NextResponse.redirect(target, 301);

  if (isLocale(pathname.split('/')[1] ?? '')) return NextResponse.next();
  return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}/_not-found`, request.url));
}

export const config = {
  // Every page path: skips the root (redirected in next.config.mjs), route handlers under /api/,
  // Next.js internals, and files with an extension.
  matcher: ['/((?!api/|_next/|.*\\..*).+)'],
};

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const { pathname } = requestUrl;

    if (pathname === '/') {
      return Response.redirect(new URL('/uk/', request.url), 302);
    }

    const acceptHeader = request.headers.get('accept') || '';
    const isDocumentRequest =
      (request.method === 'GET' || request.method === 'HEAD') && acceptHeader.includes('text/html');

    // Product slugs are rendered by Angular in the browser. Cloudflare Pages can
    // return the prerendered 404.html with status 200, so a status-only fallback
    // below cannot preserve direct product links.
    if (isDocumentRequest && /^\/(uk|ru)\/catalog\/product\/[^/]+\/?$/.test(pathname)) {
      const clientShellUrl = new URL('/index.csr.html', request.url);
      return env.ASSETS.fetch(new Request(clientShellUrl, request));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    if (request.method !== 'GET') {
      return assetResponse;
    }

    if (!acceptHeader.includes('text/html')) {
      return assetResponse;
    }

    const localePrefix = resolveLocalePrefix(pathname);
    const localizedIndexUrl = new URL(`${localePrefix}/index.html`, request.url);

    return env.ASSETS.fetch(new Request(localizedIndexUrl.toString(), request));
  },
};

function resolveLocalePrefix(pathname) {
  if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    return '/ru';
  }

  if (pathname === '/uk' || pathname.startsWith('/uk/')) {
    return '/uk';
  }

  return '/uk';
}

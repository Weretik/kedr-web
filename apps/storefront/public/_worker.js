export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const { pathname } = requestUrl;

    if (pathname === '/') {
      return Response.redirect(new URL('/uk/', request.url), 302);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    if (request.method !== 'GET') {
      return assetResponse;
    }

    const acceptHeader = request.headers.get('accept') || '';
    if (!acceptHeader.includes('text/html')) {
      return assetResponse;
    }

    const localePrefix = resolveLocalePrefix(pathname);
    const localizedIndexUrl = new URL(
      `${localePrefix}/index.html`,
      request.url,
    );

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

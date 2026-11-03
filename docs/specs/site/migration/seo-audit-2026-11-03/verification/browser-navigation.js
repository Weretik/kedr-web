async (page) => {
  const routes = [
    '/uk',
    '/ru',
    '/uk/catalog',
    '/uk/catalog/zavisi-900001',
    '/ru/catalog/zavisi-900001?page=2',
    '/uk/search?q=замок',
    '/uk/articles',
    '/ru/articles/zamak-chy-aliuminii',
    '/uk/contacts',
    '/uk/delivery-and-payment',
    '/uk/returns-exchanges',
    '/uk/requisites',
    '/uk/wholesale',
    '/uk/public-offer',
    '/ru/public-offer',
    '/uk/privacy-policy',
    '/uk/no-such-seo-audit-page',
  ];
  const errors = [];
  const failed = [];
  const badResponses = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('requestfailed', (request) =>
    failed.push({ url: request.url(), reason: request.failure()?.errorText }),
  );
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('/_next/'))
      badResponses.push({ url: response.url(), status: response.status() });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of routes) {
    try {
      const response = await page.goto('http://localhost:3000' + route, {
        waitUntil: 'load',
        timeout: 45000,
      });
      await page
        .locator('main')
        .waitFor({ state: 'visible', timeout: 10000 })
        .catch(() => {});
      const data = await page.evaluate(() => {
        const main = document.querySelector('main');
        const active = (e) =>
          !e.closest('[hidden], [style*="display: none"], [style*="display:none"]');
        const values = (selector) =>
          [...document.querySelectorAll(selector)]
            .filter(active)
            .map((e) => e.content || e.innerText || e.href || '');
        return {
          url: location.href,
          title: document.title,
          lang: document.documentElement.lang,
          h1: values('h1'),
          h2: values('main h2'),
          robots: values('meta[name="robots"]'),
          description: values('meta[name="description"]'),
          canonical: values('link[rel="canonical"]'),
          alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(
            (e) => ({ lang: e.hreflang, href: e.href }),
          ),
          mainText: main?.innerText,
          mainLinks: [...(main?.querySelectorAll('a[href]') || [])].map((e) => ({
            href: e.getAttribute('href'),
            text: e.innerText,
          })),
          schemas: [...document.querySelectorAll('script[type="application/ld+json"]')]
            .filter(active)
            .map((e) => {
              try {
                return JSON.parse(e.textContent);
              } catch {
                return { invalid: true };
              }
            }),
          images: [...(main?.querySelectorAll('img') || [])].map((e) => ({
            src: e.getAttribute('src'),
            currentSrc: e.currentSrc,
            alt: e.getAttribute('alt'),
            complete: e.complete,
            naturalWidth: e.naturalWidth,
            loading: e.loading,
            width: e.width,
            height: e.height,
          })),
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          viewport: { width: innerWidth, height: innerHeight },
        };
      });
      console.log(
        'SEO_BROWSER ' +
          JSON.stringify({
            requested: route,
            status: response?.status(),
            checkedAt: new Date().toISOString(),
            ...data,
          }),
      );
      if (route === '/uk')
        await page.screenshot({ path: 'output/playwright/seo-home-desktop.png', fullPage: true });
      if (route === '/uk/public-offer') {
        await page.setViewportSize({ width: 390, height: 844 });
        const mobile = await page.evaluate(() => ({
          url: location.href,
          h1: [...document.querySelectorAll('h1')].map((e) => e.innerText),
          mainText: document.querySelector('main')?.innerText,
          documentSections: document.querySelectorAll('[data-offer-document] section[id]').length,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          viewport: innerWidth,
        }));
        console.log('SEO_BROWSER_MOBILE ' + JSON.stringify(mobile));
        await page.screenshot({
          path: 'output/playwright/seo-public-offer-mobile.png',
          fullPage: true,
        });
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
    } catch (error) {
      console.log('SEO_BROWSER ' + JSON.stringify({ requested: route, error: String(error) }));
    }
  }
  console.log('SEO_BROWSER_NETWORK ' + JSON.stringify({ errors, failed, badResponses }));
};

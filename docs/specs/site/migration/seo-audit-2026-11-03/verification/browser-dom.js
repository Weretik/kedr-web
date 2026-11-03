async (page) => {
  const pages = [];
  for (const route of [
    '/uk',
    '/uk/catalog/zavisy?page=2',
    '/ru/articles/zamak-chy-aliuminii',
    '/uk/public-offer',
    '/ru/public-offer',
    '/uk/privacy-policy',
  ]) {
    try {
      const response = await page.goto('http://localhost:3000' + route, {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      });
      await page.locator('main h1').waitFor({ state: 'visible', timeout: 10000 });
      if (route.includes('/catalog/'))
        await page
          .locator('main a[href*="/product/"]')
          .first()
          .waitFor({ state: 'visible', timeout: 20000 })
          .catch(() => {});
      const data = await page.evaluate(() => ({
        url: location.href,
        title: document.title,
        lang: document.documentElement.lang,
        h1: [...document.querySelectorAll('h1')]
          .filter((e) => !e.closest('[hidden]'))
          .map((e) => e.innerText),
        canonical: [...document.querySelectorAll('link[rel="canonical"]')].map((e) => e.href),
        robots: [...document.querySelectorAll('meta[name="robots"]')].map((e) => e.content),
        alternates: [...document.querySelectorAll('link[hreflang]')].map((e) => ({
          lang: e.hreflang,
          href: e.href,
        })),
        mainText: document.querySelector('main')?.innerText,
        mainLinks: [...document.querySelectorAll('main a[href]')].map((e) => ({
          href: e.getAttribute('href'),
          text: e.innerText,
        })),
        schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map((e) => {
          try {
            return JSON.parse(e.textContent);
          } catch {
            return { invalid: true };
          }
        }),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        images: [...document.querySelectorAll('main img')].map((e) => ({
          src: e.currentSrc,
          alt: e.alt,
          complete: e.complete,
          naturalWidth: e.naturalWidth,
          loading: e.loading,
        })),
      }));
      pages.push({
        requested: route,
        status: response?.status(),
        checkedAt: new Date().toISOString(),
        ...data,
      });
      if (route === '/uk/public-offer') {
        await page.setViewportSize({ width: 390, height: 844 });
        pages.push({
          kind: 'mobile',
          requested: route,
          ...(await page.evaluate(() => ({
            url: location.href,
            h1: [...document.querySelectorAll('h1')].map((e) => e.innerText),
            sections: document.querySelectorAll('[data-offer-document] section[id]').length,
            mainText: document.querySelector('main')?.innerText,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            width: innerWidth,
          }))),
        });
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
    } catch (error) {
      pages.push({ requested: route, error: String(error) });
    }
  }
  return { pages };
};

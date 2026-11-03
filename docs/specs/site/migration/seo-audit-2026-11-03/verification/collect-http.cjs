const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const repo = 'E:/RiderProjects/kedr-web';
const req = createRequire(repo + '/package.json');
const { JSDOM } = req('jsdom');
const base = 'http://localhost:3000';
const dest = path.join(__dirname, 'seo-runtime');
fs.mkdirSync(dest, { recursive: true });
const output = path.join(dest, 'http-pages.json');
let records = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')).pages : [];
const clean = value => (value || '').replace(/\s+/g, ' ').trim();
const absolutePath = href => { try { const u = new URL(href, base); return ['localhost', '127.0.0.1', 'classkedr.com.ua'].includes(u.hostname) ? u.pathname + u.search : null; } catch { return null; } };
function extract(html, url, status) {
  const dom = new JSDOM(html, { url });
  const d = dom.window.document;
  const values = selector => [...d.querySelectorAll(selector)].map(e => clean(e.content || e.textContent || e.href || ''));
  const main = d.querySelector('main');
  const clone = (main || d.body).cloneNode(true);
  clone.querySelectorAll('script,style,template,noscript,[hidden],[style*="display:none"],[style*="display: none"]').forEach(e => e.remove());
  const text = clean(clone.textContent);
  const serverClone = d.body.cloneNode(true);
  serverClone.querySelectorAll('script,style,template,noscript').forEach(e => e.remove());
  const serverText = clean(serverClone.textContent);
  const structuredData = [...d.querySelectorAll('script[type="application/ld+json"]')].map(e => { try { return { valid: true, data: JSON.parse(e.textContent) }; } catch (err) { return { valid: false, error: String(err) }; } });
  const links = [...d.querySelectorAll('a[href]')].map(e => ({ href: e.getAttribute('href'), text: clean(e.textContent), main: Boolean(e.closest('main')), ariaLabel: e.getAttribute('aria-label') })).filter(e => e.href && !e.href.startsWith('#'));
  const images = [...d.querySelectorAll('img')].map(e => ({ src: e.getAttribute('src'), srcset: e.getAttribute('srcset'), alt: e.getAttribute('alt'), width: e.getAttribute('width'), height: e.getAttribute('height'), loading: e.getAttribute('loading'), fetchPriority: e.getAttribute('fetchpriority'), sizes: e.getAttribute('sizes'), main: Boolean(e.closest('main')) }));
  const result = {
    lang: d.documentElement.lang,
    titles: values('title'),
    descriptions: values('meta[name="description"]'),
    robots: values('meta[name="robots"]'),
    googlebot: values('meta[name="googlebot"]'),
    canonical: [...d.querySelectorAll('link[rel="canonical"]')].map(e => e.href),
    alternates: [...d.querySelectorAll('link[rel="alternate"][hreflang]')].map(e => ({ lang: e.hreflang, href: e.href })),
    h1: values('h1'), h2: values('main h2'),
    mainText: text,
    serverText,
    mainTextNote: 'DOM parser before execution of Next streaming scripts; final browser text is recorded separately. Word count is not a content quality threshold.',
    mainWords: text ? text.split(/\s+/u).length : 0,
    mainPresent: Boolean(main),
    mainLinks: links.filter(e => e.main),
    internalLinks: [...new Set(links.map(e => absolutePath(e.href)).filter(Boolean))],
    structuredData,
    openGraph: [...d.querySelectorAll('meta[property^="og:"]')].map(e => ({ property: e.getAttribute('property'), content: e.content })),
    twitter: [...d.querySelectorAll('meta[name^="twitter:"]')].map(e => ({ name: e.name, content: e.content })),
    images,
    mainHasUnavailable: /каталог тимчасово недоступний|каталог временно недоступен|не вдалося|не удалось|товари тимчасово|товары временно/i.test(text),
    bytes: Buffer.byteLength(html, 'utf8'),
    status
  };
  dom.window.close();
  return result;
}
async function probe(item) {
  const started = Date.now();
  let url = base + item.path;
  const chain = [];
  try {
    let response, html;
    for (let i = 0; i < 7; i++) {
      response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(55000), headers: { 'user-agent': item.ua || 'KedrLocalSeoAudit/1.0' } });
      html = await response.text();
      const location = response.headers.get('location');
      chain.push({ url, status: response.status, location });
      if (response.status >= 300 && response.status < 400 && location) {
        const next = new URL(location, url);
        if (!['localhost','127.0.0.1'].includes(next.hostname)) throw new Error('External redirect not followed: ' + next.href);
        url = next.href;
      } else break;
    }
    const contentType = response.headers.get('content-type');
    const result = { requested: item.path, group: item.group, checkedAt: new Date().toISOString(), finalUrl: url, chain, elapsedMsDev: Date.now() - started, headers: { contentType, robots: response.headers.get('x-robots-tag'), cacheControl: response.headers.get('cache-control'), vary: response.headers.get('vary') }, ...(contentType?.includes('html') ? extract(html, url, response.status) : { status: response.status, body: html }) };
    if (item.raw) fs.writeFileSync(path.join(dest, item.raw + '.html'), html);
    records = records.filter(e => !(e.requested === item.path && e.group === item.group));
    records.push(result);
    fs.writeFileSync(output, JSON.stringify({ base, note: 'Local existing next dev server; indexing intentionally disabled. Timings are development timings, not Core Web Vitals.', pages: records }, null, 2));
    console.log(JSON.stringify({ path: item.path, group: item.group, status: response.status, title: result.titles?.[0], h1: result.h1, words: result.mainWords, schemas: result.structuredData?.map(e => e.data?.['@type']), canonical: result.canonical, robots: result.robots, redirects: chain.length - 1 }));
    return result;
  } catch (error) {
    const result = { requested: item.path, group: item.group, checkedAt: new Date().toISOString(), error: String(error), chain, elapsedMsDev: Date.now() - started };
    records.push(result); fs.writeFileSync(output, JSON.stringify({ base, pages: records }, null, 2)); console.log(JSON.stringify(result)); return result;
  }
}
async function batch(items) { for (let i = 0; i < items.length; i += 2) await Promise.all(items.slice(i,i+2).map(probe)); }
async function main() {
  const phase = process.argv[2] || 'static';
  if (phase === 'static') {
    const slugs = ['zamina-dvernoi-furnitury','postachannia-dlia-vyrobnykiv-dverei','zamak-chy-aliuminii','prykhovani-petli','vrizna-bronenakladka','zvukoizoliatsiia-dverei'];
    const paths = ['', '/catalog', '/delivery-and-payment','/returns-exchanges','/contacts','/requisites','/public-offer','/wholesale','/articles'];
    await batch(['uk','ru'].flatMap(locale => [...paths.map(p => ({ path: '/' + locale + p, group: 'public', raw: locale === 'uk' && ['', '/public-offer','/catalog'].includes(p) ? 'uk' + (p.replaceAll('/','-') || '-home') : undefined })), ...slugs.map(slug => ({ path: '/' + locale + '/articles/' + slug, group: 'article', raw: locale === 'uk' && slug === 'zamak-chy-aliuminii' ? 'uk-article' : undefined }))]));
    await batch(['/robots.txt','/sitemap.xml'].map(p => ({ path: p, group: 'discovery' })));
  } else if (phase === 'cases') {
    const home = records.find(e => e.requested === '/uk');
    const hub = records.find(e => e.requested === '/uk/catalog');
    const categories = [...new Set([...(home?.internalLinks || []), ...(hub?.internalLinks || [])].filter(p => /^\/uk\/catalog\/[^/?]+$/.test(p)))];
    const category = categories[0];
    if (!category) throw new Error('No live categories discovered in HTML');
    const detail = await probe({ path: category, group: 'category', raw: 'uk-category' });
    const product = detail.internalLinks?.find(p => /^\/uk\/product\/[^/?]+$/.test(p)) || home.internalLinks?.find(p => /^\/uk\/product\/[^/?]+$/.test(p));
    fs.writeFileSync(path.join(dest,'discovered.json'), JSON.stringify({ category, categories, product }, null, 2));
    const items = [
      { path: category.replace('/uk/','/ru/'), group: 'category' },
      ...categories.slice(1,3).flatMap(p => [{ path:p,group:'category' },{ path:p.replace('/uk/','/ru/'),group:'category' }]),
      ...['?page=2','?page=9999','?page=0','?page=1','?sort=price-asc','?view=table','?perPage=50','?inStock=true','?priceFrom=9999999','?utm_source=seo-audit','?unknown=1'].map(q => ({ path: category + q, group:'catalog-variant' })),
      ...['/uk/search','/ru/search?q=замок','/uk/search?q=замок','/uk/search?q=zzzznotfound7654321','/uk/articles?q=замок','/ru/articles?q=замок','/uk/articles?pageSize=20','/uk/articles?page=99'].map(p=>({path:p,group:'utility'})),
      ...['/uk/galleria','/ru/galleria','/uk/privacy-policy','/ru/privacy-policy','/uk/region/kyiv','/ru/region/kyiv','/uk/cabinet','/uk/checkout','/uk/login','/uk/no-such-seo-audit-page','/en/catalog','/uk/catalog/no-such-category-7654321','/uk/articles/no-such-article-7654321','/uk/product/no-such-product-7654321'].map(p=>({path:p,group:'route-status'})),
      {path:'/',group:'redirect'},
      {path:'/uk/',group:'redirect'},
      {path:'/uk/catalog/',group:'redirect'},
      {path:'/uk/categories',group:'redirect'},
      {path:'/ru/about-company',group:'redirect'},
      {path:'/uk/catalog/products?search=замок',group:'redirect'},
      {path:'/uk/catalog/products',group:'redirect'},
      {path:category.replace('/catalog/','/catalog/')+'/products?page=2',group:'redirect'},
      {path:'/uk/articles/1',group:'redirect'},
      {path:'/ru/articles/3',group:'redirect'},
      {path:category,group:'html-limited-bot',ua:'Twitterbot/1.0',raw:'uk-category-bot'},
      {path:'/uk/public-offer',group:'html-limited-bot',ua:'Twitterbot/1.0',raw:'uk-public-offer-bot'}
    ];
    if (product) items.push({path:product,group:'product-gap'}, {path:product.replace('/uk/','/ru/'),group:'product-gap'}, {path:product.replace('/product/','/catalog/product/'),group:'redirect'});
    await batch(items);
  } else if (phase === 'sitemap') {
    const sitemap = records.find(e => e.requested === '/sitemap.xml' && e.status === 200);
    if (!sitemap?.body) throw new Error('No XML sitemap in saved records');
    const paths = [...new Set([...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => { const u = new URL(m[1].replaceAll('&amp;', '&')); return u.pathname + u.search; }))];
    const done = new Set(records.filter(e => e.status === 200 && !e.error).map(e => { const u = new URL(e.finalUrl); return u.pathname + u.search; }));
    const pending = paths.filter(p => !done.has(p));
    console.log(JSON.stringify({ sitemapUrls:paths.length, alreadyChecked: paths.length-pending.length, pending:pending.length }));
    await batch(pending.map(p => ({path:p,group:'sitemap-destination'})));
  } else if (phase === 'links') {
    const attempted = new Set(records.map(e => { try { const u = new URL(e.finalUrl || base + e.requested); return u.pathname + u.search; } catch { return e.requested; } }));
    const links = [...new Set(records.filter(e=>e.status===200).flatMap(e=>e.internalLinks||[]))].filter(p=>!attempted.has(p) && !p.includes('?') && !p.startsWith('/assets/') && !p.startsWith('/_next/') && !p.includes('/product/'));
    const selected = links.filter(p => /\/(region|catalog)\//.test(p) || /\/(galleria|privacy-policy|cabinet|checkout|login)$/.test(p));
    console.log(JSON.stringify({remainingLinks:links.length,selected:selected.length}));
    await batch(selected.map(p=>({path:p,group:'internal-link-check'})));
  } else if (phase === 'custom') {
    const paths = JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
    await batch(paths);
  }
  console.log(JSON.stringify({ phase, totalRecords: records.length, output }));
}
main().catch(e => { console.error(e); process.exitCode=1; });

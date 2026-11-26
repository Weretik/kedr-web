/** Old addresses of «Вітрина сайту» and «Ознаки» (spec admin/site-models/001, R-010). */

function readPositive(value: string | null): number | undefined {
  const number = Number(value);
  return value !== null && Number.isInteger(number) && number > 0 ? number : undefined;
}

function withQuery(path: string, query: URLSearchParams): string {
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

function dictionaryPath(tab: string | null): string | undefined {
  if (tab === 'codes') return '/site-review?tab=codes';
  if (tab === 'attributes' || tab === 'filters') return `/site-attributes?tab=${tab}`;
  return undefined;
}

/** Where `/site-showcase` with its tab, queue view, open row, category, and search goes now. */
export function legacySiteShowcasePath(params: URLSearchParams): string {
  const dictionary = dictionaryPath(params.get('tab'));
  if (dictionary) return dictionary;

  const item = params.get('item') ?? '';
  const modelId = item.startsWith('m') ? readPositive(item.slice(1)) : undefined;
  if (modelId) return `/site-models/${modelId}`;

  const view = params.get('view');
  if (view === 'review') return '/site-review?tab=new';
  if (view === 'lone' || /^p\d+$/u.test(item)) return '/site-review?tab=lone';

  const list = new URLSearchParams();
  const categoryId = readPositive(params.get('categoryId'));
  const search = params.get('search')?.trim();
  if (categoryId) list.set('categoryId', String(categoryId));
  if (search) list.set('search', search);
  if (view === 'problems') list.set('problem', 'any');
  return withQuery('/site-models', list);
}

/** Where `/catalog-attributes` goes now: «Ознаки та фільтри», or «Перевірка» for the codes. */
export function legacyCatalogAttributesPath(params: URLSearchParams): string {
  return dictionaryPath(params.get('tab')) ?? '/site-attributes?tab=attributes';
}

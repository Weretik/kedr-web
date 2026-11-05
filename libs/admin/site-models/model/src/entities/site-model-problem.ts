/** Problem codes of spec catalog/007: four for a product, three for a model. */
export type SiteProductProblem =
  'no_model' | 'no_attributes' | 'missing_axis_value' | 'same_combination';
export type SiteModelOnlyProblem = 'model_no_axes' | 'model_no_seo' | 'model_no_photo';
export type SiteModelProblem = SiteProductProblem | SiteModelOnlyProblem;

/** A list filter: one code, or `any` for every row with a problem. */
export type SiteProblemFilter = SiteModelProblem | 'any';

export const siteProductProblems: readonly SiteProductProblem[] = [
  'no_model',
  'no_attributes',
  'missing_axis_value',
  'same_combination',
];

export const siteModelProblems: readonly SiteModelProblem[] = [
  ...siteProductProblems,
  'model_no_axes',
  'model_no_seo',
  'model_no_photo',
];

const labels: Record<SiteModelProblem, string> = {
  no_model: 'Немає моделі',
  no_attributes: 'Немає ознак',
  missing_axis_value: 'Не заповнена ознака',
  same_combination: 'Однакові варіанти',
  model_no_axes: 'Модель без ознак',
  model_no_seo: 'Немає SEO-текстів',
  model_no_photo: 'Немає фото',
};

const hints: Record<SiteModelProblem, string> = {
  no_model: 'Товар на сайті, але не входить у прийняту модель: на сайті він не має своєї сторінки.',
  no_attributes: 'У товару немає жодної ознаки (колір, розмір, сторона).',
  missing_axis_value: 'Не вказано значення ознаки, за якою модель розрізняє товари.',
  same_combination: 'Ще один товар моделі має ті самі значення ознак: покупець їх не розрізнить.',
  model_no_axes: 'У моделі кілька товарів, але не вибрано, чим вони відрізняються.',
  model_no_seo: 'Не заповнено SEO-заголовок чи опис українською.',
  model_no_photo: 'Жоден товар моделі не має фото.',
};

export function isSiteModelProblem(code: string): code is SiteModelProblem {
  return (siteModelProblems as readonly string[]).includes(code);
}

/** Ukrainian name of a problem; an unknown code is shown as it is. */
export function siteProblemLabel(code: string): string {
  return isSiteModelProblem(code) ? labels[code] : code;
}

/** One sentence on what the problem means, for a tooltip. */
export function siteProblemHint(code: string): string | undefined {
  return isSiteModelProblem(code) ? hints[code] : undefined;
}

/** «Немає моделі» is the hard error: the product is on the site without a page. */
export function isHardSiteProblem(code: string): boolean {
  return code === 'no_model';
}

import { z } from 'zod';

/** Runtime shapes of the site models API (spec catalog/007). Unknown problem codes pass and show as they are. */
const status = z.enum(['proposed', 'accepted']);
const problems = z.array(z.string());
const page = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    totalCount: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
  });

export const siteModelListSchema = page(
  z.object({
    id: z.number().int().min(1),
    categoryId: z.number().int(),
    categoryName: z.string(),
    name: z.string(),
    slug: z.string(),
    status,
    productCount: z.number().int().nonnegative(),
    onSiteCount: z.number().int().nonnegative(),
    minPrice: z.number().nullish(),
    photo: z.string(),
    axes: z.array(z.string()),
    problems,
  }),
);

export const siteModelSchema = z.object({
  id: z.number().int().min(1),
  categoryId: z.number().int(),
  categoryName: z.string(),
  name: z.string(),
  slug: z.string(),
  status,
  acceptedAt: z.string().nullish(),
  acceptedBy: z.string().nullish(),
  mainProductId: z.number().int().nullish(),
  axes: z.array(
    z.object({
      attributeId: z.number().int().min(1),
      code: z.string(),
      name: z.string(),
      display: z.enum(['swatch', 'button', 'checkbox']),
      isSaved: z.boolean(),
    }),
  ),
  products: z.array(
    z.object({
      productId: z.number().int().min(1),
      name: z.string(),
      slug: z.string(),
      photo: z.string(),
      retailPrice: z.number().nullish(),
      inStock: z.boolean(),
      exportToSite: z.boolean(),
      isMain: z.boolean(),
      values: z.array(
        z.object({
          attributeId: z.number().int().min(1),
          valueId: z.number().int().nullish(),
          name: z.string().nullish(),
          isManual: z.boolean(),
        }),
      ),
      problems,
    }),
  ),
  texts: z.array(
    z.object({
      language: z.enum(['uk', 'ru']),
      shortDescription: z.string(),
      description: z.string(),
      seoTitle: z.string(),
      seoDescription: z.string(),
    }),
  ),
  characteristics: z.array(
    z.object({ attributeId: z.number().int(), name: z.string(), values: z.array(z.string()) }),
  ),
  problems,
});

const showcaseModel = z.object({ id: z.number().int().min(1), name: z.string(), status });

const showcaseItem = z.object({
  productId: z.number().int().min(1),
  name: z.string(),
  slug: z.string(),
  photo: z.string(),
  categoryId: z.number().int(),
  categoryName: z.string(),
  retailPrice: z.number().nullish(),
  inStock: z.boolean(),
  model: showcaseModel.nullish(),
  values: z.array(
    z.object({ attributeId: z.number().int(), attributeName: z.string(), value: z.string() }),
  ),
  problems,
});

export const siteShowcaseListSchema = page(
  z.object({
    key: z.string(),
    model: showcaseModel.nullish(),
    name: z.string(),
    photo: z.string(),
    categoryId: z.number().int(),
    categoryName: z.string(),
    minPrice: z.number().nullish(),
    inStock: z.boolean(),
    products: z.array(showcaseItem),
    problems,
  }),
);

export const siteModelCategoriesSchema = z.array(
  z.object({
    id: z.number().int().min(1),
    name: z.string(),
    parentId: z.number().int().nullish(),
    onSiteProducts: z.number().int().nonnegative(),
    acceptedModels: z.number().int().nonnegative(),
    proposedModels: z.number().int().nonnegative(),
    problemCount: z.number().int().nonnegative(),
    loneProducts: z.number().int().nonnegative(),
    filterCount: z.number().int().nonnegative(),
  }),
);

export const siteModelHealthSchema = z.object({
  productsWithoutModel: z.number().int().nonnegative(),
  productsWithoutAttributes: z.number().int().nonnegative(),
  productsMissingAxisValue: z.number().int().nonnegative(),
  productsWithSameCombination: z.number().int().nonnegative(),
  modelsWithoutAxes: z.number().int().nonnegative(),
  modelsWithoutSeo: z.number().int().nonnegative(),
  modelsWithoutPhoto: z.number().int().nonnegative(),
  proposedModels: z.number().int().nonnegative(),
});

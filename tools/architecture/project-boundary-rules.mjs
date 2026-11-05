const documentedCrossDomainFlows = new Set([
  'admin-orders-feature->admin-products-data-access',
  'admin-gallery-feature->admin-media-data-access',
  'admin-gallery-feature->admin-media-model',
  'admin-gallery-feature->admin-media-ui',
  // Home page brands: the logo is picked or uploaded from the media library (Content 006).
  'admin-home-content-feature->admin-media-data-access',
  'admin-home-content-feature->admin-media-model',
  'admin-home-content-feature->admin-media-ui',
  // Article cover: picked from the media library (Content 008).
  'admin-articles-feature->admin-media-data-access',
  'admin-articles-feature->admin-media-model',
  'admin-articles-feature->admin-media-ui',
  // Product page «Фото та схема»: picks and uploads library files (Media 001 stage 3).
  'admin-products-feature->admin-media-data-access',
  'admin-products-feature->admin-media-model',
  'admin-products-feature->admin-media-ui',
  // «Властивості»: a value's decor texture is picked from the media library (Catalog 006 phase 3).
  'admin-catalog-attributes-feature->admin-media-data-access',
  'admin-catalog-attributes-feature->admin-media-model',
  'admin-catalog-attributes-feature->admin-media-ui',
  'mobile-catalog-feature->mobile-cart-data-access',
  'mobile-catalog-feature->mobile-cart-model',
  'mobile-orders-feature->mobile-customers-data-access',
  'mobile-orders-feature->mobile-customers-model',
  'mobile-orders-feature->mobile-customers-ui',
  'mobile-cart-feature->mobile-customers-data-access',
  'mobile-cart-feature->mobile-customers-model',
  'mobile-cart-feature->mobile-customers-ui',
  'site-home-feature->site-catalog-data-access',
  'site-home-feature->site-catalog-model',
  'site-product-feature->site-catalog-model',
  'site-cart-feature->site-product-model',
  'site-home-feature->site-catalog-ui',
  'site-content-feature->site-catalog-data-access',
  'site-content-feature->site-catalog-model',
  'site-content-feature->site-catalog-ui',
]);

// This content SEO library uses only the core public APIs selected in the contacts SDD.
const contentSeoCoreDependencies = new Set(['site-core-config', 'site-core-i18n', 'site-core-seo']);

function valueFor(tags, prefix) {
  return tags.find((tag) => tag.startsWith(prefix))?.slice(prefix.length);
}

export function validateProjectBoundary(source, target) {
  if (source.name === 'site-content-seo' && !contentSeoCoreDependencies.has(target.name)) {
    return `${source.name} cannot depend on ${target.name}; content SEO uses only core config, i18n, and SEO`;
  }

  const sourceTags = source.tags ?? [];
  const targetTags = target.tags ?? [];
  const sourceType = valueFor(sourceTags, 'type:');
  const targetType = valueFor(targetTags, 'type:');
  const sourceDomain = valueFor(sourceTags, 'domain:');
  const targetDomain = valueFor(targetTags, 'domain:');

  if (
    sourceType === 'shell' &&
    sourceTags.includes('scope:site-shared') &&
    targetDomain &&
    targetDomain !== 'core'
  ) {
    return `${source.name} (Site core shell) cannot depend on domain project ${target.name}; inject a node through a shell slot`;
  }

  if (sourceType === 'core' && targetDomain && targetDomain !== 'core') {
    return `${source.name} (core) cannot depend on domain project ${target.name}`;
  }

  if (sourceType === 'feature' && targetType === 'feature') {
    return `${source.name} (feature) cannot depend on feature project ${target.name}`;
  }

  if (
    sourceType === 'model' &&
    targetDomain &&
    sourceDomain !== targetDomain &&
    !documentedCrossDomainFlows.has(`${source.name}->${target.name}`)
  ) {
    return `${source.name} (model:${sourceDomain ?? 'untagged'}) cannot depend on ${target.name} (domain:${targetDomain})`;
  }

  if (['model', 'ui', 'data-access'].includes(sourceType) && targetType === 'feature') {
    return `${source.name} (${sourceType}) cannot depend upward on feature project ${target.name}`;
  }

  if (sourceDomain && targetDomain && sourceDomain !== targetDomain && sourceType !== 'feature') {
    return `${source.name} (domain:${sourceDomain}) cannot depend on ${target.name} (domain:${targetDomain})`;
  }

  if (
    sourceDomain &&
    targetDomain &&
    sourceDomain !== targetDomain &&
    sourceType === 'feature' &&
    !documentedCrossDomainFlows.has(`${source.name}->${target.name}`)
  ) {
    return `${source.name} has no documented cross-domain flow to ${target.name}`;
  }

  return null;
}

export function requiredTagErrors(project) {
  const tags = project.tags ?? [];
  const errors = [];
  if (!tags.some((tag) => tag.startsWith('scope:'))) errors.push('missing scope:* tag');
  if (!tags.some((tag) => tag.startsWith('type:'))) errors.push('missing type:* tag');
  return errors;
}

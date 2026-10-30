const documentedCrossDomainFlows = new Set([
  'admin-orders-feature->admin-products-data-access',
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
  'site-home-feature->site-catalog-ui',
]);

function valueFor(tags, prefix) {
  return tags.find((tag) => tag.startsWith(prefix))?.slice(prefix.length);
}

export function validateProjectBoundary(source, target) {
  const sourceTags = source.tags ?? [];
  const targetTags = target.tags ?? [];
  const sourceType = valueFor(sourceTags, 'type:');
  const targetType = valueFor(targetTags, 'type:');
  const sourceDomain = valueFor(sourceTags, 'domain:');
  const targetDomain = valueFor(targetTags, 'domain:');

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

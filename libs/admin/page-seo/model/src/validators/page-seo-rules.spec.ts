import { pageSeoIssues } from './page-seo-rules';

const empty = { titleUk: '', titleRu: '', descriptionUk: '', descriptionRu: '' };

describe('pageSeoIssues', () => {
  it('accepts empty fields: the site keeps its own texts', () => {
    expect(pageSeoIssues(empty)).toEqual({});
  });

  it('names only the fields over the backend limit', () => {
    expect(
      pageSeoIssues({ ...empty, titleRu: 'a'.repeat(121), descriptionUk: ` ${'a'.repeat(300)} ` }),
    ).toEqual({ titleRu: 'Не більше 120 символів.' });
  });
});

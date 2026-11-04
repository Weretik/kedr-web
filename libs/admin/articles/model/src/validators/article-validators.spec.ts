import { articleCoverFileError } from './article-cover-rules';
import { validateArticleDraft } from './article-rules';
import { newArticleDraft } from '../forms/article-draft';

const filled = () => {
  const draft = newArticleDraft(new Date('2026-11-04T10:00:00Z'));
  for (const language of ['uk', 'ru'] as const)
    draft.texts[language] = { title: 'Петлі', excerpt: 'Коротко.', bodyHtml: '<p>Текст</p>' };
  return draft;
};

describe('validateArticleDraft', () => {
  it('accepts a new article without a slug and requires one on edit', () => {
    expect(newArticleDraft(new Date('2026-11-04T10:00:00Z')).publishedOn).toBe('2026-11-04');
    expect(validateArticleDraft(filled(), { slugRequired: false })).toBeUndefined();
    expect(validateArticleDraft(filled(), { slugRequired: true })?.slug).toBe('Вкажіть адресу.');
  });

  it('rejects a bad slug and empty texts per language', () => {
    const draft = { ...filled(), slug: 'Bad Slug' };
    draft.texts.ru = { title: ' ', excerpt: '', bodyHtml: '<p></p>' };

    const errors = validateArticleDraft(draft, { slugRequired: false });

    expect(errors?.slug).toContain('латинські');
    expect(errors?.texts?.uk).toBeUndefined();
    expect(errors?.texts?.ru).toEqual({
      title: 'Вкажіть заголовок.',
      excerpt: 'Вкажіть короткий опис.',
      bodyHtml: 'Напишіть текст статті.',
    });
  });
});

describe('articleCoverFileError', () => {
  it('accepts a web picture within the size limit', () => {
    expect(articleCoverFileError({ type: 'image/webp', size: 1024 })).toBeUndefined();
  });

  it('rejects other types and large files', () => {
    expect(articleCoverFileError({ type: 'image/gif', size: 1024 })).toMatch(/JPEG/);
    expect(articleCoverFileError({ type: 'image/png', size: 11 * 1024 * 1024 })).toMatch(/10 МБ/);
  });
});

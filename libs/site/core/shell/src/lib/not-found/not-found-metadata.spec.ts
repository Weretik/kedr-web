import { buildNotFoundMetadata } from './not-found-metadata';

describe('buildNotFoundMetadata', () => {
  it('names the missing page in the page language instead of the bare brand', () => {
    expect(buildNotFoundMetadata('uk').title).toBe('Сторінку не знайдено');
    expect(buildNotFoundMetadata('ru').title).toBe('Страница не найдена');
  });
});

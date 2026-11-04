import { galleryTextsIssues, moveGalleryItem, parseYoutubeId } from './gallery-rules';

describe('parseYoutubeId', () => {
  it.each([
    'https://www.youtube.com/watch?v=0FDRbSaQ9Ec',
    'https://www.youtube.com/watch?feature=share&v=0FDRbSaQ9Ec&t=42s',
    'https://youtu.be/0FDRbSaQ9Ec?si=abc',
    'youtu.be/0FDRbSaQ9Ec',
    'https://m.youtube.com/shorts/0FDRbSaQ9Ec',
    'https://www.youtube.com/embed/0FDRbSaQ9Ec',
    'https://www.youtube.com/live/0FDRbSaQ9Ec',
    ' 0FDRbSaQ9Ec ',
  ])('reads the ID from %s', (value) => {
    expect(parseYoutubeId(value)).toBe('0FDRbSaQ9Ec');
  });

  it.each([
    '',
    'https://vimeo.com/123',
    'https://www.youtube.com/@kedrclass2334',
    'javascript:alert(1)',
  ])('rejects %s', (value) => {
    expect(parseYoutubeId(value)).toBeNull();
  });
});

describe('gallery rules', () => {
  it('reports texts over the limits only', () => {
    expect(
      galleryTextsIssues({ titleUk: 'Так', titleRu: '', captionUk: '', captionRu: '' }),
    ).toEqual({});
    expect(
      galleryTextsIssues({
        titleUk: 'а'.repeat(151),
        titleRu: '',
        captionUk: '',
        captionRu: 'б'.repeat(501),
      }),
    ).toEqual({ titleUk: 'Не більше 150 символів.', captionRu: 'Не більше 500 символів.' });
  });

  it('moves one card and keeps the others in order', () => {
    expect(moveGalleryItem([1, 2, 3, 4], 3, 0)).toEqual([3, 1, 2, 4]);
    expect(moveGalleryItem([1, 2, 3, 4], 1, 9)).toEqual([2, 3, 4, 1]);
    expect(moveGalleryItem([1, 2, 3], 2, 1)).toEqual([1, 2, 3]);
  });
});

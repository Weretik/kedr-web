import { mapGallery, toGalleryTextsBody } from './gallery.mapper';

describe('gallery mapper', () => {
  it('turns missing texts into empty fields and back into nulls', () => {
    const [item] = mapGallery([
      {
        id: 1,
        kind: 'video',
        mediaFileId: null,
        youtubeId: '0FDRbSaQ9Ec',
        position: 0,
        titleUk: 'Петля',
        titleRu: null,
        captionUk: null,
        captionRu: null,
        previewUrl: 'https://i.ytimg.com/vi/0FDRbSaQ9Ec/hqdefault.jpg',
        fileName: null,
        fileMissing: false,
        updatedAt: '2026-11-04T00:00:00Z',
      },
    ]);
    expect(item.texts).toEqual({ titleUk: 'Петля', titleRu: '', captionUk: '', captionRu: '' });
    expect(toGalleryTextsBody({ ...item.texts, captionRu: '  ' })).toEqual({
      titleUk: 'Петля',
      titleRu: null,
      captionUk: null,
      captionRu: null,
    });
  });

  it('rejects a response of another shape', () => {
    expect(() => mapGallery([{ id: 1, kind: 'audio' }])).toThrow();
  });
});

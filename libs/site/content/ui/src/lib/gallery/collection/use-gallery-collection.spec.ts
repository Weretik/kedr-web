import { getGalleryDictionary } from '@site/content/model';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useGalleryCollection } from './use-gallery-collection';

import type { GalleryMedia } from '@site/content/model';

const image = { src: '/a.jpg', width: 10, height: 10, alt: '' };
const items: GalleryMedia[] = [
  { id: 'p1', title: 'Фото', kind: 'photo', image },
  { id: 'v1', title: 'Відео', kind: 'video', provider: 'youtube', youtubeId: 'x', poster: image },
];

describe('useGalleryCollection', () => {
  it('filters by kind and closes the open media when the filter changes', () => {
    const { result } = renderHook(() => useGalleryCollection(items, getGalleryDictionary('uk')));
    act(() => result.current.setActiveId('p1'));
    act(() => result.current.changeFilter('video'));
    expect(result.current.filtered.map((item) => item.id)).toEqual(['v1']);
    expect(result.current.activeId).toBeNull();
    expect(result.current.hasMore).toBe(false);
  });
});

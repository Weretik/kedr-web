import { DEFAULT_OG_IMAGE } from '@site/core/config';

import { applySharePicture } from './share-picture';

const picture = { url: 'https://images-kedr.cdn.express/og.jpg', width: 1200, height: null };

describe('applySharePicture', () => {
  it('replaces the default link-preview picture', () => {
    expect(applySharePicture({ openGraph: { images: [DEFAULT_OG_IMAGE] } }, picture)).toEqual({
      openGraph: { images: [{ url: picture.url, width: 1200, alt: DEFAULT_OG_IMAGE.alt }] },
    });
  });

  it('keeps a page picture of its own, and the default without an admin picture', () => {
    const own = { openGraph: { images: [{ url: 'https://images-kedr.cdn.express/p.jpg' }] } };
    expect(applySharePicture(own, picture)).toBe(own);

    const page = { openGraph: { images: [DEFAULT_OG_IMAGE] } };
    expect(applySharePicture(page, null)).toBe(page);
  });
});

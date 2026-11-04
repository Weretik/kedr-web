import { useLazyPreviewYoutubeVideoQuery } from '@admin/gallery/data-access';
import { emptyGalleryTexts, galleryTextsFromTitle, parseYoutubeId } from '@admin/gallery/model';
import { useEffect, useState } from 'react';

import type { GalleryTexts, YoutubePreview } from '@admin/gallery/model';
import type { YoutubeLinkState } from '@admin/gallery/ui';

const checkDelayMs = 350;

type Checked = { youtubeId: string; preview: YoutubePreview | null };

/**
 * The add-video dialog state: the pasted link is checked locally at once, then the backend gives the poster and
 * YouTube's title, which fills both title fields once per video.
 */
export function useYoutubeLink() {
  const [link, setLink] = useState('');
  const [texts, setTexts] = useState<GalleryTexts>(emptyGalleryTexts);
  const [checked, setChecked] = useState<Checked | null>(null);
  const [preview] = useLazyPreviewYoutubeVideoQuery();
  const youtubeId = parseYoutubeId(link);

  useEffect(() => {
    if (!youtubeId) return;
    let active = true;
    const timer = setTimeout(() => {
      preview(youtubeId, true)
        .unwrap()
        .then((result) => {
          if (!active) return;
          setChecked({ youtubeId, preview: result });
          setTexts(galleryTextsFromTitle(result.title));
        })
        .catch(() => {
          if (active) setChecked({ youtubeId, preview: null });
        });
    }, checkDelayMs);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [preview, youtubeId]);

  let state: YoutubeLinkState;
  if (!link.trim()) state = { status: 'empty' };
  else if (!youtubeId) state = { status: 'invalid' };
  else if (checked?.youtubeId !== youtubeId) state = { status: 'checking' };
  else
    state = checked.preview ? { status: 'ready', preview: checked.preview } : { status: 'failed' };

  const reset = () => {
    setLink('');
    setTexts(emptyGalleryTexts);
    setChecked(null);
  };

  return { link, setLink, texts, setTexts, state, reset };
}

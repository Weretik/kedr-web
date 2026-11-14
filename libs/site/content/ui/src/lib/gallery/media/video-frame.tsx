import { Button } from '@site/shared/ui';
import { ExternalLinkIcon, RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import type { GalleryDictionary, GalleryVideo } from '@site/content/model';

type VideoFrameProps = {
  video: GalleryVideo;
  dictionary: Pick<GalleryDictionary, 'videoHelp' | 'retryVideo' | 'watchOriginal'>;
};

/** The selected iframe is the only external player; recovery does not infer cross-origin availability. */
export function VideoFrame({ video, dictionary }: VideoFrameProps) {
  const [attempt, setAttempt] = useState(0);
  const validProvider = video.provider === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(video.youtubeId);
  const encodedId = encodeURIComponent(video.youtubeId);
  const originalUrl = `https://www.youtube.com/watch?v=${encodedId}`;

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        {validProvider && (
          <iframe
            key={`${video.id}:${video.youtubeId}:${attempt}`}
            title={video.title}
            src={`https://www.youtube.com/embed/${encodedId}?autoplay=0&rel=0`}
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        )}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{dictionary.videoHelp}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!validProvider}
          onClick={() => setAttempt((value) => value + 1)}
          className="h-auto min-h-11 max-w-full rounded-lg py-2 text-left leading-snug whitespace-normal motion-reduce:transition-none"
        >
          <RotateCwIcon aria-hidden="true" strokeWidth={1.75} />
          {dictionary.retryVideo}
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto min-h-11 max-w-full rounded-lg py-2 text-left leading-snug whitespace-normal motion-reduce:transition-none"
        >
          <a href={originalUrl} target="_blank" rel="noopener noreferrer">
            {dictionary.watchOriginal}
            <ExternalLinkIcon aria-hidden="true" strokeWidth={1.75} />
          </a>
        </Button>
      </div>
    </div>
  );
}

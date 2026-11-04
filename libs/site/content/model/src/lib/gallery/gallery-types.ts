/** A media-library photo on the CDN or a YouTube poster, with its intrinsic size for next/image. */
export type GalleryImage = Readonly<{
  src: string;
  width: number;
  height: number;
  alt: string;
}>;

type GalleryMediaDetails = Readonly<{
  id: string;
  title: string;
  caption?: string;
}>;

export type GalleryPhoto = GalleryMediaDetails &
  Readonly<{
    kind: 'photo';
    image: GalleryImage;
  }>;

export type GalleryVideo = GalleryMediaDetails &
  Readonly<{
    kind: 'video';
    provider: 'youtube';
    youtubeId: string;
    poster: GalleryImage;
  }>;

/** Only the selected locale is passed to the browser; the admin arranges the cards. */
export type GalleryMedia = GalleryPhoto | GalleryVideo;
export type GalleryFilter = 'all' | GalleryMedia['kind'];

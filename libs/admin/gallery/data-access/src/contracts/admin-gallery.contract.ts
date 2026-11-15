import type { components } from '@shared/api-contracts';

export type AdminGalleryItemDto = components['schemas']['AdminGalleryItemResponse'];
export type GalleryTextsBody = components['schemas']['UpdateGalleryItemRequest'];
export type AddGalleryVideoBody = components['schemas']['AddGalleryVideoRequest'];
export type AddGalleryPhotosBody = components['schemas']['AddGalleryPhotosRequest'];
export type ReorderGalleryBody = components['schemas']['ReorderGalleryRequest'];

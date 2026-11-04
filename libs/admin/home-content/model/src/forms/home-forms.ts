import type { HomeBrand, HomeFaqTexts } from '../entities/home-blocks';

export const emptyHomeFaqTexts: HomeFaqTexts = {
  questionUk: '',
  questionRu: '',
  answerUk: '',
  answerRu: '',
};

/** The logo chosen in the brand dialog: a media library file. */
export interface HomeBrandLogo {
  mediaFileId: number;
  url: string | null;
  fileName: string | null;
}

/** What the brand dialog edits; the logo is empty until a file is picked or uploaded. */
export interface HomeBrandDraft {
  name: string;
  logo: HomeBrandLogo | null;
}

export const emptyHomeBrandDraft: HomeBrandDraft = { name: '', logo: null };

export const homeBrandDraftFrom = (brand: HomeBrand): HomeBrandDraft => ({
  name: brand.name,
  logo: brand.logoMissing
    ? null
    : { mediaFileId: brand.logoMediaFileId, url: brand.logoUrl, fileName: brand.logoFileName },
});

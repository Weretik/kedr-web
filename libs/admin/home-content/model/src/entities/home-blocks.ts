/** Question and answer of one home page FAQ entry in both site languages; all four are required. */
export interface HomeFaqTexts {
  questionUk: string;
  questionRu: string;
  answerUk: string;
  answerRu: string;
}

/** One question of the home page FAQ as the admin sees it. */
export interface HomeFaqItem {
  id: number;
  position: number;
  texts: HomeFaqTexts;
  updatedAt: string;
}

/** One brand of the home page logo row. */
export interface HomeBrand {
  id: number;
  position: number;
  name: string;
  logoMediaFileId: number;
  /** CDN picture; null when the logo file was deleted from the media library. */
  logoUrl: string | null;
  logoFileName: string | null;
  /** The logo file was deleted: the site hides this brand. */
  logoMissing: boolean;
  updatedAt: string;
}

/** Both editable lists of the home page, in site order. */
export interface HomeBlocks {
  faq: HomeFaqItem[];
  brands: HomeBrand[];
}

/** Matches the backend limits. */
export const homeQuestionMaxLength = 200;
export const homeAnswerMaxLength = 2000;
export const homeBrandNameMaxLength = 100;

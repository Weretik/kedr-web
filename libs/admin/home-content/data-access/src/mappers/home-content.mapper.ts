import { adminHomeBlocksSchema } from '../validators/home-content.schemas';

import type { HomeBrandBody, HomeFaqItemBody } from '../contracts/admin-home-content.contract';
import type {
  HomeBlocks,
  HomeBrandDraft,
  HomeBrandLogo,
  HomeFaqTexts,
} from '@admin/home-content/model';

export const mapHomeBlocks = (response: unknown): HomeBlocks => {
  const { brands, faq } = adminHomeBlocksSchema.parse(response);
  return {
    faq: faq.map(({ answerRu, answerUk, questionRu, questionUk, ...item }) => ({
      ...item,
      texts: { questionUk, questionRu, answerUk, answerRu },
    })),
    brands,
  };
};

export const toHomeFaqBody = (texts: HomeFaqTexts): HomeFaqItemBody => ({
  questionUk: texts.questionUk.trim(),
  questionRu: texts.questionRu.trim(),
  answerUk: texts.answerUk.trim(),
  answerRu: texts.answerRu.trim(),
});

/** Only a draft with a logo reaches the request; the dialog does not save without one. */
export const toHomeBrandBody = (
  draft: HomeBrandDraft & { logo: HomeBrandLogo },
): HomeBrandBody => ({
  name: draft.name.trim(),
  logoMediaFileId: draft.logo.mediaFileId,
});

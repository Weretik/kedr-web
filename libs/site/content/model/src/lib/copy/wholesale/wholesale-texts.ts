import type { WholesaleDictionary, WholesaleTexts } from './wholesale-types';

/** The dictionary with the admin's copy in place; without texts the code copy stays as it is. */
export function applyWholesaleTexts(
  dictionary: WholesaleDictionary,
  texts: WholesaleTexts | null,
): WholesaleDictionary {
  if (!texts) return dictionary;

  return {
    ...dictionary,
    hero: {
      ...dictionary.hero,
      title: texts.heroTitle,
      lead: texts.heroLead,
      contactTitle: texts.contactCardTitle,
      contactNote: texts.contactCardNote,
    },
    assortment: {
      ...dictionary.assortment,
      title: texts.assortmentTitle,
      intro: texts.assortmentIntro,
    },
    company: {
      ...dictionary.company,
      title: texts.companyTitle,
      text: texts.companyText,
      selection: { title: texts.selectionTitle, text: texts.selectionText },
      warehouse: { title: texts.warehouseTitle, text: texts.warehouseText },
    },
    steps: { title: texts.stepsTitle, items: texts.steps },
    faq: { title: texts.faqTitle, items: texts.faq },
    contact: { ...dictionary.contact, title: texts.closingTitle },
  };
}

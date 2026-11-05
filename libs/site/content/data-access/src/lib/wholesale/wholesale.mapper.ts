import type { components } from '@shared/api-contracts';
import type { WholesaleTexts } from '@site/content/model';

type WholesaleText = components['schemas']['WholesaleText'];
type WholesaleStep = components['schemas']['WholesaleStep'];

/** API texts → the page copy; null when the shape does not fit the page (three steps, at least one question). */
export function toWholesaleTexts(text: WholesaleText): WholesaleTexts | null {
  const [first, second, third] = text.steps;
  if (text.steps.length !== 3 || !first || !second || !third || !text.faq.length) return null;

  return {
    heroTitle: text.heroTitle,
    heroLead: text.heroLead,
    contactCardTitle: text.contactCardTitle,
    contactCardNote: text.contactCardNote,
    assortmentTitle: text.assortmentTitle,
    assortmentIntro: text.assortmentIntro,
    companyTitle: text.companyTitle,
    companyText: text.companyText,
    selectionTitle: text.selectionTitle,
    selectionText: text.selectionText,
    warehouseTitle: text.warehouseTitle,
    warehouseText: text.warehouseText,
    stepsTitle: text.stepsTitle,
    steps: [toStep(first), toStep(second), toStep(third)],
    faqTitle: text.faqTitle,
    faq: text.faq.map(({ question, answer }) => ({ question, answer })),
    closingTitle: text.closingTitle,
  };
}

function toStep({ title, text }: WholesaleStep): WholesaleTexts['steps'][number] {
  return { title, text };
}

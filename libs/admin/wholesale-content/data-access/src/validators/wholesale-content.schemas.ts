import { z } from 'zod';

const text = z.string();

export const wholesaleTextSchema = z.object({
  language: z.enum(['uk', 'ru']),
  heroTitle: text,
  heroLead: text,
  contactCardTitle: text,
  contactCardNote: text,
  assortmentTitle: text,
  assortmentIntro: text,
  companyTitle: text,
  companyText: text,
  selectionTitle: text,
  selectionText: text,
  warehouseTitle: text,
  warehouseText: text,
  stepsTitle: text,
  steps: z.array(z.object({ title: text, text })),
  faqTitle: text,
  faq: z.array(z.object({ question: text, answer: text })),
  closingTitle: text,
});

export const adminWholesalePageSchema = z.object({
  texts: z.array(wholesaleTextSchema).length(2),
  updatedAt: z.string().min(1),
  updatedBy: z.string().nullable(),
});

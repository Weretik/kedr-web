/** A code in 1C names nobody has decoded or confirmed («Не розшифровані коди»). */
export interface UnresolvedCode {
  aliasId: number;
  attributeId: number;
  attributeName: string;
  scope: string;
  rawValue: string;
  /** An assistant's guess, not confirmed yet. */
  valueId: number | null;
  valueName: string | null;
  isConfirmed: boolean;
  note: string | null;
  /** Products whose review mentions the code. */
  productCount: number;
  /** What the code means for all products (spec catalog/009), its own attribute first. */
  meanings: readonly CodeMeaning[];
}

/** One thing a code means: a value of an attribute (spec catalog/009). */
export interface CodeMeaning {
  attributeId: number;
  attributeName: string;
  valueId: number;
  valueName: string;
}

/**
 * The owner's decoding. `meanings`, when given, is the whole decoding (spec catalog/009): values of any attributes,
 * empty when the code means nothing to filter by; it replaces `valueId`, a value of the code's own attribute.
 * `applyToAll: false` keeps the code undecided for all products; `categories`, when given, is the whole list of
 * its own decodings per category (spec catalog/008).
 */
export interface CodeDecision {
  valueId: number | null;
  applyToAll?: boolean;
  categories?: readonly CodeCategoryDecision[];
  meanings?: readonly CodeMeaningChoice[];
}

/** The decoding of a code in one category; `meanings` replaces `valueId` when given. */
export interface CodeCategoryDecision {
  categoryId: number;
  valueId: number | null;
  meanings?: readonly CodeMeaningChoice[];
}

/** A chosen meaning: a value of an attribute. */
export interface CodeMeaningChoice {
  attributeId: number;
  valueId: number;
}

/** A product whose original 1C name contains the code. */
export interface CodeProduct {
  productId: number;
  name: string;
  photo: string;
}

/** A category where the code occurs, with its own decoding there when it has one. */
export interface CodeCategory {
  categoryId: number;
  categoryPath: string;
  hasOwnValue: boolean;
  valueId: number | null;
  valueName: string | null;
  products: readonly CodeProduct[];
  /** The category's own decoding (spec catalog/009); empty without one. */
  meanings: readonly CodeMeaning[];
}

/** Where a code occurs: on-site products by category, most products first. */
export interface CodeProducts {
  aliasId: number;
  rawValue: string;
  categories: readonly CodeCategory[];
}

/** A meaning row being edited: an attribute and, once chosen, its value. */
export interface MeaningDraft {
  attributeId: number | null;
  valueId: number | null;
}

/**
 * The decoding being edited for all products: «нічого не означає», or the meaning rows; without a complete row the
 * code stays undecided for all.
 */
export interface MeaningsDraft {
  nothing: boolean;
  rows: readonly MeaningDraft[];
}

/** The decoding being edited in one category: follow the one for all, its own meanings, or nothing. */
export interface CategoryMeaningsDraft {
  mode: 'inherit' | 'own' | 'none';
  rows: readonly MeaningDraft[];
}

export interface CodeDecisionResult {
  code: UnresolvedCode;
  /** Product values confirmed at once. */
  valuesConfirmed: number;
}

/** What the admin is told after a decision. */
export function codeDecisionNotice(result: CodeDecisionResult): string {
  const confirmed =
    result.valuesConfirmed > 0 ? `Підтверджено значень у товарах: ${result.valuesConfirmed}. ` : '';
  return `Код «${result.code.rawValue}» збережено. ${confirmed}Нові розшифровки потраплять у товари під час наступного розпізнавання.`;
}

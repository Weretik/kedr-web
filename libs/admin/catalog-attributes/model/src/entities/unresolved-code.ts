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
}

/**
 * The owner's decoding: a value of the code's attribute, or no value (the code means nothing to filter by).
 * `applyToAll: false` keeps the code undecided for all products; `categories`, when given, is the whole list of
 * its own decodings per category (spec catalog/008).
 */
export interface CodeDecision {
  valueId: number | null;
  applyToAll?: boolean;
  categories?: readonly CodeCategoryDecision[];
}

/** The decoding of a code in one category: a value, or `null` when the code means nothing there. */
export interface CodeCategoryDecision {
  categoryId: number;
  valueId: number | null;
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
}

/** Where a code occurs: on-site products by category, most products first. */
export interface CodeProducts {
  aliasId: number;
  rawValue: string;
  categories: readonly CodeCategory[];
}

/** A picker choice: follow the decoding for all, no value, or a value id. */
export type CodeChoice = 'inherit' | 'none' | `${number}`;

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

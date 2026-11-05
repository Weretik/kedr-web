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

/** The owner's decoding: a value of the code's attribute, or no value (the code means nothing to filter by). */
export interface CodeDecision {
  valueId: number | null;
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

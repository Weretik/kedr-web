export type CheckoutField = 'firstName' | 'phone' | 'comment';
export type CheckoutFieldErrors = Partial<Record<CheckoutField, string[]>>;
export type CheckoutFieldCode = 'required' | 'too-short' | 'too-long' | 'invalid-phone';

export interface CheckoutDraft {
  firstName: string;
  phone: string;
  /** Optional note from the buyer; at most `CHECKOUT_COMMENT_MAX_LENGTH` characters. */
  comment?: string;
}

export interface CheckoutCommandLine {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutCommand extends CheckoutDraft {
  lines: CheckoutCommandLine[];
  /**
   * One UUID per order attempt, sent as `Idempotency-Key`: a retry of the same order reuses it, so the backend
   * answers with the first order instead of placing a second one.
   */
  requestKey?: string;
}

export type CheckoutResult =
  | { kind: 'created'; orderId: string }
  | { kind: 'validation'; fieldErrors: CheckoutFieldErrors; messages: string[] }
  | { kind: 'conflict' | 'uncertain'; messages: string[] };

export type CheckoutCommandIssue =
  'invalid-command' | 'empty-cart' | 'invalid-line' | 'duplicate-product';

export type CheckoutCommandParseResult =
  | { ok: true; command: CheckoutCommand }
  | { ok: false; fieldErrors: CheckoutFieldErrors; issues: CheckoutCommandIssue[] };

export type CheckoutField = 'firstName' | 'phone';
export type CheckoutFieldErrors = Partial<Record<CheckoutField, string[]>>;
export type CheckoutFieldCode = 'required' | 'too-short' | 'too-long' | 'invalid-phone';

export interface CheckoutDraft {
  firstName: string;
  phone: string;
}

export interface CheckoutCommandLine {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutCommand extends CheckoutDraft {
  lines: CheckoutCommandLine[];
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

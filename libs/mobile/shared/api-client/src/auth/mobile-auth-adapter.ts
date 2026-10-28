/**
 * Connects the HTTP client to the session owner (core auth) without a reverse dependency:
 * the client asks for the access token and for one refresh when the API answers 401.
 */
export interface MobileAuthAdapter {
  getAccessToken: () => string | null;
  /** Rotates the token pair; resolves the new access token or null when the session has ended. */
  refreshAccessToken: () => Promise<string | null>;
  onUnauthenticated: () => void;
}

let adapter: MobileAuthAdapter | undefined;

export function configureMobileAuth(nextAdapter: MobileAuthAdapter | undefined): void {
  adapter = nextAdapter;
}

export function getMobileAuth(): MobileAuthAdapter | undefined {
  return adapter;
}

export interface PendingRequest {
  signature: string;
  key: string;
}

export function keyForRequest(
  reference: { current: PendingRequest | null },
  signature: string,
): string {
  if (reference.current?.signature !== signature)
    reference.current = { signature, key: crypto.randomUUID() };
  return reference.current.key;
}

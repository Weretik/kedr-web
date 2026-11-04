/** Header KedrStore sends with the shared secret. */
export const REVALIDATE_SECRET_HEADER = 'x-revalidate-secret';

/** The cache tags a refresh may drop: everything from the Content module and the catalog. */
export const REVALIDATABLE_TAGS = ['content', 'catalog'] as const;

export type RevalidatableTag = (typeof REVALIDATABLE_TAGS)[number];

export interface RevalidateRequestOptions {
  /** Null when the site has no secret: the endpoint is off. */
  secret: string | null;
  /** Drops one cache tag; the route passes Next.js `revalidateTag`. */
  revalidate: (tag: RevalidatableTag) => void;
}

const json = (status: number, body: unknown) => Response.json(body, { status });

/** Compares without stopping at the first different character, so timing does not reveal the secret. */
function sameSecret(given: string, expected: string): boolean {
  let difference = given.length ^ expected.length;
  for (let index = 0; index < expected.length; index += 1)
    difference |= (given.charCodeAt(index) || 0) ^ expected.charCodeAt(index);
  return difference === 0;
}

const isRevalidatableTag = (value: unknown): value is RevalidatableTag =>
  typeof value === 'string' && (REVALIDATABLE_TAGS as readonly string[]).includes(value);

async function readTags(request: Request): Promise<RevalidatableTag[] | null> {
  try {
    const body: unknown = await request.json();
    const tags = (body as { tags?: unknown } | null)?.tags;
    if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isRevalidatableTag)) return null;
    return [...new Set(tags)];
  } catch {
    return null;
  }
}

/**
 * «Оновити сайт зараз» from KedrStore: checks the shared secret, then drops the requested cache tags so the next
 * visit reads fresh data. 503 when the site has no secret, 401 for a wrong one, 400 for unknown tags.
 */
export async function handleRevalidateRequest(
  request: Request,
  { revalidate, secret }: RevalidateRequestOptions,
): Promise<Response> {
  if (!secret) return json(503, { error: 'Cache refresh is not configured.' });
  const given = request.headers.get(REVALIDATE_SECRET_HEADER) ?? '';
  if (!sameSecret(given, secret)) return json(401, { error: 'Wrong secret.' });

  const tags = await readTags(request);
  if (!tags)
    return json(400, { error: `Send {"tags": [...]} with ${REVALIDATABLE_TAGS.join(', ')}.` });

  for (const tag of tags) revalidate(tag);
  return json(200, { revalidated: tags });
}

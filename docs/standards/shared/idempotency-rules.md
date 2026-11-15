# Idempotency rules: repeated submits

**Applies to:** every mutation the client sends: admin forms and actions, public site forms, mobile and offline queues.
**Backend side:** [KedrStore idempotency rules](https://github.com/Weretik/KedrStore/blob/master/docs/sdd/standards/idempotency-rules.md) decides which operations take a key and what a repeat answers. This file says what the client does.

A request can reach the server twice without anyone meaning to: a double press, a retry after a timeout, a lost answer on a weak network, an offline queue sending again after a restart. The client cannot know whether the first copy was saved, so it must make the repeat safe instead of guessing. Kedr and Brevi use this text verbatim; only the specifics and known deviations below differ.

## 1. Attempt key

- **When.** Every mutation whose backend operation takes an idempotency key (header `Idempotency-Key` or body field `requestId`; the contract says which) sends one.
- **One key per attempt.** Make the key (`crypto.randomUUID()`) when the form opens or on the first submit of a payload, and keep it in the feature's state next to the payload it belongs to.
- **Reuse** the same key for every repeat of that attempt: a second press, a retry after a network error, a timeout, a 5xx, or an "unknown outcome" answer.
- **Renew** it after a success (the next order is a new attempt), after a 409 `idempotency_conflict` or another business conflict, and when the person changes the payload (compare the serialized payload; a changed payload is a new attempt).
- **Never** make the key inside a retry loop, in a server action or route handler on the server (every call would make a new one), or from the payload itself (two identical real orders must stay two orders).
- **Server actions and proxies** (Next.js) receive the key from the browser, check that it is a UUID, and pass it through to the API unchanged.
- **Offline and mobile queues** store the key with the queue entry when it is queued; every send of that entry uses it.

## 2. Pending lock

- The submit control is disabled while the request runs, and the store or hook keeps one in-flight promise, so a second press joins the first instead of starting a new request. This is required for **every** mutation, keyed or not.
- Do not let data change while an attempt is pending (or start a new attempt when it does).

## 3. Retries

- Automatic retry of a mutation is allowed only when the operation is idempotent (a key, a `PUT` of a target value, a delete). Turn off library retries for any other mutation (`retry: 0` / no `retryCondition`).
- After an unknown outcome, show a calm message ("we could not confirm; try again") and let the person retry with the same key; never tell them it failed when it may have succeeded.

## 4. Answers

- A repeat answers like the first request (the same id or the saved resource): treat it as success.
- 409 `idempotency_conflict` (or the project's conflict problem for the same key with other data): show the Ukrainian message, renew the key, and let the person reload or resend.
- 409 "stale" for a versioned edit: reload the record; do not resend blindly.

## 5. Tests

- Two quick submits make one request (pending lock).
- A retry after an unknown outcome sends the same key; a changed payload, a success, or a conflict makes a new key.
- The transport sends the key in the header or field the contract names, and only when it has one.
- An offline queue entry keeps its key across restarts.

## 6. Check (audits)

- Every mutation whose contract takes a key sends it, made once per attempt by the rules above.
- Every submit control has a pending lock; no library retries on non-idempotent mutations.
- No key is made on the server side of a form, in a retry loop, or from the payload.

## Kedr Web specifics

| Client                 | Mutation                                            | Key                                                                                                 | Where                                                                                                                                                                                                                                                                             |
| ---------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin                  | Create order, save new draft (`/orders/new`)        | `Idempotency-Key`, kept per pending payload and reused while the payload is the same                | [idempotency-key.ts](../../../libs/admin/orders/feature/src/state/idempotency-key.ts), [use-submit-order.ts](../../../libs/admin/orders/feature/src/hooks/editor/use-submit-order.ts), [use-save-draft.ts](../../../libs/admin/orders/feature/src/hooks/editor/use-save-draft.ts) |
| Mobile «Кедр Менеджер» | Send order to 1C, save draft from the offline queue | `Idempotency-Key` made when the entry is queued and stored with it                                  | [outbox-entry.ts](../../../libs/mobile/calculation/model/src/entities/outbox-entry.ts), [outbox-runner.ts](../../../libs/mobile/calculation/data-access/src/sync/outbox-runner.ts)                                                                                                |
| Site                   | Quick order (`/{locale}/checkout`)                  | `requestKey` per attempt in the cart store, passed through the Server Function as `Idempotency-Key` | [cart-client-store.ts](../../../libs/site/cart/feature/src/lib/state/cart-client-store.ts), [site-order-api.ts](../../../libs/site/shared/api-client/src/lib/site-order-api.ts)                                                                                                   |

Every other Admin mutation (work tasks, content, catalog, media, users) relies on the pending lock: RTK Query does not retry mutations and the hooks disable their actions while a request runs. The backend's audit lists why each of them is safe without a key.

## Known deviations

None open.

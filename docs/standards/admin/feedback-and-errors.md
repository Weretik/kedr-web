# Admin feedback and error messages

These rules keep errors and confirmations in the same place and wording on every Admin screen, so a manager notices them on a phone as well as on a wide monitor.

## Where a message goes

| Situation                                                                                | Where                                                                                                | Component                                                                                                           |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| A field or table row is wrong (format, limit, a discount that takes the price below 1 ₴) | Right under the field, the field and the row turn red; shown while typing, before any request        | MUI `TextField` `error`/`helperText`; row tint from `error.main`                                                    |
| An action is blocked or a request failed (price calculation, submit, save)               | A pinned block at the top of the content, under the top bar; it stays visible while the page scrolls | [`PageIssues`](../../../libs/admin/shared/ui/src/lib/feedback/page-issues.tsx)                                      |
| An action succeeded and the page changed (order created, draft saved)                    | A short notice at the top centre of the screen, closes by itself after 4 s                           | [`NoticeSnackbar`](../../../libs/admin/shared/ui/src/lib/feedback/notice-snackbar.tsx), passed on with `withNotice` |
| A page or section failed to load                                                         | In place of the content, with «Повторити»                                                            | `Alert` with an action ([list and detail pages](list-detail-pages.md))                                              |
| Something is being calculated or saved                                                   | Next to the action that waits for it                                                                 | `Alert severity="info"` or a progress indicator                                                                     |

- Never place the only copy of a blocking error at the bottom of the page or only next to a disabled button.
- Do not show a blocking error in a snackbar: it disappears before the manager acts on it.
- After a failed submit from a dialog, bring the pinned block into view (`revealKey`).
- One problem is one sentence; several problems are a list in the same block, never several stacked alerts.

## How a message is written

- Ukrainian, plain words, no codes, HTTP statuses, or English server text.
- Say what is wrong with what, then what to do: «Ціна «Ручка KEDR» після знижки 0,50 ₴, а має бути щонайменше 1,00 ₴ за шт. Найбільша знижка — 156,50 ₴.»
- Name the product, customer, or field and give the allowed limit when there is one.
- Money is formatted with `uk-UA` currency formatting (`1 234,50 ₴`); a discount is shown with a minus in red, a markup with a plus in green.
- Use the server's message only for business codes it words for the manager in Ukrainian (in orders: `unavailable_product`, `price_below_minimum`, `invalid_price_adjustment`); map every other code to a Ukrainian sentence in the feature (for example [quote errors](../../../libs/admin/orders/feature/src/errors/quote-error-message.ts)) and fall back to a general sentence with a next step.

## Client and server checks

A rule the client can check (format, range, minimum price) is checked while the manager types and again on the server; the server stays the authority and returns the same wording. Business limits live once in the model (for example `minDiscountedUnitPrice` and `adjustedPriceIssue` in [price-adjustment](../../../libs/admin/orders/model/src/price-adjustment.ts)) and match the backend constant.

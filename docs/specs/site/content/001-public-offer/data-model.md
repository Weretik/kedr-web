# Presentation model

Owner: existing `site-content-model`. No API DTO, persisted entity, user input or remote loader is added.

## Localized document

Use a readonly `PublicOfferDictionary`, returned by `getPublicOfferDictionary(locale)`, with short H1, original full title, navigation/action labels, seven ordered sections and the complete final note.

Each section has a stable locale-independent ID, complete display heading (including the user-agreement parenthetical), short contents label and ordered source paragraphs. Paragraph strings keep their printed source numbers; do not regenerate numbering from array indices.

| Section                      | Stable target ID      |
| ---------------------------- | --------------------- |
| General terms / preamble     | `offer-general`       |
| Website use / user agreement | `offer-site-use`      |
| Price and payment            | `offer-payment`       |
| Delivery and liability       | `offer-delivery`      |
| Returns                      | `offer-returns`       |
| Personal data                | `offer-personal-data` |
| Final provisions             | `offer-final`         |

The IDs are the same in UA/RU. Every contents target exists once. The note follows section 7 and is not an eighth numbered section.

## Ownership and transformations

Literal legal copy and UI labels live in separate cohesive files. Raw legal values are frozen against [the source baseline](design/source-baseline.json). Only heading capitalization/layout may change; no sentence, exception or source numbering may disappear.

The current-section client leaf receives only seven `{ id, label }` descriptors and its control labels, not the entire dictionary or legal body. Runtime current ID belongs to local UI state and is not persisted. The print leaf receives its localized label/hint only. Contact values are supplied from `core/config`, outside legal-copy ownership.

Tests compare every legal value/order to the independent baseline; this guards omissions rather than reproducing the mapper's implementation. Baseline data is test/documentation input and never a production dependency. No Storefront/Angular runtime import is allowed.

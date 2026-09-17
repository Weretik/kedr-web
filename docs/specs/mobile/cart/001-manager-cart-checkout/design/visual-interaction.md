# Mobile manager cart checkout — visual interaction contract

## Approved references

- Local screenshot:
  `C:/Users/D5F0~1/AppData/Local/Temp/ai-chat-attachment-18141120138475893592.png`.
- Existing screen/state: current Mobile catalog, product details and bottom
  navigation establish corporate theme and typography.
- Reference authority and date: user-provided composition reference,
  2026-09-17; it does not define colors, fonts, delivery or payment behavior.

## Anatomy

| Region/element    | User purpose                   | Existing primitive/token          | Constraints                                |
| ----------------- | ------------------------------ | --------------------------------- | ------------------------------------------ |
| Tab header        | Identify current area          | Existing Appbar/tab shell         | Ukrainian title «Кошик»                    |
| Product list      | Review order lines             | FlashList, Paper surface          | One scroll owner; stable keys              |
| Product row       | See image/name/price/amount    | Expo Image/Paper typography       | Corporate theme only                       |
| Quantity control  | Change integer quantity        | Paper IconButton/Text             | 48×48 targets; stock disabled state        |
| Delete action     | Remove line                    | Paper IconButton                  | Accessible label; no gesture-only action   |
| Summary           | See goods total                | Paper surface/typography          | No delivery, tax or payment rows           |
| Checkout action   | Start checkout                 | Paper Button                      | Disabled for empty/not-ready cart          |
| Checkout sheet    | Select customer/comment/submit | Existing ActionSheet pattern, RHF | Keyboard-safe; pending disables submit     |
| Customer selector | Search one customer            | ActionSheet, Searchbar, FlashList | Complete local dataset before search-ready |
| Receipt           | Confirm created order          | Paper text/status/action          | Shows order number and `Pending`           |

## Interaction matrix

| User action        | Initial state        | Observable result                    | Accessibility behavior                    |
| ------------------ | -------------------- | ------------------------------------ | ----------------------------------------- |
| Tap plus/minus     | Populated cart       | Quantity and totals update           | Announces new quantity; boundary disabled |
| Tap delete         | Populated cart       | Line disappears and total updates    | «Видалити <назва>»                        |
| Tap checkout       | Valid non-empty cart | Checkout sheet opens                 | Focus moves to sheet heading              |
| Tap customer field | Checkout sheet       | Selector opens                       | Announces dialog and current selection    |
| Type customer name | Customers loaded     | Matching names remain                | Result count/empty state readable         |
| Select customer    | Search results       | Field receives name; selector closes | Selected name announced                   |
| Submit             | Valid form           | Pending then receipt/error           | Busy state and result announced           |

## State matrix

| State                   | Visible content                   | Available actions         | Transition             |
| ----------------------- | --------------------------------- | ------------------------- | ---------------------- |
| Restoring               | Stable loader/skeleton            | none                      | storage completes      |
| Empty                   | Empty message                     | return to catalog via tab | product added          |
| Populated               | Lines, total, checkout            | quantity/delete/checkout  | user action            |
| Storage error           | Safe message and in-memory state  | retry where meaningful    | adapter succeeds       |
| Customer loading        | Search shell and loader           | close                     | all pages loaded/error |
| Customer empty/no match | Contextual message                | clear search/close        | query changes          |
| Checkout invalid        | Fields and inline errors          | correct/close             | values become valid    |
| Submitting              | Form with busy primary action     | close disabled            | response               |
| Submit error            | Preserved form/cart, safe message | retry/edit                | new attempt/success    |
| Success                 | Order number and `Pending`        | close/continue            | acknowledgement        |

## Layout variants

- Android/iOS: same information architecture using platform Paper behavior.
- Web: responsive smoke support; no desktop-specific checkout layout.
- Safe area/orientation: portrait is primary; landscape remains operable with
  scroll and visible action.
- Keyboard/focus: search/comment stays visible; closing nested selector returns
  focus to customer field.
- Scroll owner: cart FlashList on screen; customer FlashList inside selector.

## Visual accessibility

- Minimum touch target: 48×48.
- Disabled/error/selected states use text/icon semantics in addition to color.
- Text supports system scaling without clipping totals or actions.
- TalkBack/VoiceOver names icon-only controls and announces asynchronous states.
- Motion is limited to established sheet/navigation transitions.

## Deliberate differences

| Platform/state       | Difference                                   | Reason                                     |
| -------------------- | -------------------------------------------- | ------------------------------------------ |
| Reference screenshot | No address, tax, shipping or Pay Now         | Outside agreed manager-order scope         |
| Checkout             | Form opens in a bottom sheet                 | Agreed mobile flow and installed component |
| Customer field       | Searchable selector sheet, not compact popup | Reliable touch/search for 30–50 names      |

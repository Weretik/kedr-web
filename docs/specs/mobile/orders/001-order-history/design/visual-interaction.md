# Mobile order history — visual interaction contract

## Approved references

- Local screenshot: [order-history-reference.png](../research/order-history-reference.png).
- Existing screen/state: Mobile catalog establishes list pagination/refresh;
  Mobile cart establishes customer selection and read-only line composition;
  shell establishes Appbar, bottom navigation, Paper colors and typography.
- Reference authority and date: user-provided composition reference,
  2026-09-17. It defines card hierarchy only, not colors, fonts, status filters,
  hamburger navigation, tracking number, buttons or bottom tabs.

## Anatomy

| Region/element       | User purpose                    | Existing primitive/token            | Constraints                                       |
| -------------------- | ------------------------------- | ----------------------------------- | ------------------------------------------------- |
| Tab/Appbar           | Identify history and navigate   | Existing Tabs/Appbar                | «Замовлення» tab; «Історія замовлень» heading     |
| Customer filter      | Select one or all clients       | Paper Button/List.Item              | Top control; current name; 48×48 target           |
| Customer sheet       | Search/select active customer   | Existing ActionSheet/Searchbar/List | «Усі клієнти» first; loading/error/empty/retry    |
| History list         | Browse pages                    | FlashList                           | One scroll owner; stable `orderId` keys           |
| Order card           | Read summary and open detail    | Paper Surface/Card                  | Entire card pressable; no separate Details button |
| Status chip          | Read 1С sync state              | Paper Chip/theme semantic colors    | Ukrainian text; color plus text                   |
| List footer          | Load/retry next page            | Existing catalog footer pattern     | «Показати ще»; disabled while fetching            |
| Detail summary       | Identify order/client/status    | Paper typography/surface            | Read-only; Kyiv date and UAH                      |
| Detail lines         | Review ordered positions        | FlashList/scroll rows               | Name, quantity, line amount; no controls          |
| Optional detail data | Read comment/1С acknowledgement | Conditional sections                | Render only when non-empty/non-null               |

## Interaction matrix

| User action            | Initial state        | Observable result                          | Accessibility behavior                       |
| ---------------------- | -------------------- | ------------------------------------------ | -------------------------------------------- |
| Tap «Усі клієнти»/name | History visible      | Customer sheet opens                       | Dialog title and current selection announced |
| Type customer name     | Customers loaded     | Case-insensitive matching names remain     | Search field named «Пошук за назвою»         |
| Select customer        | Matching results     | Sheet closes; first filtered page replaces | Selected name announced                      |
| Select «Усі клієнти»   | Filter active        | Filter clears; all-orders page replaces    | Clear result announced                       |
| Pull down              | List visible         | First page refreshes with current filter   | Refresh busy state exposed                   |
| Tap «Показати ще»      | More pages available | Next page appends                          | Busy/disabled state exposed                  |
| Tap order card         | Card visible         | Read-only detail opens                     | «Відкрити замовлення <номер>»                |
| Use back               | Detail visible       | Prior history/filter returns               | Standard navigation announcement             |
| Tap retry              | Recoverable error    | Failed request repeats                     | Error text and retry action are named        |

## State matrix

| State                  | Visible content                           | Available actions             | Transition          |
| ---------------------- | ----------------------------------------- | ----------------------------- | ------------------- |
| Initial loading        | Stable history loader                     | none                          | page success/error  |
| Populated              | Filter, cards, optional footer            | filter/card/refresh/load more | user action         |
| Empty all              | «Замовлень ще немає»                      | refresh/filter                | data/filter changes |
| Empty filtered         | «Для цього клієнта замовлень не знайдено» | «Очистити фільтр»/refresh     | clear/data changes  |
| First-page error       | Safe error/offline message                | retry/filter                  | retry/filter        |
| Next-page error        | Existing cards and retry footer           | retry/refresh/cards           | retry/refresh       |
| Refreshing             | Existing list plus refresh indicator      | reading remains possible      | page result         |
| Customer loading/error | Sheet loader or safe message              | close/retry                   | load/retry          |
| Detail loading         | Stable detail loader                      | back                          | detail result/error |
| Detail populated       | Summary, lines, total, optional sections  | back                          | back                |
| Detail unavailable     | Safe error or not-found copy              | retry when recoverable/back   | retry/back          |

## Layout variants

- Android/iOS: same information hierarchy with platform Paper behavior.
- Web: centered responsive content width; no desktop table conversion.
- Safe area/orientation: portrait primary; landscape/compact height remains
  scrollable without hiding filter, footer or back action.
- Keyboard/focus: customer sheet avoids keyboard and restores focus on close.
- Scroll owner: history FlashList, customer sheet FlashList, detail vertical
  scroll; no simultaneous nested scrolling outside the active sheet.

## Visual accessibility

- Minimum effective touch target: 48×48.
- Status, selection, error and disabled states use readable text/role in
  addition to color.
- Text scaling must not clip order number, customer, status, positions or totals;
  date/amount may wrap without overlap.
- TalkBack/VoiceOver receives Ukrainian names, roles and busy/error changes.
- Motion is limited to existing sheet/navigation/loading transitions and
  respects platform reduced-motion behavior.

## Deliberate differences

| Platform/state       | Difference                                      | Reason                                 |
| -------------------- | ----------------------------------------------- | -------------------------------------- |
| Reference screenshot | No status tabs, tracking number or Details CTA  | Outside agreed scope; whole card opens |
| Reference screenshot | Corporate green/Paper theme and app typography  | Repository theme is authoritative      |
| Reference screenshot | Existing five-tab shell and centered Appbar     | App navigation is authoritative        |
| Detail               | Cart-like rows without quantity/delete controls | Detail is read-only                    |
| Dark theme           | Theme-derived surfaces/chips                    | No feature-local color constants       |

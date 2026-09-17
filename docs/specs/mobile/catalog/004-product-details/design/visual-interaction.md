# Mobile product details — visual interaction contract

## Approved references

- Local screenshot: [`product-details-reference.png`](../research/product-details-reference.png).
- Existing screen: `/(tabs)/catalog` product cards and current Paper theme.
- Reference authority: user-provided structural reference, 2026-09-15.
- The screenshot controls hierarchy only. Its orange palette, decorative blob,
  heart, floating arrow and English copy are deliberately excluded.

## Anatomy

| Region/element     | User purpose         | Existing primitive/token                          | Constraints                                    |
| ------------------ | -------------------- | ------------------------------------------------- | ---------------------------------------------- |
| Native header      | Return to catalog    | Expo Router Stack header                          | title «Товар», Back ≥48dp                      |
| Media region       | Inspect photo/scheme | `react-native-reanimated-carousel` + `expo-image` | neutral surface, `contain`, fixed aspect ratio |
| Pager indicator    | Know image position  | package `Pagination` + spoken position            | hidden for one image                           |
| Identity block     | Identify product     | Paper `Text`                                      | name first, compact `ID` secondary             |
| Price/availability | Decide if actionable | Paper typography and semantic text                | currency «грн.», non-color status              |
| Details section    | Read all API facts   | grouped label/value rows                          | stock, pack, category, slug, breadcrumbs       |
| Sticky action      | Add to cart          | Paper `Button` + `Snackbar`                       | bottom safe area, explicit disabled reason     |
| Page states        | Recover or leave     | shared state pattern                              | Ukrainian copy and one clear primary action    |

## Interaction matrix

| User action      | Initial state        | Observable result                 | Accessibility behavior              |
| ---------------- | -------------------- | --------------------------------- | ----------------------------------- |
| Tap product card | catalog result       | detail route opens                | card is a button named with product |
| Swipe gallery    | two valid images     | next/previous frame and indicator | announces kind and index            |
| Tap Back         | detail               | prior catalog context returns     | native back semantics               |
| Tap retry        | offline/error        | same request repeats              | button label «Спробувати ще раз»    |
| Tap add          | eligible product     | cart increments; Snackbar appears | announces successful addition       |
| Tap disabled add | unavailable/no price | no cart change                    | disabled state plus visible reason  |

## State matrix

| State                 | Visible content                    | Available actions               | Transition            |
| --------------------- | ---------------------------------- | ------------------------------- | --------------------- |
| Loading               | header, media/content skeleton     | Back                            | success/error/offline |
| Loaded/eligible       | gallery, all details, price, stock | Back, swipe, add                | cart confirmation     |
| Loaded/unavailable    | details and visible reason         | Back, swipe                     | none                  |
| Image partial failure | remaining valid frame              | Back, swipe if two remain       | per-image load result |
| Image total failure   | «Зображення недоступне»            | Back, add if otherwise eligible | product reload        |
| Not found             | «Товар не знайдено»                | return to catalog               | Back                  |
| Offline               | «Немає з’єднання з інтернетом»     | Back, retry                     | reconnect/retry       |
| Error                 | «Не вдалося завантажити товар»     | Back, retry                     | retry                 |
| Invalid link          | «Неправильне посилання на товар»   | return to catalog               | Back                  |

## Layout variants

- Android/iOS phone: single column, media near 4:3, details scroll under it,
  sticky full-width cart action above bottom safe area.
- Tablet/landscape: content centered with maximum readable width; no stretched
  full-screen image.
- Web: same single-column hierarchy; pager supports swipe and keyboard focus.
- Header owns top inset; sticky action owns bottom inset. Vertical page and
  horizontal pager are the only scroll owners.
- No keyboard interaction is required in this feature.

## Visual accessibility

- Minimum touch target: 48dp.
- Colors come only from `mobileLightTheme`/`mobileDarkTheme`; availability and
  disabled state always include text.
- Text supports system scaling without clipping; label/value rows may wrap.
- TalkBack/VoiceOver reads heading, image kind/index, data labels and action
  result in logical order.
- Image transition is subtle and disabled/reduced when reduced motion is active.

## Deliberate differences

| Platform/state    | Difference                                               | Reason                        |
| ----------------- | -------------------------------------------------------- | ----------------------------- |
| All platforms     | Corporate green/neutral Paper surfaces instead of orange | preserve current brand/theme  |
| All platforms     | No favorite and decorative arrow                         | out of scope and visual noise |
| One valid image   | No dots or swipe affordance                              | avoid false interactivity     |
| Failed remote URL | Ukrainian fallback instead of broken image               | storage URL may not resolve   |

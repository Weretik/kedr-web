# Товари без фотографій у профілі — visual interaction contract

## Approved references

- Existing screen/state: current `/(tabs)/catalog` product list and product
  details navigation.
- Existing components: `ProductCard`, `CatalogList`, `CatalogListFooter`,
  `CatalogState` structure, tab Appbar and Paper theme.
- Related SDD: catalog discovery UI `003` and product details `004`.
- Reference authority and date: current repository implementation inspected
  2026-10-03. It controls hierarchy and interaction, not API shape.

## Anatomy

| Region/element    | User purpose                   | Existing primitive/token                      | Constraints                                                        |
| ----------------- | ------------------------------ | --------------------------------------------- | ------------------------------------------------------------------ |
| Tab Appbar        | Identify current area          | existing tabs layout + theme control          | title remains «Профіль»; no second Appbar                          |
| Section heading   | Identify the specialized list  | Paper `Text` heading                          | «Товари без фотографій», first readable content                    |
| State region      | Understand loading/empty/error | existing catalog state structure              | context-specific Ukrainian copy; stable height where practical     |
| Product list      | Scan returned products         | `CatalogList`/`FlashList` pattern             | one vertical scroll owner; 16dp side padding; bottom-nav clearance |
| Product card      | Identify a product             | `ProductCard` when mapped model is sufficient | fallback explicitly says photo is absent; no invented values       |
| Refresh           | Request current full result    | native list pull-to-refresh                   | visible rows remain during refresh                                 |
| Pagination footer | Load/retry next result         | `CatalogListFooter` pattern                   | only for confirmed paginated contract; action ≥48dp                |

## Interaction matrix

| User action             | Initial state              | Observable result                          | Accessibility behavior                           |
| ----------------------- | -------------------------- | ------------------------------------------ | ------------------------------------------------ |
| Open Profile            | no cached data             | section heading + loading, then state/list | heading precedes live state in reading order     |
| Pull down               | successful visible list    | refresh indicator; refreshed full result   | does not move focus to a duplicate screen        |
| Tap retry               | initial error              | same request repeats                       | button name «Повторити»                          |
| Tap load more           | paginated result has more  | progress, appended unique rows             | action exposes disabled/busy state while loading |
| Tap next-page retry     | rows plus footer error     | same next request repeats; rows remain     | precise retry label for next results             |
| Activate card           | supported route identifier | existing product details opens             | card is a button named with product identity     |
| Read non-navigable card | no supported identifier    | content remains in place                   | no button/link role or misleading hint           |

## State matrix

| State             | Visible content                                 | Available actions                                        | Transition                         |
| ----------------- | ----------------------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| Initial loading   | section title, progress and loading copy        | none                                                     | success/empty/error                |
| Success           | section title and returned product cards        | refresh; card press if supported; load more if supported | refresh/details/next page          |
| Refreshing        | current cards and refresh indicator             | existing cards remain available                          | updated success/empty/error policy |
| Empty             | section title and «Усі товари мають фотографії» | refresh gesture where platform supports it               | refreshed state                    |
| Initial error     | section title and safe failure copy             | «Повторити»                                              | loading/success/error              |
| Next-page loading | existing cards and busy footer                  | refresh disabled only if conflicting request             | appended result/error              |
| Next-page error   | existing cards and retry footer                 | retry next page, refresh                                 | appended result/error              |

## Layout variants

- Android/iOS phone: one full-height `FlashList` below the heading; content
  padding matches catalog and clears the 72dp bottom navigation plus inset.
- Tablet/landscape: list remains single column at a readable centered maximum
  width; cards do not stretch into a desktop table.
- Expo web: same hierarchy; wheel/trackpad scroll and keyboard activation work
  for actual buttons.
- Safe area/orientation: existing tabs layout owns insets; no nested
  `SafeAreaView` that doubles top/bottom padding.
- Keyboard/focus: no text input. Retry/load/card controls keep visible focus on
  web and logical focus order on native.
- Scroll owner: `FlashList` only. Do not nest it in a vertical `ScrollView`.

## Visual accessibility

- Minimum touch target: 48dp for retry, load-more and tappable cards.
- Paper theme supplies colors; loading/error/availability state always includes
  text and never relies on color alone.
- Dynamic type supports wrapping without clipping product identity or actions.
- TalkBack/VoiceOver reads section heading, state, then each product. The
  existing «Фото товару відсутнє» fallback remains meaningful in this list.
- Reduced motion: no new animation is introduced; native progress indicators
  and list updates must not add decorative motion.

## Deliberate differences

| Platform/state         | Difference                                                  | Reason                                                |
| ---------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| Profile empty          | «Усі товари мають фотографії» instead of catalog empty copy | empty is a positive completion state                  |
| Unsupported navigation | card/content has no button semantics                        | avoid an action the confirmed contract cannot fulfill |
| Unpaginated response   | no footer/load-more action                                  | preserve canonical API semantics                      |
| All platforms          | no search/filter/sort controls                              | outside scope for this focused operational list       |

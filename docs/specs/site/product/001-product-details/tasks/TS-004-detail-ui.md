# TS-004 — Server представление и contact states

- **Covers:** SC-001–SC-006, SC-014–SC-018, SC-023, SC-028.
- **Depends on:** TS-001.
- **Status:** implemented, server/contact/locale verified.
- **Exact paths:** `libs/site/product/ui/src/lib/{detail/product-detail-view.tsx,identity/product-identity.tsx,identity/sku-copy-button.tsx,purchase/product-purchase-panel.tsx,details/product-facts.tsx,service/product-service-links.tsx,i18n/product-dictionary.ts,i18n/locales/uk.ts,i18n/locales/ru.ts}`; `identity/sku-copy-button.spec.tsx`, `purchase/product-purchase-panel.spec.tsx`.
- **Test level:** component, pure copy completeness where needed.
- **Baseline:** [visual](../design/visual.md), project tokens/shell, no cart ownership in product UI.

## Work

- [x] Собрать принятую двухколоночную/последовательную композицию из небольших server components; H1/price/stock/facts остаются в HTML.
- [x] Отобразить независимые states и informational pack; при contact mode использовать настоящие contacts/tel, без новой заявки.
- [x] Typed UK/RU dictionary, aria/status copy; clipboard success только после реального успеха, fallback без ложного сообщения.
- [x] Добавить якоря без hidden Tabs, scroll margin, реальные delivery/returns/wholesale links и COMPANY contact.
- [x] Сохранить purchase action slot для TS-005; available-mode slot не заменять локальной имитацией или несогласованным fallback.
- [x] Source-check 320/390/768/1024/1440, long text и темы; общая шапка/подвал не копируются.
- [x] Сверить локальные роли файлов; не объединять JSX, clipboard, DTO mapping и cart в один компонент.

## Evidence

P-UI: mixed stock×price и clipboard дали behavioral Red. Финальный .\node_modules\.bin\vitest.cmd run --config libs/site/product/ui/vite.config.mts — exit0,19 tests (purchase8, clipboard3, server view2, gallery6); UI tsc --noEmit — pass. Root server composition3/3 подтвердила main facts/JSON-LD/anchors без fake cart. Две локали, COMPANY/destinations, server/client roles проверены.

Подробности: [implementation evidence](../verification/implementation.md).

## Audit follow-up — 2026-11-03

AF-001: category destination больше не строится в UI. Required `categoryHref: string | null` передаётся feature → view → identity; null сохраняет label. Fresh detail component spec — exit0,3 tests; opaque href UK/RU и null fallback, source/test types/lint pass. [Audit evidence](../code-audit/audit.md).

## Checkpoint

UI отражает только реальные факты, все supported states и тексты UK/RU доступны; agreed composition сохранена, client leaves минимальны.

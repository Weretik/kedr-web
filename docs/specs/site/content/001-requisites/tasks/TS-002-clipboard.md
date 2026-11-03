# TS-002 — Локальное копирование и обратная связь

- **Status:** verified 2026-11-03; clipboard boundary.
- **Covers:** SC-005…SC-010.
- **Depends on:** TS-001.
- **Точные пути:** `libs/site/content/ui/src/lib/requisites/requisites-copy-button.tsx` и `libs/site/content/ui/src/lib/requisites/requisites-copy-button.spec.tsx`.
- **Test level:** component, controlled browser boundary.
- **Baseline:** существующий contacts-copy-phone-button; shared Button/cn; никакой зависимости ui → shell.

## Work

- [x] Создать один узкий client leaf для icon IBAN и основной кнопки, принимающий готовый text и labels.
- [x] Вызывать navigator.clipboard.writeText только по пользовательскому действию.
- [x] Реализовать independent idle/pending/success/error; ref-guard от повторного вызова и disabled/aria-busy при pending.
- [x] Показать локальный success через status/aria-live; сохранять место под feedback.
- [x] При rejection/unavailable показать выделяемое исходное значение или payload с сохранёнными переносами, инструкцию и retry.
- [x] Обеспечить keyboard activation и accessible names. Ошибка не вызывает tel, navigation, clipboard read или execCommand.
- [x] Проверить ответственность leaf; contacts и общий shell оставить без рефакторинга.

## Evidence

Выполнено P3. Два варианта одного client leaf получают готовый text и имеют независимое состояние.

- Команда TS-002: `npx nx run site-content-ui:vite:test -- --run src/lib/requisites/requisites-copy-button.spec.tsx`.
- Valid Red: exit 1, 4 failed / 7 passed — fallback не показывал точный single/multiline payload.
- Green: exit 0, 11 tests passed. Последняя combined regression с TS-003: 2 files / 18 tests passed, cache 0/1.
- Проверены exact writeText, keyboard/no-submit, pending/ref guard, success/live status, rejection/unavailable, selectable raw fallback, retry и независимость экземпляров.
- Production imports ограничены React/Lucide/shared UI; нет config, clipboard read, execCommand или navigation. Prettier и scoped ESLint: exit 0.
- Реальные browser permissions не проверялись; использован controlled adapter в jsdom.

## Checkpoint

Оба варианта копирования проходят controlled component cases; статус доступен, pending защищён, данные сохраняются для ручного копирования. Client boundary ограничен leaf.

# Готовность SDD

- [x] Цель, клиент `apps/site`, отдельный product domain и граница относительно checkout/cart описаны.
- [x] Визуальное направление принято; исходный концепт сохранён вместе с normative visual design.
- [x] R-001–R-012 и SC-001–SC-029 стабильны; Given/When/Then описывают наблюдаемый результат.
- [x] Фактический контракт и generated types определены; нет выдуманных DTO/operations/свойств.
- [x] Исходный Nx baseline, aliases, layers, test inference и planned file-role map записаны.
- [x] Server/client, cache/status, i18n/theme/media/accessibility и SEO решения представлены.
- [x] TS/EN имеют одну ответственность, exact paths, dependencies, уровень проверки, Evidence и Checkpoint.
- [x] Все SC трассируются; tests/evidence честно marked planned/unrun.
- [x] Источники, внутренние ссылки и diff входят в docs-only verification.
- [x] EN-001 выполнена: actual libraries/aliases/targets и boundary flow подтверждены.
- [ ] EN-002 выполнена: общего cart owner и рабочего cart destination ещё нет.

**Решение:** независимый этап4A реализован с автоматическим/source evidence. Полная поставка покупки условна до EN-002/TS-005; новый fallback не утверждён.

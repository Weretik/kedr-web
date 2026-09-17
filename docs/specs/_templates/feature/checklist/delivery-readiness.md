# Delivery readiness

- [ ] Усі in-scope `SC-*` мають verified або deferred статус.
- [ ] Усі required `TS-*`/`EN-*` пройшли checkpoint.
- [ ] Нове testable behavior має Red → Green → Refactor → Regression evidence.
- [ ] Контракти, документація і реалізація узгоджені.
- [ ] У кожній виконаній задачі перевірено цілісність відповідальності змінених
      implementation-файлів; файли з кількома незалежними відповідальностями
      розділені за чинними архітектурними межами.
- [ ] Для API-змін `npm run contracts:check` пройшов, а generated transport
      types не витекли у feature/UI/domain public API.
- [ ] Релевантні lint, typecheck/build і test targets виконані.
- [ ] Потрібні browser/device/platform checks виконані.
- [ ] `traceability.md` посилається на фактичні tests та evidence.
- [ ] Незавершені перевірки мають точну причину й owner.
- [ ] Residual risks записані.
- [ ] Сторонні зміни робочого дерева збережені.

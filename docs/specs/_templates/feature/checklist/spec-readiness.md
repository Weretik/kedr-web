# Specification readiness

- [ ] Goal, in-scope і out-of-scope погоджені.
- [ ] Явно обрано один application variant: React, React Native або Angular.
- [ ] Якщо тип не був у запиті, AI отримав відповідь користувача до створення
      variant-specific design.
- [ ] Бізнес-правила мають стабільні `R-*`.
- [ ] Сценарії мають стабільні `SC-*` і Given/When/Then.
- [ ] Сценарії описують лише observable behavior.
- [ ] Фактичні projects, targets, tooling і наявні тести перевірені.
- [ ] Test levels обрані за ризиком; E2E не дублює нижчі рівні.
- [ ] Кожен `TS-*` має одну responsibility; shared prerequisite є `EN-*`.
- [ ] У задач є Covers/Enables, Depends on, exact paths, test level, Work,
      Evidence і Checkpoint.
- [ ] Кожен `TS-*`/`EN-*` завершує `Work` перевіркою цілісності відповідальності
      змінених implementation-файлів і умовним розділенням перевантажених файлів
      за чинними архітектурними межами.
- [ ] `traceability.md` не має сирітських сценаріїв або задач.
- [ ] Open product questions мають owner/blocker.
- [ ] Кожна API operation має stable `operationId`, versioned OpenAPI source,
      generated type reference і consumer projection; schemas не дублюються.
- [ ] Optional порожні документи й незадіяні phase-файли видалені.

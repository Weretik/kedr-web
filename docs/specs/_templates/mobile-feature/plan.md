# Implementation plan: <назва Mobile feature>

**Spec:** [spec.md](spec.md)  
**Дата:** YYYY-MM-DD

## Summary

<Підхід реалізації, що задовольняє P1 user story.>

## Technical context

- **Stack:** Expo, React Native, Expo Router, React Native Paper, RTK Query, Nx.
- **Test targets:** <точні `npx nx lint mobile`, `npx nx test mobile`, library test/export/device commands; кожен відсутній target = `n/a` + readiness task>.
- **E2E decision:** <конкретний Maestro scenario + target; або `n/a` з причиною; або readiness blocker, owner і delivery condition>.
- **Security/access context:** <review level, current public/auth state, route/action access, 401/403, PII/XSS/files/export/destructive scope або `n/a` з причиною>.
- **Target platforms:** Android | iOS | web.
- **Constraints:** <offline, safe area, performance, deep-link або n/a>.

## Architecture and source paths

```text
apps/mobile/src/app/<route>.tsx        # thin Expo Router adapter
libs/mobile/<domain>/
├── model/        # pure TypeScript types, query, invariants
├── data-access/  # private DTO, mapper, RTK Query endpoints/hooks
├── ui/           # React Native Paper presentation and states
└── feature/      # screen composition and local UI state
```

- Route не містить HTTP, storage або domain business logic.
- `data-access` володіє DTO; `ui` не залежить від API, router чи storage.
- `feature` використовує чинні `AppProviders`; не створює provider дублікати.

## Constitution check

- [ ] Thin Expo Router route, Nx boundaries і public `src/index.ts` дотримано.
- [ ] Усі platform capabilities, нові залежності та відхилення обґрунтовано нижче.

## Complexity tracking

| Відхилення   | Чому потрібне | Чому простіший варіант не підходить |
| ------------ | ------------- | ----------------------------------- |
| <за потреби> | <причина>     | <причина>                           |

# Visual implementation plan: <назва>

**Spec:** [spec.md](spec.md)  
**Visual contract:** [visual-spec.md](visual-spec.md)

## Summary

<How the existing interface changes without changing unrelated architecture.>

## Source paths

```text
<exact existing source paths and responsibility>
```

## Architecture boundaries

- Route remains thin.
- `ui` receives domain data and callbacks; no RTK Query/router/storage imports.
- Reuse existing Paper theme and tokens; no local design system.
- <Any exception must be explicit.>

## Visual risks

| Risk                            | Mitigation | Verification |
| ------------------------------- | ---------- | ------------ |
| <scroll/focus/performance risk> |            |              |

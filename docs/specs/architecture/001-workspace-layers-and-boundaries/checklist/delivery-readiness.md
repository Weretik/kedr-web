# Готовність remediation до delivery

- [x] AF-001–AF-010 `verified`; AF-011 лишається verified.
- [x] Nx tags/constraints/conformance checks відповідають dependency matrix.
- [x] Mobile app owns domain reducer composition; core has no domain edge.
- [x] Cross-domain model ownership canonical; documented feature flows explicit.
- [x] Storefront domain contracts не є transport DTO; generated DTO private.
- [x] Manual paged server cache/lifecycle removed; RTK freshness explicit.
- [x] All consumed external responses validated before mapping.
- [x] Root public entry points expose no private transport/mappers/storage.
- [x] Characterization, source/test typecheck, tests, lint, contracts and builds pass.
- [x] Empty/dead projects/folders and stale paths absent.
- [x] Final audit and traceability updated after last change.

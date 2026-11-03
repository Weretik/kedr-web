# TS-001 — Content foundation

- **Enables:** SC-001…SC-010.
- **Depends on:** none.
- **Paths:** libs/site/content/{model,ui,seo,feature}, tsconfig.base.json, package.json.
- **Test level:** generator/config verification; source content tested by TS-002.
- **Work:** reuse concurrent delivery ui/seo/feature projects and generate only model with Nx, trimming to existing site conventions; add public aliases and test project list. Copy existing uk/ru returns policy into typed local domain content and define concise summary/process/FAQ dictionaries.
- **Evidence:** completed. Nx generated model; project renamed site-content-model with scope:site/domain:content/type:model tags. Existing delivery projects/exports retained. Public model alias added; generator-only plugin and root config churn removed. Static model content is covered by TS-002 component tests. Architecture check passed for 102 projects; feature/seo TypeScript checks passed.
- **Checkpoint:** generated projects recognized; no imports from Storefront; complete policy available in both languages.
- **Exception:** generator setup is infrastructure, not behavioral Red. Verify configuration and domain boundaries.

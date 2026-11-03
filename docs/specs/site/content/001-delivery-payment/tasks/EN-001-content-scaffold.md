# EN-001 — Content library scaffold

- **Enables:** TS-001, TS-002, TS-003; SC-001–SC-008.
- **Depends on:** none.
- **Paths:** `libs/site/content/ui`, `libs/site/content/seo`, `libs/site/content/feature`; generated root aliases in `tsconfig.base.json` and necessary boundary registration only.
- **Owner:** coordinator.
- **Test level:** infrastructure / boundary check.

## Work

Generate each library with installed Nx React generator (`--bundler=none --unitTestRunner=vitest`) and repository conventions; ui is `scope:site,domain:content,type:ui`, seo is `scope:site,domain:content,type:util`, feature is `scope:site,domain:content,type:feature`. If the Nx CLI stalls in plugin bootstrap, invoke the same installed generator through Nx Devkit FsTree rather than writing replacement scaffolds by hand; record that command and generated changes. Keep public exports and inferred Vitest targets. Remove unused generator example components and deprecated scaffolding. Do not add model/data-access libraries. Check each changed file's responsibility before releasing independent packages.

## Evidence

- Completed 2026-11-03. Generated three content projects with installed Nx React 24.0.3 libraryGenerator, directory libs/site/content/<layer>, importPath @site/content/<layer>, bundler none, unitTestRunner vitest, component false, skipPackageJson/skipFormat true.
- Nx CLI dry-run stalled and was stopped. Invoked the same installed generator through node stdin: require('nx/src/generators/tree').FsTree / flushChanges plus require('./node_modules/@nx/react/dist/src/generators/library/library.js').libraryGenerator. Reviewed virtual changes before flush: 25 files, limited to libs/site/content and tsconfig.base aliases. Existing nx/eslint/package/lockfile mutations were discarded from the virtual tree; copied existing site configs to trim generated scaffolds to current conventions, corrected content tags, removed generated unused .babelrc.
- Public aliases @site/content/ui, @site/content/seo, @site/content/feature resolve; explicit scope:site/domain:content tags, ui/util/feature layer tags. Existing tsconfig settings were compared before retaining only new aliases; test:site includes all three. No dependency/install/lockfile change.
- Copied the accepted raster unchanged to design/concept.png. Static server content needs no model or API library; parallel returns work later introduced its own content/model, which delivery does not use.
- npm run architecture:boundaries with NX_DAEMON=false, NX_ISOLATE_PLUGINS=false: exit 0, 102 projects. Existing vite.config.mts configurations define the focused runners used in TS-001/002/003.
- Red-first exception: generator setup has no product behavior. Replacement evidence is generated path/tag/import review, successful layer tests, typecheck and project boundary validation.

## Checkpoint

Three libraries and test targets exist, aliases resolve, boundary rules accept intended arrows, no unrelated generated change remains. Then UI and SEO tasks are ready.

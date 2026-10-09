# Шаблон SDD для виправлення наявної архітектури

Використовуйте для системного боргу в кількох files/libraries/features. SDD
зберігає observable behavior, переводить код до чинної Kedr architecture і дає
feature tasks явні prerequisites.

```text
<NNN>-<remediation-slug>/
├── README.md
├── USAGE.md
├── requirements/findings.md
├── design/target-architecture.md
├── traceability.md
├── code-audit/audit.md
├── analysis/root-cause.md
├── tasks/
│   ├── README.md
│   ├── EN-NNN-enabler.template.md
│   ├── RM-NNN-remediation.template.md
│   └── phases/
└── checklist/{spec-readiness,delivery-readiness}.md
```

IDs: `AF-*` finding, `AR-*` architecture requirement, `EN-*` prerequisite,
`RM-*` one correction. Кожен `AR-*` посилається на Kedr rule source. Якщо docs
суперечливі, перша documentation task узгоджує їх до code changes.

Підключіть [повний code audit](../code-audit/README.md). Implementation не
починається до погодження SDD scope.

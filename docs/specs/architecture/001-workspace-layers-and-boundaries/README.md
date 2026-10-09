# 001 — Відновлення frontend layers і boundaries

- **Поверхні:** Angular Storefront, React Admin, React Native Mobile
- **Статус:** implemented and verified
- **Власник:** frontend
- **Оновлено:** 2026-10-02

SDD переводить фактичний workspace до узгоджених Kedr layers, data paths,
public APIs і executable gates без зміни observable поведінки застосунків.
Remediation реалізовано та перевірено executable gates, focused tests і
production builds для трьох клієнтів.

## Навігація

- [Findings і architecture requirements](requirements/findings.md)
- [Target architecture і migration sequence](design/target-architecture.md)
- [Root-cause analysis](analysis/root-cause.md)
- [Task graph](tasks/README.md)
- [Traceability](traceability.md)
- [Spec readiness](checklist/spec-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)
- [Initial code audit](code-audit/audit.md)
- [Implementation prompt](USAGE.md)

AF-001–AF-011 мають статус `verified`; деталі виконання та evidence наведені у
task graph, traceability і final audit.

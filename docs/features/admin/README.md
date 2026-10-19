# Фічі Admin React

[AppRouter](../../../apps/admin/src/app/router/app-router.tsx) збирає маршрути всередині `AdminLayout`.

| Фіча                    | Маршрут                                    | Стан                                       |
| ----------------------- | ------------------------------------------ | ------------------------------------------ |
| [Дашборд](dashboard.md) | `/dashboard`                               | Візуальні показники наразі статичні        |
| [Товари](products.md)   | `/catalog`, `/catalog/:productSlug`        | Список, режим «Без фото», read-only картка |
| [Клієнти](clients.md)   | `/customers`, `/customers/:counterpartyId` | Серверна пагінація, read-only картка       |

[Сесія й оболонка](session.md) — спільна функціональність усіх маршрутів; окремого login екрана в Admin немає. Загальні межі — в [архітектурі Admin](../../architecture/admin/README.md).

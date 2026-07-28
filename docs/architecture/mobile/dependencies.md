# Правила залежностей Mobile

## Напрямки залежностей

```text
app -> core | feature | mobile/shared
core -> core | mobile/shared
feature -> ui | model | data-access | mobile/shared
data-access -> model | mobile/shared/api-client | mobile/shared/util
ui -> model | mobile/shared/ui | mobile/shared/util
model -> mobile/shared/util
mobile/shared/* -> mobile/shared/* без циклів
```

| Джерело         | Може залежати від                                               |
| --------------- | --------------------------------------------------------------- |
| `app`           | `core`, domain `feature`, `mobile/shared`                       |
| `core`          | `core`, `mobile/shared`                                         |
| `feature`       | свого `data-access`, `model`, `ui`, `mobile/shared`             |
| `data-access`   | свого `model`, `mobile/shared/api-client`, `mobile/shared/util` |
| domain `ui`     | свого `model`, `mobile/shared/ui`, `mobile/shared/util`         |
| domain `model`  | `mobile/shared/util`                                            |
| `mobile/shared` | лише інші `mobile/shared` бібліотеки                            |

Це той самий напрямок залежностей, що в Admin. Відмінність лише в реалізації
platform-adapters: Mobile shared використовує Expo та React Native, Admin shared
— браузерні та MUI-залежності.

## Обмеження

- Домен не імпортує внутрішні модулі іншого домену.
- `mobile/shared` не залежить від доменних бібліотек.
- `feature`, `data-access`, `ui` і `model` не залежать від Expo Router route-файлів.
- `ui` не імпортує `data-access`, RTK Query hooks або router.
- `model` — чистий TypeScript: без React, React Native, Expo, HTTP і storage API.
- API DTO не виходять із `data-access`; feature і UI працюють із доменними моделями.
- `data-access` не звертається до Expo SecureStore або NetInfo напряму: він отримує
  потрібну поведінку через публічні адаптери `core/auth` та `core/connectivity`.
- Циклічні залежності та deep imports між бібліотеками заборонені.
- Між бібліотеками використовуються aliases і `src/index.ts`, а не relative imports.

## Особливість Expo Router

`apps/mobile/src/app` не є domain layer. Це технічний шар маршрутизації, який може
імпортувати тільки публічні API `core`, `feature` і `mobile/shared`. Він не стає
спільним каналом, через який домени імпортують один одного.

```text
apps/mobile/src/app/catalog/[id].tsx
                ↓
@mobile/catalog/feature
                ↓
@mobile/catalog/data-access -> @mobile/shared/api-client
```

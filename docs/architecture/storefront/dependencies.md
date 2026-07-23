# Правила залежностей Storefront

Nx-теги `scope:storefront` ізолюють Storefront від Admin. Бібліотеки Storefront
можуть залежати лише від `scope:storefront` і `scope:shared`.

## Напрямок залежностей

| Бібліотека    | Дозволені залежності                                                   |
| ------------- | ---------------------------------------------------------------------- |
| `contracts`   | `contracts`, `util`, `shared`                                          |
| `util`        | `util`, `contracts`, `shared`                                          |
| `ui`          | `ui`, `util`, `contracts`, `shared`                                    |
| `data-access` | `data-access`, `util`, `contracts`, `shared`                           |
| `feature`     | `feature`, `ui`, `util`, `data-access`, `contracts`, `shared`          |
| `shell`       | `shell`, `feature`, `ui`, `util`, `data-access`, `contracts`, `shared` |

Ці обмеження перевіряє правило `@nx/enforce-module-boundaries` у кореневому
`eslint.config.cjs`. Не обходити їх відносними або deep-імпортами.

`contracts` не залежить від feature. `data-access` не залежить від feature або
shell. UI-компоненти не містять HTTP-викликів і не імпортують feature-сценарії.

# Застосунок і маршрутизація Mobile

## Архітектурне рішення

Mobile використовує ті самі базові принципи, що й Admin: domain-first бібліотеки,
чіткі шари `feature` / `data-access` / `model` / `ui`, публічні точки входу та
контроль меж через Nx. Це дозволяє команді працювати за знайомими правилами й не
перетворювати `apps/mobile` на моноліт.

Структура не копіює Admin буквально. Її адаптовано до Expo Router: фізичні файли
маршрутів мають перебувати в `apps/mobile/src/app`, тому вони є тонкими
адаптерами між файловою маршрутизацією та feature-бібліотеками.

## Відповідальність `apps/mobile`

Застосунок містить тільки Expo-специфічну композицію:

- конфігурацію Expo та entry point;
- файлові маршрути Expo Router і `_layout.tsx`;
- підключення одного `AppProviders` із `@mobile/core/shell`;
- bootstrap конфігурації та маршрутизаційні redirects.

У маршруті не розміщуються HTTP-виклики, бізнес-логіка, складний UI або доменні
типи. Маршрут імпортує один екран чи сценарій з feature-бібліотеки й передає
лише параметри маршруту.

## Цільова структура

```text
apps/mobile/
├── app.json
├── project.json
└── src/
    ├── app/                         # лише Expo Router routes і layouts
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── (auth)/
    │   │   ├── _layout.tsx
    │   │   └── sign-in.tsx
    │   └── (app)/
    │       ├── _layout.tsx
    │       └── catalog/
    │           ├── index.tsx
    │           └── [productId].tsx
```

Групи маршрутів `(auth)` і `(app)` не входять до URL. Вони відокремлюють
неавторизований і авторизований shell. Перший демо-реліз може не містити `(auth)`,
якщо каталог не потребує сесії.

## Приклад тонкого маршруту

```tsx
import { CatalogScreen } from '@mobile/catalog/feature';

export default function CatalogRoute() {
  return <CatalogScreen />;
}
```

Feature володіє сценарієм і екраном; app володіє лише URL та Expo Router
інтеграцією. Динамічний параметр товару читається route-адаптером і передається
до feature у типізованому вигляді.

## Провайдери

Кореневий `_layout.tsx` підключає один `AppProviders` із `@mobile/core/shell`.
`core/shell` є єдиним місцем налаштування глобальних провайдерів, Redux store та
corporate Paper theme. Їхній порядок:

1. `SafeAreaProvider`;
2. Redux `Provider`;
3. `PaperProvider` із темою;
4. глобальний error notifier;
5. `Slot` або Expo Router navigator.

Feature, UI-компоненти і data-access не створюють власні глобальні провайдери.

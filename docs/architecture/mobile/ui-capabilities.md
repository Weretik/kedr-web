# Каталог UI та platform-можливостей Mobile

**Статус:** схвалене архітектурне рішення.  
**Поточний стан:** у `apps/mobile` встановлюються лише пакети, потрібні для затверджених сценаріїв із цього каталогу; нові залежності не додаються наперед.

Цей документ — єдина точка вибору готових UI-компонентів, жестів і можливностей пристрою для Mobile. Перед додаванням нової бібліотеки агент або розробник звіряє сценарій із таблицею нижче, а не підбирає аналог довільно.

## Правило підключення

Пакет додається лише тоді, коли він потрібен у конкретній затвердженій задачі. У її SDD/плані потрібно зафіксувати:

1. сценарій та екран, для якого він потрібен;
2. пакет і сумісну з поточним Expo SDK версію (встановлення через `npx expo install`, якщо пакет підтримується Expo);
3. місце використання та межу відповідальності;
4. чи змінює пакет native runtime, permissions або app config, а отже чи потрібен Development Build;
5. перевірку на Android, iOS та web, якщо платформа підтримується.

Не встановлюйте весь список «про запас» і не робіть масову міграцію вже наявних компонентів без окремої задачі та вимірюваної причини.

## Схвалені рішення

| Пакет                              | Коли використовувати                                                                                               | Межа в коді та обов'язкові умови                                                                                                                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-native-paper`               | Основна UI-бібліотека: кнопки, поля вводу, картки, меню, діалоги, вкладки, `Snackbar`, `Searchbar`, `Chip` і тема. | Використовувати для готових складних контролів. Простий layout — стандартними компонентами React Native. Theme і tokens централізовані; feature не створює власний provider.                                                                                                 |
| `@react-native-assets/slider`      | Двобігунковий числовий діапазон: фільтр ціни.                                                                      | Використовувати `RangeSlider` з контрольованим `range`, обмеженнями та кольорами Paper theme. Пакет працює з React Native і Web, не вимагає native config або Development Build.                                                                                             |
| `react-native-actions-sheet`       | Нижні панелі для сортування, вибору категорії, швидких фільтрів і короткого списку дій.                            | Компонент панелі належить `ui`; `feature` передає стан та обробники. Панель має прокручуваний вміст, явне закриття й не повинна приховувати єдину критичну дію.                                                                                                              |
| `@shopify/flash-list`              | Довгі або потенційно великі списки: каталог товарів, клієнти, замовлення, історія операцій.                        | Це стандартний вибір для **нових** таких списків замість `FlatList`. Наявний `FlatList` не переписується автоматично. Під час міграції перевірити підтримувані props та поведінку recycled cells.                                                                            |
| `react-native-gesture-handler`     | Свайп рядка, перетягування, довге натискання, дії «змінити/видалити» свайпом.                                      | Підключати лише коли нативного `Pressable` недостатньо. `GestureHandlerRootView` розміщувати біля кореня застосунку; для жестів у RN `Modal` обгорнути також його вміст. Передбачити доступну альтернативу жесту (видима кнопка/меню).                                       |
| `react-native-reanimated-carousel` | Карусель фото товару, промобанерів, категорій або акцій.                                                           | Не використовувати для основної навігації чи критично важливого контенту без альтернативного доступу. Додається разом із сумісними `react-native-reanimated`, `react-native-worklets` і `react-native-gesture-handler`; перевірити встановлення саме для поточного Expo SDK. |
| `react-native-paper-dates`         | Вибір дати, часу або періоду: строк замовлення, звіт, дата дзвінка, фільтр за датою.                               | Використовувати поверх Paper theme. До першого показу зареєструвати український переклад `uk-UA`; feature явно визначає формат, timezone та значення, яке надсилається API.                                                                                                  |
| `expo-camera`                      | Фото товару, сканування QR/штрихкоду, прикріплення фото до замовлення.                                             | Доступ до камери та permission-flow ізолювати за platform adapter/feature boundary, не в презентаційному `ui`. Потрібні пояснення permissions і перевірка на реальному пристрої; зміни native config вимагають нової binary.                                                 |
| `expo-haptics`                     | Ненав'язливий відгук на підтвердження натискання, успішне збереження, помилку або перемикання фільтра.             | Виклик із platform adapter, а не напряму з кожної кнопки. Haptic — лише додатковий сигнал: успіх, помилка і стан завжди мають видимий/доступний UI-відгук. Вібровідгук може бути недоступним за налаштуваннями або на частині пристроїв.                                     |

## Розміщення залежностей

`feature` оркеструє сценарій і володіє локальним станом. `ui` містить презентаційні компоненти на базі Paper, Action Sheet, FlashList, carousel або date picker і не залежить від API. Доступ до пристрою (`expo-camera`, `expo-haptics`) ізолюється в platform adapter/core або domain-specific service; `ui` отримує тільки дані та callbacks.

Публічний API кожної library залишається в її `src/index.ts`. Не експортуйте DTO чи API-клієнт через UI-бібліотеку.

## Expo Go та Development Build

Після додавання будь-якої залежності перевірте сумісність з поточним Expo SDK через `npx expo-doctor` і документацію пакета. `FlashList` підтримує Expo Go з SDK 46+, але це не скасовує перевірку версії. `expo-camera` додає camera permission, а пояснення permission для iOS і зміни app config потрапляють у native binary, тому для production/development build потрібна нова збірка. Для `react-native-gesture-handler` і carousel виконайте їхні актуальні native/setup-вимоги.

Повний порядок переходу й повторної збірки визначено в [Expo Go та Development Build](development-build.md). Цей каталог не є дозволом створювати `expo-dev-client` або EAS build без конкретної native-потреби.

## Джерела

## Registered dependency: `expo-blur`

`expo-blur` is approved for the mobile shell's floating bottom navigation only. It is installed with `npx expo install` for the active Expo SDK and is used through a shell-owned `BlurTargetView`/`BlurView` pair. It requires no permissions or app-config change and runs in Expo Go. On Android, use `dimezisBlurViewSdk31Plus` and retain a themed translucent fallback below Android API 31.

- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [react-native-actions-sheet](https://rnas.vercel.app/)
- [FlashList: installation and Expo support](https://shopify.github.io/flash-list/docs/)
- [React Native Gesture Handler: installation](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/)
- [React Native Reanimated Carousel](https://rn-carousel.dev/)
- [React Native Paper Dates](https://web-ridge.github.io/react-native-paper-dates/docs/intro)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

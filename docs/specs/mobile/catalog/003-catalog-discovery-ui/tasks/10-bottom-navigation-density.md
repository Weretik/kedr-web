# Фаза 10 — Щільність нижньої навігації

- [x] C047. Зменшити власну висоту `react-native-paper` `BottomNavigation.Bar` з Material 3 default `80dp` до `64dp` для щільного catalog UI.
- [x] C048. Зберегти `safeAreaInsets={insets}`: системна Android/iOS navigation area не входить у 64dp та не перекриває labels або touch targets.
- [ ] C049. Перевірити три tab labels/icons, active state, light/dark theme та нижній inset на Android/iOS/web.
- [x] C050. Переробити нижню навігацію у floating pill: лише її власний frame має horizontal inset 16dp, radius 32dp, elevation/shadow та напівпрозору theme surface. Простір ліворуч/праворуч і над frame лишається прозорим, щоб background/content не зникав за суцільною панеллю.
- [x] C051. Floating frame має 64dp content height, зберігає `safeAreaInsets` поза ним, три labels/icons і мінімальний touch target 48dp. Active tab явно позначена primary color; inactive tabs лишаються `onSurfaceVariant`.
- [x] C052. Додати bottom content inset для scrollable catalog content, щоб остання card не опинялася під floating frame; перевірити light/dark contrast без platform-specific blur dependency.

## Acceptance

Нижня панель контенту має висоту 64dp, але системний bottom inset зберігається. Усі три tab targets залишаються доступними й читабельними.

Floating frame не розтягується на всю ширину екрана: навколо нього видно screen background. Напівпрозорість і shadow створюють ефект «висить у повітрі», але не погіршують контраст labels/icons.

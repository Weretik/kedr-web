# Промпты генерации

Создано встроенным image_gen. Результат — растровый концепт, не исходники интерфейса.

## Основной промпт

```text
Use case: ui-mockup.
Create a polished, high-fidelity design concept presentation for the NEW "Регіони / Регионы" page of the Class Kedr public door-hardware wholesale and retail website. This is a design proposal, not a geographic branch locator. Match the attached reference's compact, clean informational-page grammar, but use the precise project rules below.

OUTPUT: one very high resolution landscape presentation board, approximately 3200 x 2000, four aligned website panels: desktop light, desktop dark, mobile light, mobile dark. Desktop panels dominate width, two narrow mobile panels at the right. Very light neutral outer presentation background, generous separation, tiny outside labels "DESKTOP · UK · LIGHT", "DESKTOP · RU · DARK", "MOBILE · UK · LIGHT", "MOBILE · RU · DARK". The label is outside each webpage. Desktop show whole composition; phones show natural first viewport/upper scroll, so do not compress 23 regions into tiny phone text. No device bezels, perspective, 3D, browser chrome, gradients, glow, maps, geographic outlines or decorative illustrations. A calm, exact retail interface with real legible Cyrillic text.

DESIGN SYSTEM: Onest font or its very close Cyrillic equivalent, strong restrained headings, H1 about 36px desktop / 30px mobile. Light background #FFFFFF, text #0F110F, muted #F4F5F2, border #E3E6DF, green links #2A7323. Dark background #0C0D0C, text #EDEFEA, panels #111311, muted #161815, border #242823, green links #7DD06F. Green #3FA435 only for Catalog button and restrained icons. Main action light theme is ink fill white label; main action DARK theme is LIGHT #EDEFEA fill with DARK label. Soft green strip #EAF5E7 / #15241A. 1px fine borders, panels radius 14px, buttons 8px, no deep shadows. Icons look like Lucide outline, stroke1.75. Normal body and control labels must remain comfortable to read.

SHELL desktop: top strip with "Україна, м. Харків" or "Украина, г. Харьков" left, centered links "Про компанію", "Доставка та оплата", "Повернення", "Галерея", "Статті", "Контакти" (Russian localized on RU), and UA / RU with sun/moon toggle right. Main line: Class Kedr wordmark with Class green and Kedr ink/light, green "Каталог" with grid icon, search "Артикул або назва товару", phone "(068) 713-50-49", compact contact icons, user and cart. Category line: "Завіси", "Замки", "Ручки", "Циліндри", "Міжкімнатні механізми", "Інше", "Двері", active "Регіони", green "Співпраця". Russian equivalents in dark. Do not omit Regions category.
MOBILE shell: one compact row hamburger, wordmark, user, cart; second full-width product search. No desktop category row.

PAGE LAYOUT desktop: centered content, modest gutters. Breadcrumb house / "Регіони". H1 "Регіони" on UK / "Регионы" on RU. Short honest intro:
UK "Дверна фурнітура для оптових і роздрібних замовлень. Оберіть свій регіон."
RU "Дверная фурнитура для оптовых и розничных заказов. Выберите свой регион."
Under intro small underlined section links "Обрати регіон", "Як замовити", "Доставка та оплата", translated on RU.

MAIN DIRECTORY: A generous lightly outlined section with a pin icon and H2 "Оберіть свій регіон" / "Выберите свой регион"; below a search input with magnifier "Назва області або Київ" / "Название области или Киев". This is a REGION search separate from the product search in shell. Tiny secondary note "23 напрями" / "23 направления". Below use simple real link rows in THREE balanced columns desktop, thin horizontal separators, each row region name and small arrow. This is one shared panel, NOT 23 floating cards. Show all exact supported destinations once, no other locations. Kiev and Kyiv region are different links:
UK: Київ; Вінницька область; Волинська область; Дніпропетровська область; Житомирська область; Закарпатська область; Запорізька область; Івано-Франківська область; Київська область; Кіровоградська область; Львівська область; Миколаївська область; Одеська область; Полтавська область; Рівненська область; Сумська область; Тернопільська область; Харківська область; Херсонська область; Хмельницька область; Черкаська область; Чернігівська область; Чернівецька область.
RU same destinations: Киев; Винницкая область; Волынская область; Днепропетровская область; Житомирская область; Закарпатская область; Запорожская область; Ивано-Франковская область; Киевская область; Кировоградская область; Львовская область; Николаевская область; Одесская область; Полтавская область; Ровенская область; Сумская область; Тернопольская область; Харьковская область; Херсонская область; Хмельницкая область; Черкасская область; Черниговская область; Черновицкая область.
One Kyiv row may show a subtle soft-green hover/focus treatment; do not make it a selected shipping destination. Long names must wrap naturally.

LOWER CONTENT desktop: pale green full-width "Як замовити" / "Как заказать" strip with three compact steps, numbered simple green circles:
1 "Оберіть товари" / "Выберите товары": "Знайдіть фурнітуру в каталозі." / "Найдите фурнитуру в каталоге."
2 "Узгодьте замовлення" / "Согласуйте заказ": "Уточніть деталі з менеджером." / "Уточните детали с менеджером."
3 "Узгодьте доставку" / "Согласуйте доставку": "Обговоріть спосіб і умови відправлення." / "Обсудите способ и условия отправки."
Then a quiet two-part row: left heading "Умови доставки" / "Условия доставки", text "Спосіб, вартість і строки уточнюйте під час замовлення." / "Способ, стоимость и сроки уточняйте при заказе.", underlined link "Доставка та оплата" / "Доставка и оплата". Right a small bordered help panel H3 "Потрібна допомога?" / "Нужна помощь?", phone icon + "(068) 713-50-49", main button "Зателефонувати" / "Позвонить" in correct primary theme pairing.
FOOTER desktop: understated border at top and four text columns headed "Каталог", "Компанія", "Покупцям", "Контакти" with relevant short links, phone and the verified email "kedr.class19@gmail.com". No logo block in footer. Copyright at bottom.
MOBILE: same intro then main directory with search and region link rows in ONE column with 44px touch areas, natural wrap for long names, no horizontal scrolling. Show first 7-9 rows in natural first-scroll crop, with continued list clearly extending below capture. Preserve large legible type rather than fitting all desktop content. UK light and RU dark must be equivalent responsive structures.
No invented local offices, warehouse addresses, stock promises, guarantees, exact delivery times, costs, stats, country maps or branch pins. No big promotional hero, no imagery of door hardware. Professional, precise, compact design that could belong beside the reference returns page.
```

## Коррекция основной кнопки и года

```text
Edit the attached Class Kedr Regions UI concept board. Preserve the entire four-panel layout, all page structure, typography, region lists, spacing, header, footer, text and colors except the following precise corrections:
1. In DESKTOP UK LIGHT, the bottom help-panel button "Зателефонувати" currently has a green fill. Replace ONLY its fill with solid ink #0F110F and keep the label white #FAFBF8, radius 8px. It must be visually the same primary system as the light neutral-filled call button in DESKTOP RU DARK, but inverted for light mode. The green Catalog button stays green. Do not recolor any other element.
2. In BOTH desktop footer copyright lines change "© 2025 Class Kedr." to "© 2026 Class Kedr." Keep the remainder of each Ukrainian/Russian copyright line unchanged.
Do not redesign, recompose, crop, add anything, or alter text elsewhere. Preserve the mobile panels as-is. Produce the same crisp high resolution presentation board.
```

## Коррекция фирменной заливки шагов

```text
Edit the provided four-panel Class Kedr Regions concept presentation board, preserving every pixel of composition and all text except these narrow brand-color corrections:
In the DESKTOP UK LIGHT and DESKTOP RU DARK lower "Як замовити" / "Как заказать" process strips, all three numbered circular badges 1, 2, 3 must have the SAME solid brand green fill #3FA435 and WHITE #FFFFFF numerals, medium/bold weight. In particular remove the pale lime circles with black numerals in the dark desktop panel. Green links remain their existing theme-specific color. Do NOT recolor the green soft strips, region links, hover rows, or any other elements.
Keep the light desktop call button INK with WHITE text, dark desktop call button LIGHT with DARK text, copyright year 2026, all 23 region links, all four page panels, every layout, every heading, contact details, footer and phone views unchanged. No additions, omissions, cropping, recomposition or other stylistic changes. Exact same high resolution board.
```

# Затверджений дизайн

[Архів концепту v2](articles-concept-v2.png). Першоджерело: `E:\Development\design-concepts\kedr-site\articles-2026-11-03-01a19ef0\articles-concept-v2.png` та concept-notes-v2.txt; користувач затвердив 2026-11-03.
Остання поправка має пріоритет над PNG: прибрати ВИДИМИЙ label «Пошук у статтях», зберегти sr-only label і placeholder «Назва або текст статті». Візуалізація не є реалізацією.

Список: існуючий shell → крошки → H1/вступ → поле пошуку без зовнішнього label + селектор 10/20/50 → total → рівнозначна сітка → діапазон/pager → footer. Desktop: 3 колонки від xl, 2 від md, 1 нижче; фото 16:9, radius 10–14px, border tokens, акцент brand-text. Повний заголовок без ellipsis. Пошук займає всю доступну ширину; селектор не стискає його на телефоні. Pagination desktop з номерами, mobile зі стрілками та N / total.

Детальна стаття, додана явним уточненням: ті самі shell/токени; крошки Головна / Статті / назва, повний H1 поза фотографією, дата публікації з джерела, обкладинка 16:9, текстова колонка max 70ch з комфортним line-height, посилання повернення до всіх статей. Без нових CTA, метрик, sidebar або редизайну.
Порожня обкладинка — neutral panel + lucide icon; звичайні фото в dark не затемнюються.

Шрифт Onest; primary/brand/brand-text та borders тільки з global.css. Зелені body-links: #2A7323 light / #7DD06F dark. Зелена заливка лише коротких medium labels/icons; жодних glow/декоративних градієнтів. Зберегти visible focus та reduced-motion.

Шість реальних записів на основному екрані; демонстраційні 26 — тільки test fixtures. Спочатку server output, theme/locale/responsive перевірка по коду. Browser/visual review потребує окремого дозволу й зараз не доручений.

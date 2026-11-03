# Модель та інваріанти

`Article`: id:number, slug:string, title:string, excerpt:string, paragraphs:readonly string[], image:string|null, publishedAt:string (ISO date з 24.03.2026).
`ArticlesQuery`: q:string, page:number, pageSize:10|20|50.
`ArticlesListing`: items:readonly Article[], query:ArticlesQuery (обмежена доступна page), total:number, pageCount:number, start:number, end:number.

Власник чистих типів, URL та правил вибірки — content/model. Читання локалізованого immutable джерела — content/data-access (server-only), тільки source може містити повний локалізований набір. UI не імпортує data-access. Локальні source IDs відображаються в стабільні слаги; schema transport DTO немає.

URL: q, pageSize, page; q trim + collapse whitespace, bounded 200 chars; перше значення для повторного ключа; невідомі ключі не передаються в посилання. Page — додатне safe integer; invalid → 1; pageSize поза списком → 10. Пошук по title + paragraphs без регістру; offset після фільтрації. Порожній результат start=end=0, page=1, pageCount=0.

Слаги: 1 zamina-dvernoi-furnitury; 2 postachannia-dlia-vyrobnykiv-dverei; 3 zamak-chy-aliuminii; 4 prykhovani-petli; 5 vrizna-bronenakladka; 6 zvukoizoliatsiia-dverei.
Порядок 1–6 незмінний. JSON-LD SEO отримує тільки потрібні plain поля від feature, не імпортує model/data-access.

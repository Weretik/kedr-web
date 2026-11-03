# Фаза SEO

[TS-006](TS-006-seo.md) владеет metadata и JSON-LD. [TS-008](TS-008-crawling.md) владеет product sitemap/robots/seed source. [TS-007](TS-007-routing.md) подключает их к тонкому route и сохраняет 404/308/500 до streaming. [Протокол проверки](../verification/seo-verification.md) отделяет автоматические builder tests от не выполненных HTTP/build/browser проверок.

Эта фаза не включает индексирование окружения и не разрешает запуск полного build/E2E по одному факту наличия команды в документе.

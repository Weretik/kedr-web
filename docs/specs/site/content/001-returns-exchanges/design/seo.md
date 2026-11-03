# SEO design

Sources: [SEO rules](../../../../../standards/site/seo-rules.md), [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md).

| URL                     | Index policy                                      | Canonical | Alternates                    | Sitemap |
| ----------------------- | ------------------------------------------------- | --------- | ----------------------------- | ------- |
| `/uk/returns-exchanges` | index only after existing production cutover gate | self      | uk-UA, ru-UA, x-default -> uk | yes     |
| `/ru/returns-exchanges` | same                                              | self      | reciprocal                    | yes     |

The content URL type already exists in the central policy; add exact migrated URLs without altering preview robots. Keep existing addresses with no redirect. The thin route calls domain SEO, which calls buildPageMetadata. Organization JSON-LD is already emitted by the layout; do not duplicate it. FAQ rich-result markup is not required.

| Field       | uk                                                                                                             | ru                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Title       | Повернення та обмін \| Class Kedr                                                                              | Возврат и обмен \| Class Kedr                                                                               |
| Description | Умови повернення та обміну дверної фурнітури Class Kedr: гарантія, доставка та порядок звернення до менеджера. | Условия возврата и обмена дверной фурнитуры Class Kedr: гарантия, доставка и порядок обращения к менеджеру. |
| H1          | Повернення та обмін                                                                                            | Возврат и обмен                                                                                             |

Domain metadata supplies plain localized titles; the root layout applies the brand template once. CONTENT_SITEMAP_PAGES in content/feature owns static page descriptors.

All headings, policy and answers are server HTML. Existing shell links and language switch expose both URLs. No page-specific script, fonts, large images or external assets. Performance budgets inherit the site baseline. Automated metadata/sitemap tests are required now. Rendered HTML/build checks are recorded as unrun unless separately authorized under repository verification scope rules.

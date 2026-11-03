# Rules and scenarios

## Rules

- **R-001** Both existing localized returns URLs show one localized H1, introduction, home breadcrumb and three anchor links: conditions, warranty and process.
- **R-002** The first content row contains two equal desktop panels: return conditions and warranty/delivery. On phones the panels stack. Conditions summarize the existing policy: 14 days from receipt, unused condition, full set/packaging and purchase proof.
- **R-003** A tinted process section explains three ordered actions: contact the manager with order number and photo/video, agree a resolution, pack and send the goods.
- **R-004** Important notes and a manager contact panel follow the process. The phone is taken from company configuration; the primary action is a real telephone link.
- **R-005** A real “full rules” anchor reveals the full existing policy on this page, including individual orders, warranty/technical allowances and logistics. Preserve source meaning in both languages; summaries do not replace conditions. A short native FAQ repeats sourced answers without new guarantees.
- **R-006** The page follows existing Onest typography, lucide icons, neutral surfaces, token colors, visible focus, light/dark themes and 16/24px shell gutters. Reading order is identical on phones. No horizontal scrolling, sticky sidebar, imagery or added page client state.
- **R-007** All copy, rules and FAQ answers are present in initial server HTML and remain usable without JavaScript. No remote data is needed; loading, API empty and API error states are n/a.
- **R-008** The public page uses localized metadata, self canonical, reciprocal language alternates and sitemap entries. Preview indexing remains off under existing configuration.

## Scenarios

| ID     | Given / When / Then                                                                                                                                                                   | Rule         | Verification                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------- |
| SC-001 | Given either supported language, when the page is requested, then its H1, intro, breadcrumb and three valid section links use that language.                                          | R-001        | Component                                                 |
| SC-002 | Given the page, when a visitor reads conditions and warranty, then all eight summary rows appear with the correct localized labels and existing policy meaning.                       | R-002        | Component                                                 |
| SC-003 | Given the process, when read in document order, then all three numbered actions and their explanations appear in sequence.                                                            | R-003        | Component                                                 |
| SC-004 | Given the contact panel, when the visitor follows the call action, then the target uses the configured company phone.                                                                 | R-004        | Component                                                 |
| SC-005 | Given the full-rules link, when followed, then it targets a real section containing all four policy topics; individual-order exclusions and technical allowances remain available.    | R-005        | Component                                                 |
| SC-006 | Given FAQ disclosure controls, when read without JavaScript, then questions and answers exist in native disclosure markup and are keyboard operable.                                  | R-005, R-007 | Component markup; native behavior                         |
| SC-007 | Given light/dark theme or narrow/wide viewport, when the page is styled, then tokens select the correct theme and columns collapse in the reading order without fixed content widths. | R-006        | Styles/code review; browser only with separate permission |
| SC-008 | Given either localized URL, when its metadata is produced, then title/description, self canonical and uk/ru/x-default alternates refer to this page.                                  | R-008        | SEO unit                                                  |
| SC-009 | Given the sitemap, when entries are composed, then both localized returns URLs and reciprocal alternates are present exactly once.                                                    | R-008        | SEO integration unit                                      |
| SC-010 | Given preview configuration, when metadata is produced, then existing noindex policy remains effective; unknown locales use existing 404 behavior.                                    | R-008        | Core metadata regression / route review                   |

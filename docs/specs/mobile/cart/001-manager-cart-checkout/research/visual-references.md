# Mobile manager cart checkout — visual references

| Question           | Chosen pattern                                                         | Evidence/reference                                 | Rejected alternative               | Reason                                            |
| ------------------ | ---------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------- | ------------------------------------------------- |
| Cart composition   | Vertical product cards, quantity controls, goods total, primary action | User screenshot, 2026-09-17                        | Delivery-oriented checkout summary | Only goods and manager order are in scope         |
| Checkout container | Bottom action sheet                                                    | Existing project ActionSheet pattern               | New modal/dropdown package         | Installed, approved and keyboard-aware            |
| Customer selection | Searchbar plus virtualized list in a sheet                             | Paper Searchbar, FlashList, expected 30–50 clients | Small popup menu                   | Search and long names need more space             |
| Form handling      | Existing RHF/Zod stack                                                 | Mobile architecture and installed dependencies     | Handwritten touched/error state    | Established form boundary                         |
| Quantity control   | Paper icon buttons with text value                                     | Existing corporate Paper theme                     | New stepper dependency             | Simple control is covered by installed primitives |

## Reference inventory

| Reference                                                                        | Applies to                                                 | Authority                           | Date/version                           |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------- | -------------------------------------- |
| `C:/Users/D5F0~1/AppData/Local/Temp/ai-chat-attachment-18141120138475893592.png` | Card hierarchy, quantity control, summary/action placement | User-provided composition reference | 2026-09-17                             |
| Existing Mobile catalog/product details                                          | Theme, type, imagery and interaction density               | Current application                 | repository state at specification date |
| Existing ActionSheet usage                                                       | Sheet behavior and visual integration                      | Current application                 | repository state at specification date |

The screenshot's address, delivery, tax, shipping, payment copy, colors and
fonts are explicitly non-authoritative.

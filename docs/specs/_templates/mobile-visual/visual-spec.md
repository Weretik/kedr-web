# Visual interaction contract: <component / screen>

## Wireframe / reference

<Figma link, screenshot або ASCII wireframe з позначеними зонами.>

## Anatomy

| Part   | Purpose         | Existing component / token          |
| ------ | --------------- | ----------------------------------- |
| <part> | <why it exists> | <Paper/RN component or theme token> |

## Interaction matrix

| Element   | Touch / keyboard action     | Result              | Accessible name   |
| --------- | --------------------------- | ------------------- | ----------------- |
| <element> | <tap, Enter, Space, Escape> | <observable result> | <localized label> |

## State matrix

| State                          | Visible content | Enabled actions | Transition |
| ------------------------------ | --------------- | --------------- | ---------- |
| Default                        |                 |                 |            |
| Loading                        |                 |                 |            |
| Success                        |                 |                 |            |
| Empty                          |                 |                 |            |
| Error                          |                 |                 |            |
| Selected / expanded / disabled |                 |                 |            |

## Layout and responsive behavior

- **Android phone:** <width, height, safe area, touch behavior>
- **Web:** <keyboard, focus, pointer, responsive width>
- **Scroll:** <scroll owner, max height, nested-scroll policy>

## Accessibility

- Touch target: `>= 48dp`.
- TalkBack / VoiceOver: <roles, labels, state announcements>.
- Keyboard/focus: <order, visible focus, Escape/dismiss>.
- Color and non-color state indicator: <how selected/error state is communicated>.

## Do / don't

| Do                 | Don't                                |
| ------------------ | ------------------------------------ |
| <approved pattern> | <rejected ambiguity or anti-pattern> |

## Visual acceptance

- [ ] Android reference state matches this contract.
- [ ] Web reference state matches this contract.
- [ ] Every interaction and state above has automated or manual evidence.

import StarterKit from '@tiptap/starter-kit';

/**
 * Only what the catalog backend keeps after sanitizing: paragraphs, line breaks, bold, italic,
 * H2, H3, bulleted and numbered lists, and links.
 */
export const richTextExtensions = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: { levels: [2, 3] },
    horizontalRule: false,
    link: {
      autolink: false,
      HTMLAttributes: { rel: null, target: null },
      openOnClick: false,
    },
    strike: false,
    underline: false,
  }),
];

/** http, https, or a site path starting with `/`, as the backend allows. */
export function validateLinkHref(value: string): string | undefined {
  const href = value.trim();
  if (!href) return 'Вкажіть адресу посилання.';
  if (/^https?:\/\/\S+$/i.test(href) || /^\/(?!\/)\S*$/.test(href)) return undefined;
  return 'Посилання має починатися з https://, http:// або / (сторінка сайту).';
}

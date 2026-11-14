import { Box, FormHelperText, Typography } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import { useId, useState } from 'react';

import { RichTextLinkDialog } from './rich-text-link-dialog';
import { RichTextToolbar } from './rich-text-toolbar';
import { useRichTextEditor } from './use-rich-text-editor';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  error?: string;
  /** Adds the quote button; only for texts whose backend sanitizer keeps `<blockquote>` (site documents). */
  allowQuotes?: boolean;
}

/**
 * Site text editor (category texts, articles); read-only mode renders stored HTML through the same schema,
 * not as raw HTML.
 */
export function RichTextEditor({
  allowQuotes = false,
  error,
  label,
  onChange,
  readOnly = false,
  value,
}: RichTextEditorProps) {
  const labelId = useId();
  const [linkOpen, setLinkOpen] = useState(false);
  const editor = useRichTextEditor({ allowQuotes, labelId, onChange, readOnly, value });

  if (!editor) return null;

  return (
    <Box>
      <Typography
        color="text.secondary"
        id={labelId}
        sx={{ display: 'block', mb: 0.5 }}
        variant="caption"
      >
        {label}
      </Typography>
      <Box
        sx={(theme) => ({
          border: readOnly ? 0 : 1,
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          '&:focus-within': readOnly ? undefined : { borderColor: 'primary.main' },
          '& .ProseMirror': {
            minHeight: readOnly ? 0 : 180,
            outline: 'none',
            p: readOnly ? 0 : 1.5,
            ...theme.typography.body2,
          },
          '& .ProseMirror h2': { ...theme.typography.h6, mb: 1, mt: 2 },
          '& .ProseMirror h3': { ...theme.typography.subtitle1, fontWeight: 700, mb: 1, mt: 2 },
          '& .ProseMirror p': { my: 1 },
          '& .ProseMirror a': { color: 'primary.main' },
          '& .ProseMirror blockquote': {
            borderLeft: 4,
            borderColor: 'divider',
            color: 'text.secondary',
            ml: 0,
            pl: 2,
          },
        })}
      >
        {readOnly ? null : (
          <RichTextToolbar
            allowQuotes={allowQuotes}
            editor={editor}
            onLink={() => setLinkOpen(true)}
          />
        )}
        <EditorContent editor={editor} />
      </Box>
      {error ? <FormHelperText error>{error}</FormHelperText> : null}
      <RichTextLinkDialog
        initialHref={(editor.getAttributes('link')['href'] as string | undefined) ?? ''}
        onClose={() => setLinkOpen(false)}
        onSubmit={(href) => {
          editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
          setLinkOpen(false);
        }}
        open={linkOpen}
      />
    </Box>
  );
}

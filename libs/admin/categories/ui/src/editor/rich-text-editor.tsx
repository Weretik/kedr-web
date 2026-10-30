import { Box, FormHelperText, Typography } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useId, useState } from 'react';

import { richTextExtensions } from './rich-text-extensions';
import { RichTextLinkDialog } from './rich-text-link-dialog';
import { RichTextToolbar } from './rich-text-toolbar';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  error?: string;
}

/** Category text editor; read-only mode renders stored HTML through the same schema, not as raw HTML. */
export function RichTextEditor({
  error,
  label,
  onChange,
  readOnly = false,
  value,
}: RichTextEditorProps) {
  const labelId = useId();
  const [linkOpen, setLinkOpen] = useState(false);
  const editor = useEditor({
    content: value,
    editable: !readOnly,
    editorProps: {
      attributes: { 'aria-labelledby': labelId, 'aria-multiline': 'true', role: 'textbox' },
    },
    extensions: richTextExtensions,
    immediatelyRender: true,
    onUpdate: ({ editor: current }) => onChange?.(current.getHTML()),
  });

  useEffect(() => {
    // Outside changes (reset, saved value) replace the content without reporting a change back.
    if (editor && editor.getHTML() !== value)
      editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

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
        })}
      >
        {readOnly ? null : <RichTextToolbar editor={editor} onLink={() => setLinkOpen(true)} />}
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

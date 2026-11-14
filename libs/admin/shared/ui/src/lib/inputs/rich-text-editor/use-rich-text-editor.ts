import { useEditor } from '@tiptap/react';
import { useEffect } from 'react';

import { createRichTextExtensions, richTextExtensions } from './rich-text-extensions';

interface RichTextEditorOptions {
  value: string;
  readOnly: boolean;
  allowQuotes: boolean;
  labelId: string;
  onChange?: (html: string) => void;
}

/** A Tiptap editor that follows outside value and read-only changes without reporting them back. */
export function useRichTextEditor({
  allowQuotes,
  labelId,
  onChange,
  readOnly,
  value,
}: RichTextEditorOptions) {
  const editor = useEditor({
    content: value,
    editable: !readOnly,
    editorProps: {
      attributes: { 'aria-labelledby': labelId, 'aria-multiline': 'true', role: 'textbox' },
    },
    extensions: allowQuotes ? createRichTextExtensions({ allowQuotes }) : richTextExtensions,
    immediatelyRender: true,
    onUpdate: ({ editor: current }) => onChange?.(current.getHTML()),
  });

  useEffect(() => {
    // Outside changes (reset, saved value) replace the content without reporting a change back.
    if (editor && editor.getHTML() !== value)
      editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    // Switching edit mode is not a content change, so it is not reported.
    editor?.setEditable(!readOnly, false);
  }, [editor, readOnly]);

  return editor;
}

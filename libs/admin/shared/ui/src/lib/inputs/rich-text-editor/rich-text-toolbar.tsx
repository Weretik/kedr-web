import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { Divider, Stack } from '@mui/material';
import { useEditorState } from '@tiptap/react';

import { ToolButton } from './rich-text-tool-button';

import type { Editor } from '@tiptap/react';

export function RichTextToolbar({
  allowQuotes = false,
  editor,
  onLink,
}: {
  allowQuotes?: boolean;
  editor: Editor;
  onLink: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      h2: current.isActive('heading', { level: 2 }),
      h3: current.isActive('heading', { level: 3 }),
      bulletList: current.isActive('bulletList'),
      orderedList: current.isActive('orderedList'),
      blockquote: current.isActive('blockquote'),
      link: current.isActive('link'),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  return (
    <Stack
      aria-label="Форматування тексту"
      direction="row"
      role="toolbar"
      sx={{ borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 0.5, p: 0.5 }}
    >
      <ToolButton active={state.bold} label="Жирний" onClick={() => chain().toggleBold().run()}>
        <FormatBoldIcon fontSize="small" />
      </ToolButton>
      <ToolButton active={state.italic} label="Курсив" onClick={() => chain().toggleItalic().run()}>
        <FormatItalicIcon fontSize="small" />
      </ToolButton>
      <Divider flexItem orientation="vertical" />
      <ToolButton
        active={state.h2}
        label="Заголовок H2"
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolButton>
      <ToolButton
        active={state.h3}
        label="Заголовок H3"
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolButton>
      <Divider flexItem orientation="vertical" />
      <ToolButton
        active={state.bulletList}
        label="Маркований список"
        onClick={() => chain().toggleBulletList().run()}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToolButton>
      <ToolButton
        active={state.orderedList}
        label="Нумерований список"
        onClick={() => chain().toggleOrderedList().run()}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToolButton>
      {allowQuotes ? (
        <ToolButton
          active={state.blockquote}
          label="Примітка (цитата)"
          onClick={() => chain().toggleBlockquote().run()}
        >
          <FormatQuoteIcon fontSize="small" />
        </ToolButton>
      ) : null}
      <Divider flexItem orientation="vertical" />
      <ToolButton active={state.link} label="Додати посилання" onClick={onLink}>
        <LinkIcon fontSize="small" />
      </ToolButton>
      <ToolButton
        disabled={!state.link}
        label="Прибрати посилання"
        onClick={() => chain().extendMarkRange('link').unsetLink().run()}
      >
        <LinkOffIcon fontSize="small" />
      </ToolButton>
      <Divider flexItem orientation="vertical" />
      <ToolButton
        disabled={!state.canUndo}
        label="Скасувати дію"
        onClick={() => chain().undo().run()}
      >
        <UndoIcon fontSize="small" />
      </ToolButton>
      <ToolButton
        disabled={!state.canRedo}
        label="Повторити дію"
        onClick={() => chain().redo().run()}
      >
        <RedoIcon fontSize="small" />
      </ToolButton>
    </Stack>
  );
}

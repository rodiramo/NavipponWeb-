import { EditorContent, useEditor } from "@tiptap/react";
import "highlight.js/styles/atom-one-dark.css";
import MenuBar from "./MenuBar";
import { extensions } from "../../constants/tiptapExtensions";
import { useTheme } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";

const Editor = ({ onDataChange, content = null, editable = true }) => {
  const theme = useTheme();

  const editor = useEditor({
    editable,
    extensions: [
      Placeholder.configure({
        placeholder: "Escribe aquí ...",
      }),
      ...extensions,
    ],
    editorProps: {
      attributes: {
        class:
          "!prose !dark:prose-invert prose-sm sm:prose-base max-w-none mt-7 focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onDataChange(json);
    },
    content: content,
  });

  return (
    <div
      style={{
        width: "100%",
        border: `2px solid ${theme.palette.secondary.light}`,
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;

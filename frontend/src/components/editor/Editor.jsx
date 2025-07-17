import { EditorContent, useEditor } from "@tiptap/react";
import "highlight.js/styles/atom-one-dark.css";
import MenuBar from "./MenuBar";
import { extensions } from "../../constants/tiptapExtensions";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";

const Editor = ({ onDataChange, content = null, editable = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isXS = useMediaQuery("(max-width:480px)");

  // Get responsive prose classes
  const getProseClasses = () => {
    let baseClasses =
      "!prose !dark:prose-invert max-w-none focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]";

    if (isXS) {
      return `${baseClasses} prose-sm`;
    } else if (isSmall) {
      return `${baseClasses} prose-sm sm:prose-base`;
    } else if (isMobile) {
      return `${baseClasses} prose-base`;
    } else {
      return `${baseClasses} prose-sm sm:prose-base lg:prose-lg`;
    }
  };

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
        class: getProseClasses(),
        style: `
          min-height: ${isXS ? "120px" : isSmall ? "150px" : isMobile ? "200px" : "250px"};
          padding: ${isXS ? "8px" : isSmall ? "12px" : "16px"};
          margin-top: ${editable ? (isXS ? "8px" : "12px") : "0"};
          line-height: ${isXS ? "1.4" : "1.6"};
          font-size: ${isXS ? "14px" : isSmall ? "15px" : "16px"};
        `,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onDataChange(json);
    },
    content: content,
  });

  return (
    <Box
      sx={{
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: isXS ? "8px" : "12px",
        p: isXS ? 1 : isSmall ? 1.5 : 2,
        backgroundColor: theme.palette.background.default,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        "& .ProseMirror": {
          outline: "none",
          "& h1": {
            fontSize: isXS ? "1.5rem" : isSmall ? "1.75rem" : "2rem",
            fontWeight: "bold",
            marginBottom: isXS ? "0.5rem" : "0.75rem",
            marginTop: isXS ? "1rem" : "1.25rem",
            lineHeight: "1.2",
          },
          "& h2": {
            fontSize: isXS ? "1.25rem" : isSmall ? "1.5rem" : "1.75rem",
            fontWeight: "bold",
            marginBottom: isXS ? "0.5rem" : "0.75rem",
            marginTop: isXS ? "0.75rem" : "1rem",
            lineHeight: "1.3",
          },
          "& h3": {
            fontSize: isXS ? "1.125rem" : isSmall ? "1.25rem" : "1.5rem",
            fontWeight: "bold",
            marginBottom: isXS ? "0.25rem" : "0.5rem",
            marginTop: isXS ? "0.5rem" : "0.75rem",
            lineHeight: "1.3",
          },
          "& h4": {
            fontSize: isXS ? "1rem" : isSmall ? "1.125rem" : "1.25rem",
            fontWeight: "bold",
            marginBottom: isXS ? "0.25rem" : "0.5rem",
            marginTop: isXS ? "0.5rem" : "0.75rem",
          },
          "& h5": {
            fontSize: isXS ? "0.95rem" : isSmall ? "1rem" : "1.125rem",
            fontWeight: "bold",
            marginBottom: isXS ? "0.25rem" : "0.5rem",
            marginTop: isXS ? "0.5rem" : "0.75rem",
          },
          "& h6": {
            fontSize: isXS ? "0.9rem" : isSmall ? "0.95rem" : "1rem",
            fontWeight: "bold",
            marginBottom: isXS ? "0.25rem" : "0.5rem",
            marginTop: isXS ? "0.5rem" : "0.75rem",
          },
          "& p": {
            fontSize: isXS ? "14px" : isSmall ? "15px" : "16px",
            lineHeight: isXS ? "1.4" : "1.6",
            marginBottom: isXS ? "0.5rem" : "0.75rem",
          },
          "& blockquote": {
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            paddingLeft: isXS ? "0.75rem" : "1rem",
            marginLeft: 0,
            marginRight: 0,
            marginBottom: isXS ? "0.5rem" : "0.75rem",
            fontStyle: "italic",
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.action.hover,
            padding: isXS ? "0.5rem 0.75rem" : "0.75rem 1rem",
            borderRadius: "4px",
          },
          "& code": {
            backgroundColor: theme.palette.action.hover,
            padding: "2px 4px",
            borderRadius: "3px",
            fontSize: isXS ? "13px" : "14px",
            fontFamily: "monospace",
          },
          "& pre": {
            backgroundColor: "#282c34",
            color: "#abb2bf",
            padding: isXS ? "0.75rem" : "1rem",
            borderRadius: isXS ? "6px" : "8px",
            overflow: "auto",
            fontSize: isXS ? "13px" : "14px",
            lineHeight: "1.4",
            marginBottom: isXS ? "0.5rem" : "0.75rem",
          },
          "& hr": {
            border: "none",
            borderTop: `2px solid ${theme.palette.divider}`,
            margin: isXS ? "1rem 0" : "1.5rem 0",
          },
          "& strong": {
            fontWeight: "bold",
          },
          "& em": {
            fontStyle: "italic",
          },
          "& u": {
            textDecoration: "underline",
          },
          "& s": {
            textDecoration: "line-through",
          },
        },
        "& .ProseMirror p.is-editor-empty:first-child::before": {
          content: "attr(data-placeholder)",
          float: "left",
          color: theme.palette.text.disabled,
          pointerEvents: "none",
          height: 0,
          fontSize: isXS ? "14px" : isSmall ? "15px" : "16px",
        },
      }}
    >
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </Box>
  );
};

export default Editor;

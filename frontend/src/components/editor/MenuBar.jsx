import { useState } from "react";
import {
  AiOutlineBold,
  AiOutlineEnter,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineRedo,
  AiOutlineStrikethrough,
  AiOutlineUndo,
  AiOutlineUnderline,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { Tooltip } from "@mui/material";
import { BiColorFill } from "react-icons/bi";
import { useTheme } from "@mui/material";
import { MdOutlineLayersClear } from "react-icons/md";
import { PiQuotes } from "react-icons/pi";
import { TbSpacingVertical } from "react-icons/tb";

const MenuBar = ({ editor }) => {
  const theme = useTheme();
  const [selectedColor, setSelectedColor] = useState(
    theme.palette.primary.main
  );

  if (!editor) {
    return null;
  }

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
    editor.chain().focus().setMark("textStyle", { color: newColor }).run();
  };

  return (
    <div className="border border-slate-300 rounded-lg p-5 sticky top-3 left-0 right-0 bg-white z-10 flex gap-0.5 flex-wrap">
      {[
        {
          action: () => editor.chain().focus().setParagraph().run(),
          label: "P",
          type: "paragraph",
        },
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          label: "H1",
          type: "heading",
          level: 1,
        },
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          label: "H2",
          type: "heading",
          level: 2,
        },
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          label: "H3",
          type: "heading",
          level: 3,
        },
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
          label: "H4",
          type: "heading",
          level: 4,
        },
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 5 }).run(),
          label: "H5",
          type: "heading",
          level: 5,
        },
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 6 }).run(),
          label: "H6",
          type: "heading",
          level: 6,
        },
      ].map(({ action, label, type, level }) => (
        <button
          key={label}
          onClick={action}
          style={{
            backgroundColor: editor.isActive(
              type,
              level ? { level } : undefined
            )
              ? theme.palette.primary.main
              : theme.palette.secondary.light,
            color: editor.isActive(type, level ? { level } : undefined)
              ? "white"
              : theme.palette.text.primary,
            padding: "8px",
            borderRadius: "30rem",
            transition: "background-color 0.3s ease-in-out",
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}

      {/* Text Formatting Buttons */}
      {[
        {
          action: () => editor.chain().focus().toggleBold().run(),
          icon: <AiOutlineBold />,
          tooltip: "Negrita",
          type: "bold",
        },
        {
          action: () => editor.chain().focus().toggleItalic().run(),
          icon: <AiOutlineItalic />,
          tooltip: "Itálica",
          type: "italic",
        },
        {
          action: () => editor.chain().focus().toggleUnderline().run(),
          icon: <AiOutlineUnderline />,
          tooltip: "Subrayar",
          type: "underline",
        },
        {
          action: () => editor.chain().focus().toggleStrike().run(),
          icon: <AiOutlineStrikethrough />,
          tooltip: "Tachar",
          type: "strike",
        },
        {
          action: () => editor.chain().focus().unsetAllMarks().run(),
          icon: <MdOutlineLayersClear />,
          tooltip: "Borrar Estilos",
        },
      ].map(({ action, icon, tooltip, type }) => (
        <Tooltip key={tooltip} title={tooltip} placement="top">
          <button
            onClick={action}
            disabled={
              type &&
              !editor
                .can()
                .chain()
                .focus()
                [`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`]()
                .run()
            }
            style={{
              backgroundColor: editor.isActive(type)
                ? theme.palette.primary.main
                : theme.palette.secondary.light,
              color: editor.isActive(type)
                ? "white"
                : theme.palette.text.primary,
              padding: "8px",
              borderRadius: "30rem",
              transition: "background-color 0.3s ease-in-out",
              cursor: "pointer",
            }}
          >
            {icon}
          </button>
        </Tooltip>
      ))}

      {/* List and Block Formatting */}
      {[
        {
          action: () => editor.chain().focus().toggleBulletList().run(),
          icon: <AiOutlineUnorderedList />,
          tooltip: "Lista con Viñetas",
          type: "bulletList",
        },
        {
          action: () => editor.chain().focus().toggleOrderedList().run(),
          icon: <AiOutlineOrderedList />,
          tooltip: "Lista Numerada",
          type: "orderedList",
        },
        {
          action: () => editor.chain().focus().toggleBlockquote().run(),
          icon: <PiQuotes />,
          tooltip: "Cita",
          type: "blockquote",
        },
        {
          action: () => editor.chain().focus().setHorizontalRule().run(),
          icon: <TbSpacingVertical />,
          tooltip: "Línea Horizontal",
        },
        {
          action: () => editor.chain().focus().setHardBreak().run(),
          icon: <AiOutlineEnter />,
          tooltip: "Salto de Línea",
        },
      ].map(({ action, icon, tooltip, type }) => (
        <Tooltip key={tooltip} title={tooltip} placement="top">
          <button
            onClick={action}
            style={{
              backgroundColor: editor.isActive(type)
                ? theme.palette.primary.main
                : theme.palette.secondary.light,
              color: editor.isActive(type)
                ? "white"
                : theme.palette.text.primary,
              padding: "8px",
              borderRadius: "30rem",
              transition: "background-color 0.3s ease-in-out",
              cursor: "pointer",
            }}
          >
            {icon}
          </button>
        </Tooltip>
      ))}

      {/* Undo / Redo */}
      {[
        {
          action: () => editor.chain().focus().undo().run(),
          icon: <AiOutlineUndo />,
          tooltip: "Deshacer",
        },
        {
          action: () => editor.chain().focus().redo().run(),
          icon: <AiOutlineRedo />,
          tooltip: "Rehacer",
        },
      ].map(({ action, icon, tooltip }) => (
        <Tooltip key={tooltip} title={tooltip} placement="top">
          <button
            onClick={action}
            style={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.text.primary,
              padding: "8px",
              borderRadius: "30rem",
              transition: "background-color 0.3s ease-in-out",
              cursor: "pointer",
            }}
          >
            {icon}
          </button>
        </Tooltip>
      ))}

      {/* Change Text Color */}
      <Tooltip title={"Cambiar color del texto"} placement="top">
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            className="editor-btn"
            style={{
              color: selectedColor,
              transition: "color 0.3s ease-in-out",
              backgroundColor: theme.palette.secondary.light,
              padding: "8px",
              borderRadius: "30rem",
              cursor: "pointer",
            }}
          >
            <BiColorFill />
          </button>
          <input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default MenuBar;

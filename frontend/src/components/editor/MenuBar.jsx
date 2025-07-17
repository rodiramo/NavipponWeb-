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
import { Tooltip, Box } from "@mui/material";
import { BiColorFill } from "react-icons/bi";
import { useTheme, useMediaQuery } from "@mui/material";
import { MdOutlineLayersClear } from "react-icons/md";
import { PiQuotes } from "react-icons/pi";
import { TbSpacingVertical } from "react-icons/tb";

const MenuBar = ({ editor }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isXS = useMediaQuery("(max-width:480px)");

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

  // Get responsive button styles
  const getButtonStyle = (isActive = false, isSpecial = false) => ({
    backgroundColor: isActive
      ? theme.palette.primary.main
      : isSpecial
        ? theme.palette.background.paper
        : theme.palette.background.paper,
    color: isActive ? "white" : theme.palette.text.primary,
    border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: isXS ? "6px" : "8px",
    padding: isXS ? "6px" : isSmall ? "8px" : "10px",
    minWidth: isXS ? "32px" : isSmall ? "36px" : "40px",
    height: isXS ? "32px" : isSmall ? "36px" : "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    fontSize: isXS ? "12px" : isSmall ? "13px" : "14px",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: isActive
        ? theme.palette.primary.dark
        : theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
    },
  });

  // Responsive icon size
  const iconSize = isXS ? 14 : 16;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: isXS ? "8px" : "12px",
        p: isXS ? 1 : isSmall ? 1.5 : 2,
        position: "sticky",
        top: isXS ? 8 : 12,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.background.default,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        gap: isXS ? 0.5 : 1,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
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
        // Hide H4-H6 on very small screens
        ...(isXS
          ? []
          : [
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
            ]),
      ].map(({ action, label, type, level }) => (
        <button
          key={label}
          onClick={action}
          style={getButtonStyle(
            editor.isActive(type, level ? { level } : undefined)
          )}
        >
          {label}
        </button>
      ))}

      {/* Text Formatting Buttons */}
      {[
        {
          action: () => editor.chain().focus().toggleBold().run(),
          icon: <AiOutlineBold size={iconSize} />,
          tooltip: "Negrita",
          type: "bold",
        },
        {
          action: () => editor.chain().focus().toggleItalic().run(),
          icon: <AiOutlineItalic size={iconSize} />,
          tooltip: "Itálica",
          type: "italic",
        },
        {
          action: () => editor.chain().focus().toggleUnderline().run(),
          icon: <AiOutlineUnderline size={iconSize} />,
          tooltip: "Subrayar",
          type: "underline",
        },
        {
          action: () => editor.chain().focus().toggleStrike().run(),
          icon: <AiOutlineStrikethrough size={iconSize} />,
          tooltip: "Tachar",
          type: "strike",
        },
        {
          action: () => editor.chain().focus().unsetAllMarks().run(),
          icon: <MdOutlineLayersClear size={iconSize} />,
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
            style={getButtonStyle(editor.isActive(type))}
          >
            {icon}
          </button>
        </Tooltip>
      ))}

      {/* List and Block Formatting */}
      {[
        {
          action: () => editor.chain().focus().toggleBulletList().run(),
          icon: <AiOutlineUnorderedList size={iconSize} />,
          tooltip: "Lista con Viñetas",
          type: "bulletList",
        },
        {
          action: () => editor.chain().focus().toggleOrderedList().run(),
          icon: <AiOutlineOrderedList size={iconSize} />,
          tooltip: "Lista Numerada",
          type: "orderedList",
        },
        {
          action: () => editor.chain().focus().toggleBlockquote().run(),
          icon: <PiQuotes size={iconSize} />,
          tooltip: "Cita",
          type: "blockquote",
        },
        // Hide some buttons on very small screens
        ...(isXS
          ? []
          : [
              {
                action: () => editor.chain().focus().setHorizontalRule().run(),
                icon: <TbSpacingVertical size={iconSize} />,
                tooltip: "Línea Horizontal",
              },
              {
                action: () => editor.chain().focus().setHardBreak().run(),
                icon: <AiOutlineEnter size={iconSize} />,
                tooltip: "Salto de Línea",
              },
            ]),
      ].map(({ action, icon, tooltip, type }) => (
        <Tooltip key={tooltip} title={tooltip} placement="top">
          <button
            onClick={action}
            style={getButtonStyle(editor.isActive(type))}
          >
            {icon}
          </button>
        </Tooltip>
      ))}

      {/* Undo / Redo */}
      {[
        {
          action: () => editor.chain().focus().undo().run(),
          icon: <AiOutlineUndo size={iconSize} />,
          tooltip: "Deshacer",
        },
        {
          action: () => editor.chain().focus().redo().run(),
          icon: <AiOutlineRedo size={iconSize} />,
          tooltip: "Rehacer",
        },
      ].map(({ action, icon, tooltip }) => (
        <Tooltip key={tooltip} title={tooltip} placement="top">
          <button onClick={action} style={getButtonStyle(false, true)}>
            {icon}
          </button>
        </Tooltip>
      ))}

      {/* Change Text Color */}
      <Tooltip title={"Cambiar color del texto"} placement="top">
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            style={{
              ...getButtonStyle(false, true),
              color: selectedColor,
            }}
          >
            <BiColorFill size={iconSize} />
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
        </Box>
      </Tooltip>
    </Box>
  );
};

export default MenuBar;

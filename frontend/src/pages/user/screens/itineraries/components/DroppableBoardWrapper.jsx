// Create a new file: DroppableBoardWrapper.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";

const DroppableBoardWrapper = ({ children, boardId, board }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `board-${boardId}`,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: "relative",
        opacity: isOver ? 0.8 : 1,
        transform: isOver ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
        "&::after": isOver
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: "2px dashed #1976d2",
              borderRadius: "20px",
              pointerEvents: "none",
              zIndex: 10,
            }
          : {},
      }}
    >
      {children}
    </Box>
  );
};

export default DroppableBoardWrapper;

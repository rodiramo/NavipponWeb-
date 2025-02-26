import React, { useEffect, useRef } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

// TrelloBoards now receives boards, setBoards, and handleRemoveBoard as props.
export default function TrelloBoards({ boards, setBoards, handleRemoveBoard }) {
  const theme = useTheme();
  const boardRefs = useRef({});
  const favoritesRefs = useRef({});

  // Register each board element (for reordering boards)
  useEffect(() => {
    const boardCleanups = boards.map((board) => {
      const element = boardRefs.current[board.id];
      if (!element) return () => {};
      const cleanupDraggable = draggable({
        element,
        data: { type: "board", boardId: board.id },
      });
      const cleanupDrop = dropTargetForElements({
        element,
        data: { boardId: board.id },
      });
      return combine(cleanupDraggable, cleanupDrop);
    });
    return () => {
      boardCleanups.forEach((cleanup) => cleanup());
    };
  }, [boards]);

  // Register each favorites area as a drop target (for dropping favorites)
  useEffect(() => {
    const favCleanups = boards.map((board) => {
      const element = favoritesRefs.current[board.id];
      if (!element) return () => {};
      // Register the drop target for favorites. We use a different data type.
      const cleanupDropFav = dropTargetForElements({
        element,
        data: { type: "favorite", boardId: board.id },
      });
      return cleanupDropFav;
    });
    return () => {
      favCleanups.forEach((cleanup) => cleanup());
    };
  }, [boards]);

  // Monitor drop events for board reordering.
  useEffect(() => {
    const cleanupBoardMonitor = monitorForElements({
      canMonitor({ source }) {
        return source.data && source.data.type === "board";
      },
      onDrop({ location, source }) {
        if (!location.current.dropTargets.length) return;
        const target = location.current.dropTargets[0];
        const targetBoardId = target.data.boardId;
        const sourceBoardId = source.data.boardId;
        if (!sourceBoardId || !targetBoardId) return;

        const sourceIndex = boards.findIndex((b) => b.id === sourceBoardId);
        const targetIndex = boards.findIndex((b) => b.id === targetBoardId);
        if (sourceIndex === -1 || targetIndex === -1) return;

        const newBoards = reorder(boards, sourceIndex, targetIndex);
        setBoards(newBoards);

        const targetElement = boardRefs.current[targetBoardId];
        if (targetElement) {
          targetElement.classList.add("flash");
          setTimeout(() => {
            targetElement.classList.remove("flash");
          }, 1000);
        }
      },
    });
    return cleanupBoardMonitor;
  }, [boards, setBoards]);

  // Monitor drop events for favorites.
  useEffect(() => {
    const cleanupFavMonitor = monitorForElements({
      canMonitor({ source }) {
        return source.data && source.data.type === "favorite";
      },
      onDrop({ location, source }) {
        if (!location.current.dropTargets.length) return;
        // Use first drop target in favorites area.
        const target = location.current.dropTargets[0];
        const boardId = target.data.boardId;
        if (!boardId) return;

        // Assume the favorite was set in the drag data.
        const droppedFavorite = source.data.favorite;
        if (!droppedFavorite) return;

        // Update boards: add the dropped favorite into the appropriate board.
        setBoards((prevBoards) =>
          prevBoards.map((board) => {
            if (board.id === boardId) {
              // Avoid duplicates if needed.
              return {
                ...board,
                favorites: [...board.favorites, droppedFavorite],
                dailyBudget:
                  board.dailyBudget +
                  (droppedFavorite.experienceId?.price || 0),
              };
            }
            return board;
          })
        );
      },
    });
    return cleanupFavMonitor;
  }, [setBoards]);

  return (
    <Box sx={{ display: "flex", overflowX: "auto", gap: 2, p: 1 }}>
      {boards.map((board, index) => (
        <Box
          key={board.id}
          ref={(el) => (boardRefs.current[board.id] = el)}
          sx={{
            p: 2,
            border: `2px dashed ${theme.palette.secondary.light}`,
            borderRadius: 2,
            minWidth: 250,
            flex: "0 0 250px",
            backgroundColor: theme.palette.background.paper,
            position: "relative",
          }}
        >
          {/* Board header styled like a Trello list header */}
          <Box
            sx={{
              backgroundColor: theme.palette.primary.light,
              borderRadius: 1,
              px: 1,
              py: 0.5,
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#172b4d" }}
            >
              Día {index + 1}
            </Typography>
          </Box>
          <TextField
            label="Fecha"
            value={board.date}
            fullWidth
            disabled
            sx={{ mt: 1, mb: 1 }}
          />
          <Typography variant="body2" sx={{ mb: 1, color: "#5e6c84" }}>
            Actividades
          </Typography>
          {/* Favorites drop area */}
          <Box
            ref={(el) => (favoritesRefs.current[board.id] = el)}
            sx={{
              minHeight: 100,
              backgroundColor: "#f4f5f7",
              borderRadius: 1,
              p: 1,
              mb: 1,
            }}
          >
            {board.favorites.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                Arrastra y suelta actividades aquí
              </Typography>
            ) : (
              board.favorites.map((fav, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 0 rgba(9,30,66,.25)",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">{fav.title}</Typography>
                </Box>
              ))
            )}
          </Box>
          <Button
            onClick={() => handleRemoveBoard(index)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: theme.palette.error.main,
              fontSize: "0.75rem",
            }}
          >
            Eliminar
          </Button>
        </Box>
      ))}
    </Box>
  );
}

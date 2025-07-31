// AddBoardCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  IconButton,
  useTheme,
  Typography,
} from "@mui/material";
import { Plus } from "lucide-react";

const AddBoardCard = ({ onAddBoard }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 300,
        flexShrink: 0,
        height: 250,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: theme.palette.background.paper,
        border: `2px dashed ${theme.palette.divider}`,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
          borderColor: theme.palette.primary.main,
          boxShadow: 3,
        },
      }}
      onClick={onAddBoard}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          sx={{
            width: 60,
            height: 60,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Plus size={28} />
        </IconButton>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.secondary,
          }}
        >
          Agregar día
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AddBoardCard;

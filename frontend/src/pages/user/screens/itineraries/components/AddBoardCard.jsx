// AddBoardCard.jsx
import React from "react";
import { Card, CardContent, IconButton, useTheme } from "@mui/material";
import { Plus } from "lucide-react";

const AddBoardCard = ({ onAddBoard }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 300,
        flexShrink: 0,
        height: 650,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
          boxShadow: 3,
        },
      }}
      onClick={onAddBoard}
    >
      <CardContent>
        <IconButton>
          <Plus size={24} />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default AddBoardCard;

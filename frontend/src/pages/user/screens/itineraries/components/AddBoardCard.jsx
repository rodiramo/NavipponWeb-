// AddBoardCard.jsx
import React from "react";
import { Card, CardContent, IconButton } from "@mui/material";
import { Plus } from "lucide-react";

const AddBoardCard = ({ onAddBoard }) => {
  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 300,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
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

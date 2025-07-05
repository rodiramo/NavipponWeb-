import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { stables } from "../constants";
import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import { Edit } from "@mui/icons-material";
import CropEasy from "./crop/CropEasy";
import { toast } from "react-hot-toast";

const ProfilePicture = ({ avatar, size = "120px" }) => {
  const theme = useTheme();
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [localAvatar, setLocalAvatar] = useState(avatar);

  useEffect(() => {
    setLocalAvatar(avatar);
  }, [avatar]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setPhoto({ url: URL.createObjectURL(file), file });
    setOpenCrop(true);
  };

  return (
    <>
      {openCrop &&
        createPortal(
          <CropEasy
            photo={photo}
            setOpenCrop={setOpenCrop}
            onAvatarChange={(newAvatar) => {
              setLocalAvatar(newAvatar);
            }}
          />,
          document.getElementById("portal")
        )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Profile Image */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={
              localAvatar
                ? `${stables.UPLOAD_FOLDER_BASE_URL}${localAvatar}`
                : undefined // Let Material-UI handle the default
            }
            alt="profile"
            sx={{
              width: size,
              height: size,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              fontSize: `calc(${size} * 0.4)`, // Scale font size with avatar size
            }}
          >
            {!localAvatar && "?"} {/* Show question mark if no avatar */}
          </Avatar>

          {/* Edit Button */}
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: -8,
              right: -8,
              width: 36,
              height: 36,
              backgroundColor: theme.palette.primary.main,
              color: "white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <Edit sx={{ fontSize: 18 }} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePicture;

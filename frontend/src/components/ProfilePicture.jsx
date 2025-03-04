import React, { useState } from "react";
import { createPortal } from "react-dom";
import { stables } from "../constants";
import { Avatar, Box, IconButton, Button, useTheme } from "@mui/material";
import { HiOutlineCamera } from "react-icons/hi";
import { EditOutlined, Close } from "@mui/icons-material";
import CropEasy from "./crop/CropEasy";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePicture } from "../services/index/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userActions } from "../store/reducers/userReducers";
import useUser from "../hooks/useUser";

const ProfilePicture = ({ avatar }) => {
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);

  const { mutate } = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePicture({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data)); // ✅ Update Redux Store
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));

      // ✅ Invalidate Queries to refresh all components using profile data
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["friends"]); // If profile picture appears in friends list

      toast.success("La foto de perfil ha sido actualizada");
    },

    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn("File selection was canceled."); // ✅ Log for debugging (optional)
      return; // ✅ Exit function if no file is selected
    }

    setPhoto({ url: URL.createObjectURL(file), file });
    setOpenCrop(true);
  };

  const handleDeleteImage = () => {
    if (window.confirm("¿Deseas eliminar tu foto de perfil?")) {
      try {
        const formData = new FormData();
        formData.append("profilePicture", undefined);

        mutate({ token: jwt, formData: formData });
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    }
  };

  return (
    <>
      {openCrop &&
        createPortal(
          <CropEasy photo={photo} setOpenCrop={setOpenCrop} />,
          document.getElementById("portal")
        )}

      {/* Profile Picture Wrapper */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          position: "relative",
        }}
      >
        {/* Profile Image */}
        <Box sx={{ position: "relative", width: "120px", height: "120px" }}>
          <Avatar
            src={
              stables.UPLOAD_FOLDER_BASE_URL + avatar || "/default-avatar.png"
            }
            alt="profile"
            sx={{
              width: "120px",
              height: "120px",
              border: `2px solid ${theme.palette.primary.main}`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Upload Button (Click to change profile picture) */}
          <label htmlFor="profilePicture">
            <IconButton
              sx={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                background: theme.palette.primary.main,
                color: theme.palette.common.white,
                "&:hover": {
                  background: theme.palette.primary.dark,
                },
              }}
              component="span"
            >
              <HiOutlineCamera />
            </IconButton>
          </label>
        </Box>

        {/* Hidden File Input */}
        <input
          type="file"
          className="sr-only"
          id="profilePicture"
          onChange={handleFileChange}
        />

        {/* Delete Button */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteImage}
          sx={{
            mt: 1,
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Eliminar Foto
        </Button>
      </Box>
    </>
  );
};

export default ProfilePicture;

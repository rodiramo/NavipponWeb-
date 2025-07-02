import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { stables } from "../constants";
import { Avatar, Box, IconButton, Button, useTheme } from "@mui/material";
import { HiOutlineCamera } from "react-icons/hi";
import CropEasy from "./crop/CropEasy";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateProfilePicture } from "../services/index/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userActions } from "../store/reducers/userReducers";
import useUser from "../hooks/useUser";

const ProfilePicture = ({ avatar }) => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [localAvatar, setLocalAvatar] = useState(avatar);

  useEffect(() => {
    setLocalAvatar(avatar);
  }, [avatar]);

  const { mutate } = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePicture({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["friends"]);
      toast.success("La foto de perfil ha sido actualizada");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
          <CropEasy
            photo={photo}
            setOpenCrop={setOpenCrop}
            onAvatarChange={(newAvatar) => {
              setLocalAvatar(newAvatar);
              queryClient.invalidateQueries(["profile"]);
            }}
          />,
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
              localAvatar
                ? stables.UPLOAD_FOLDER_BASE_URL + localAvatar
                : "/default-avatar.png"
            }
            alt="profile"
            sx={{
              width: "120px",
              height: "120px",
              border: `2px solid ${theme.palette.primary.main}`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Upload Button */}
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
            mb: 2,
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Eliminar avatar
        </Button>
      </Box>
    </>
  );
};

export default ProfilePicture;

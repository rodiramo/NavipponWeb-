import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserFriends } from "../../../services/index/users";
import { setFriends } from "../../../store/reducers/authSlice";
import useUser from "../../../hooks/useUser"; // ✅ Import useUser hook

const FriendsWidget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, jwt: token } = useUser(); // ✅ Get user and token from hook

  const friends = user?.friends ?? []; // ✅ Ensure friends is always an array

  useEffect(() => {
    if (token && user?._id) {
      getUserFriends({ userId: user._id, token })
        .then((data) => {
          console.log("🔍 API Friends Response:", data); // ✅ Debugging response
          if (Array.isArray(data)) {
            dispatch(setFriends(data)); // ✅ Store populated friend objects
          } else {
            console.error("⚠️ Expected an array, received:", data);
          }
        })
        .catch((error) => console.error("Error fetching friends:", error));
    }
  }, [token, user?._id, dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        padding: "1rem",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Amigos
      </Typography>

      {friends.length === 0 ? (
        <Typography sx={{ color: "gray", textAlign: "center" }}>
          No tienes amigos agregados.
        </Typography>
      ) : (
        friends.map((friend, index) => (
          <Box
            key={friend._id || index} // ✅ Ensure a unique key (fallback to index if needed)
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}
          >
            <Avatar
              src={friend.avatar || "/default-avatar.png"}
              alt={friend.name || "Amigo"}
              sx={{ width: "40px", height: "40px" }}
            />
            <Typography sx={{ flexGrow: 1, fontWeight: "500" }}>
              {friend.name || "Desconocido"} {/* ✅ Handle missing names */}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/profile/${friend._id}`)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
              }}
            >
              Ver
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default FriendsWidget;

import PropTypes from "prop-types";
import { Avatar, Box } from "@mui/material";
import { stables } from "../constants";

const UserImage = ({ image, name = "Usuario", size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <Avatar
        src={
          image
            ? `${stables.UPLOAD_FOLDER_BASE_URL}/${image}`
            : "/default-avatar.png"
        }
        alt={name} // ✅ Use `name` for accessibility
        sx={{ width: size, height: size }}
      />
    </Box>
  );
};

UserImage.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.string,
};

export default UserImage;

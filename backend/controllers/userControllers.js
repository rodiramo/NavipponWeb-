import upload from "../middleware/uploadPictureMiddleware.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinaryConfig.js";

import Post from "../models/Post.js";
import User from "../models/User.js";
import { fileRemover } from "../utils/fileRemover.js";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("El usuario ya existe");
    }

    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email no encontrado");
    }

    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Email o contraseña incorrectos");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.userId;

    let userId = req.user._id;

    if (!req.user.admin && userId !== userIdToUpdate) {
      let error = new Error("Recursos no autorizados");
      error.statusCode = 403;
      throw error;
    }

    let user = await User.findById(userIdToUpdate);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (typeof req.body.admin !== "undefined" && req.user.admin) {
      user.admin = req.body.admin;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUserProfile = await user.save();

    res.json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found.");
    }

    // ✅ Delete the old avatar if exists
    if (user.avatar) {
      await cloudinary.uploader.destroy(user.avatar);
    }

    // ✅ Upload the new avatar to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads", // Store images inside 'uploads' folder
    });

    // ✅ Save only the `public_id` instead of full URL
    user.avatar = result.public_id; // 👈 This saves only "uploads/1739621073399-activities"

    await user.save();

    res.json({
      _id: user._id,
      avatar: user.avatar, // Returns only `public_id`
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.email = { $regex: filter, $options: "i" };
    }
    let query = User.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error("User no found");
    }

    const postsToDelete = await Post.find({ user: user._id });
    const postIdsToDelete = postsToDelete.map((post) => post._id);

    await Comment.deleteMany({
      post: { $in: postIdsToDelete },
    });

    await Post.deleteMany({
      _id: { $in: postIdsToDelete },
    });

    postsToDelete.forEach((post) => {
      fileRemover(post.photo);
    });

    await user.remove();
    fileRemover(user.avatar);

    res.status(204).json({ message: "Usuario borrado con éxito" });
  } catch (error) {
    next(error);
  }
};

export const toggleFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: "No puedes agregarte a ti mismo." });
    }

    const user = await User.findById(currentUserId);
    const friend = await User.findById(userId);

    if (!user || !friend) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Check if they are already friends
    const isFriend = user.friends.includes(userId);

    if (isFriend) {
      // ❌ Remove friend
      user.friends = user.friends.filter((id) => id.toString() !== userId);
      friend.friends = friend.friends.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      // ✅ Add friend
      user.friends.push(userId);
      friend.friends.push(currentUserId);
    }

    await user.save();
    await friend.save();

    res.json({
      message: isFriend ? "Amigo eliminado" : "Amigo agregado",
      isFriend: !isFriend,
    });
  } catch (error) {
    console.error("Error en toggleFriend:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getUserCount:", error);
    res.status(500).json({ error: 'Error al obtener el contador de usuarios' });
  }
};

export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
  getUserCount,
};

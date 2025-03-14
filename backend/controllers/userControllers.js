import upload from "../middleware/uploadPictureMiddleware.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { createFriendAddedNotification } from "../services/notificationService.js";

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
    let user = await User.findById(req.user._id).populate(
      "friends",
      "_id name avatar"
    ); // ✅ Populate friends

    if (user) {
      return res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        country: user.country,
        city: user.city,
        admin: user.admin,
        friends: user.friends,
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
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Update only the fields sent in the request
    if (req.body.city) user.city = req.body.city;
    if (req.body.country) user.country = req.body.country;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    // New: update admin and verified fields if provided
    if (typeof req.body.admin !== "undefined") user.admin = req.body.admin;
    if (typeof req.body.verified !== "undefined")
      user.verified = req.body.verified;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      friends: user.friends,
      verified: user.verified,
      admin: user.admin,
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

export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params; // Ensure userId is correctly received
    const user = await User.findById(userId).populate(
      "friends", // 🔥 Populate full friend objects
      "_id name avatar" // Specify only needed fields
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user.friends); // ✅ Return populated friends
  } catch (err) {
    console.error("Error al obtener los amigos del usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const toggleFriend = async (req, res, next) => {
  try {
    const { userId } = req.params; // The ID of the user to add/remove as friend
    const currentUser = await User.findById(req.user.id);
    const friend = await User.findById(userId);

    if (!friend) return res.status(404).json({ message: "User not found" });

    let friendAdded = false;

    if (currentUser.friends.includes(userId)) {
      // Remove Friend
      currentUser.friends = currentUser.friends.filter(
        (id) => id.toString() !== userId
      );
      friend.friends = friend.friends.filter(
        (id) => id.toString() !== currentUser.id
      );
    } else {
      // Add Friend
      currentUser.friends.push(userId);
      friend.friends.push(currentUser.id);
      friendAdded = true;
    }

    await currentUser.save();
    await friend.save();

    // If a friend was added, create a notification for the recipient
    if (friendAdded) {
      // Use currentUser.name as the sender's name
      await createFriendAddedNotification(
        currentUser._id,
        currentUser.name,
        userId
      );
    }

    res.json({ friends: currentUser.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling friend" });
  }
};

export const userProfileById = async (req, res) => {
  try {
    const { userId } = req.params; // Now using userId
    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getUserCount:", error);
    res.status(500).json({ error: "Error al obtener el contador de usuarios" });
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

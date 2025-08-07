import Notification from "../models/Notification.js";

import upload from "../middleware/uploadPictureMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Itinerary from "../models/Itinerary.js";
import Review from "../models/Review.js";
import Favorite from "../models/Favorite.js";

// Enhanced notification imports
import {
  createFriendAddedNotification,
  createFriendRequestNotification,
  createFriendRequestAcceptedNotification,
  createFriendRequestRejectedNotification,
  createFriendRemovedNotification,
  createWelcomeNotification,
  createPasswordChangedNotification,
  createEmailVerifiedNotification,
  createSecurityNotification,
  createProfileViewNotification,
  notifyAllFriends,
} from "../services/notificationService.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../services/emailService.js";
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
      avatar: "",
      coverImg: "",
    });

    // 🔔 Send welcome notification
    try {
      await createWelcomeNotification(user._id, user.name);
      console.log("✅ Welcome notification sent to new user");
    } catch (notificationError) {
      console.error(
        "❌ Error sending welcome notification:",
        notificationError
      );
    }

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      coverImg: user.coverImg,
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
        coverImg: user.coverImg,
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
    );

    if (user) {
      return res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        coverImg: user.coverImg,
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

    // Store original values for comparison
    const originalValues = {
      name: user.name,
      email: user.email,
      city: user.city,
      country: user.country,
      verified: user.verified,
    };

    // Update only the fields sent in the request
    if (req.body.city) user.city = req.body.city;
    if (req.body.country) user.country = req.body.country;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (typeof req.body.admin !== "undefined") user.admin = req.body.admin;
    if (typeof req.body.verified !== "undefined")
      user.verified = req.body.verified;

    await user.save();

    // 🔔 Send verification notification if user was just verified
    if (!originalValues.verified && user.verified) {
      try {
        await createEmailVerifiedNotification(user._id);
        console.log("✅ Email verification notification sent");
      } catch (notificationError) {
        console.error(
          "❌ Error sending verification notification:",
          notificationError
        );
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      country: user.country,
      coverImg: user.coverImg,
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

    // Delete the old avatar if exists
    if (user.avatar) {
      await cloudinary.uploader.destroy(user.avatar);
    }

    // Upload the new avatar to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    user.avatar = result.public_id;
    await user.save();

    // 🔔 Notify friends about profile picture update (optional)
    try {
      if (user.friends && user.friends.length > 0) {
        await notifyAllFriends(user._id, user.friends, {
          sender: user._id,
          type: "profile_update",
          message: `${user.name} ha actualizado su foto de perfil.`,
          data: {
            profileUrl: `/profile/${user._id}`,
            updateType: "avatar",
          },
        });
        console.log("✅ Profile picture update notifications sent to friends");
      }
    } catch (notificationError) {
      console.error(
        "❌ Error sending profile update notifications:",
        notificationError
      );
    }

    res.json({
      _id: user._id,
      avatar: user.avatar,
      coverImg: user.coverImg,
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

export const updateCoverImg = async (req, res, next) => {
  try {
    console.log("🔄 updateCoverImg controller called");

    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found.");
    }

    console.log("👤 Current user coverImg:", user.coverImg);

    // Delete old cover image if it exists and is not empty
    if (user.coverImg && user.coverImg.trim() !== "") {
      console.log("🗑️ Deleting old cover image:", user.coverImg);
      try {
        await cloudinary.uploader.destroy(user.coverImg);
        console.log("✅ Old cover image deleted");
      } catch (deleteError) {
        console.log("⚠️ Error deleting old image:", deleteError.message);
      }
    }

    // Upload new image
    console.log("📤 Uploading new cover image to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
      public_id: `cover_${user._id}_${Date.now()}`,
      overwrite: true,
      resource_type: "image",
    });

    // Update coverImg field
    const updateResult = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          coverImg: result.public_id,
          updatedAt: new Date(),
        },
      }
    );

    const finalUser = await User.findById(user._id);

    // 🔔 Notify friends about cover image update (optional)
    try {
      if (finalUser.friends && finalUser.friends.length > 0) {
        await notifyAllFriends(finalUser._id, finalUser.friends, {
          sender: finalUser._id,
          type: "profile_update",
          message: `${finalUser.name} ha actualizado su portada.`,
          data: {
            profileUrl: `/profile/${finalUser._id}`,
            updateType: "cover",
          },
        });
        console.log("✅ Cover image update notifications sent to friends");
      }
    } catch (notificationError) {
      console.error(
        "❌ Error sending cover update notifications:",
        notificationError
      );
    }

    const responseData = {
      _id: finalUser._id,
      avatar: finalUser.avatar,
      coverImg: finalUser.coverImg,
      name: finalUser.name,
      email: finalUser.email,
      verified: finalUser.verified,
      admin: finalUser.admin,
      city: finalUser.city,
      country: finalUser.country,
      friends: finalUser.friends,
      token: await finalUser.generateJWT(),
    };

    console.log("📤 Sending response with coverImg:", responseData.coverImg);
    res.json(responseData);
  } catch (error) {
    console.error("❌ updateCoverImg error:", error);
    next(error);
  }
};

export const fixExistingUsers = async (req, res) => {
  try {
    const result = await User.updateMany(
      {
        $or: [
          { coverImg: { $exists: false } },
          { coverImg: null },
          { coverImg: undefined },
        ],
      },
      {
        $set: { coverImg: "" },
      }
    );

    console.log("✅ Fixed users:", result);
    res.json({
      message: "Users fixed",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("❌ Error fixing users:", error);
    res.status(500).json({ error: error.message });
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
      throw new Error("User not found");
    }

    // 1. Delete user's posts and related comments
    const postsToDelete = await Post.find({ user: user._id });
    const postIdsToDelete = postsToDelete.map((post) => post._id);

    await Comment.deleteMany({
      post: { $in: postIdsToDelete },
    });

    await Post.deleteMany({
      _id: { $in: postIdsToDelete },
    });

    // Remove post photos
    postsToDelete.forEach((post) => {
      fileRemover(post.photo);
    });

    // 2. Remove user from other users' friends lists
    await User.updateMany(
      { friends: user._id },
      { $pull: { friends: user._id } }
    );

    // 3. Remove user from itineraries
    // Option A: Remove user from itineraries they're part of
    await Itinerary.updateMany(
      { travelers: user._id }, // or whatever field name you use
      { $pull: { participants: user._id } }
    );

    // Option B: If user is the owner, you might want to delete the itinerary entirely
    await Itinerary.deleteMany({ owner: user._id }); // adjust field name as needed

    // 4. Remove user's favorites and any favorites pointing to this user
    await Favorite.deleteMany({ user: user._id }); // user's own favorites
    await Favorite.deleteMany({ favorited_user: user._id }); // others favoriting this user

    // 5. Clean up any other collections that reference this user
    // Add more cleanup as needed based on your schema:

    // Reviews/Ratings
    await Review.deleteMany({ user: user._id });
    await Review.deleteMany({ reviewed_user: user._id });

    // Notifications
    await Notification.deleteMany({ user: user._id });
    await Notification.deleteMany({ from_user: user._id });

    // 6. Finally, delete the user
    await user.remove();
    fileRemover(user.avatar);

    res.status(204).json({ message: "Usuario borrado con éxito" });
  } catch (error) {
    next(error);
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "_id name avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user.friends);
  } catch (err) {
    console.error("Error al obtener los amigos del usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const toggleFriend = async (req, res, next) => {
  try {
    const { userId } = req.params;
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

      // 🔔 Send friend removed notification
      try {
        await createFriendRemovedNotification(
          currentUser._id,
          currentUser.name,
          userId
        );
        console.log("✅ Friend removed notification sent");
      } catch (notificationError) {
        console.error(
          "❌ Error sending friend removed notification:",
          notificationError
        );
      }
    } else {
      // Add Friend
      currentUser.friends.push(userId);
      friend.friends.push(currentUser.id);
      friendAdded = true;

      // 🔔 Send friend added notification
      try {
        await createFriendAddedNotification(
          currentUser._id,
          currentUser.name,
          userId
        );
        console.log("✅ Friend added notification sent");
      } catch (notificationError) {
        console.error(
          "❌ Error sending friend added notification:",
          notificationError
        );
      }
    }

    await currentUser.save();
    await friend.save();

    res.json({ friends: currentUser.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling friend" });
  }
};

export const userProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    const user = await User.findById(userId)
      .populate("friends", "_id name avatar")
      .select("-password -passwordResetToken -passwordResetExpires");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔔 Send profile view notification (only if not own profile and not already friends)
    const isOwnProfile = requestingUser._id.toString() === userId;
    const isFriend = user.friends.some(
      (friend) => friend._id.toString() === requestingUser._id.toString()
    );

    if (!isOwnProfile && !isFriend) {
      try {
        await createProfileViewNotification(
          requestingUser._id,
          requestingUser.name || "Usuario anónimo",
          userId
        );
        console.log("✅ Profile view notification sent");
      } catch (notificationError) {
        console.error(
          "❌ Error sending profile view notification:",
          notificationError
        );
      }
    }

    // Calculate counts
    const publicationsCount = await Post.countDocuments({ user: userId });

    let tripsCount = 0;
    try {
      const Itinerary = (await import("../models/Itinerary.js")).default;
      tripsCount = await Itinerary.countDocuments({ user: userId });
    } catch (error) {
      console.log("Itinerary model not found");
    }

    const friendRequestSent =
      user.receivedFriendRequests?.includes(requestingUser._id) || false;

    const profileData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      coverImg: user.coverImg,
      bio: user.bio,
      city: user.city,
      country: user.country,
      joinedDate: user.joinedDate || user.createdAt,
      verified: user.verified,
      admin: user.admin,
      email: user.email,
      friends: user.friends,
      interests: user.interests || [],
      languages: user.languages || [],
      publicationsCount,
      tripsCount,
      isOwnProfile,
      isFriend,
      friendRequestSent,
      website: user.website,
      occupation: user.occupation,
      education: user.education,
      dateOfBirth: user.dateOfBirth,
      showDateOfBirth: user.showDateOfBirth,
      showEmail: user.showEmail,
    };

    res.status(200).json(profileData);
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log(`Password reset requested for: ${email}`);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "No existe una cuenta con este email",
      });
    }

    console.log(`User found: ${user.name} (ID: ${user._id})`);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    console.log(`Token saved to database for user: ${user.email}`);

    try {
      await sendPasswordResetEmail(user.email, resetToken);

      // 🔔 Send security notification for password reset request
      try {
        await createSecurityNotification(
          user._id,
          "Solicitud de restablecimiento de contraseña"
        );
        console.log("✅ Password reset security notification sent");
      } catch (notificationError) {
        console.error(
          "❌ Error sending security notification:",
          notificationError
        );
      }

      res.status(200).json({
        message: "Email de recuperación enviado exitosamente",
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Error enviando el email. Intenta nuevamente.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log(`Verifying reset token: ${token}`);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token not found or expired");
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    console.log(`Valid token for user: ${user.email}`);

    res.status(200).json({
      message: "Token válido",
      email: user.email,
    });
  } catch (error) {
    console.error("Verify token error:", error);
    next(error);
  }
};

export const addItemToChecklist = async (req, res, next) => {
  const { token, data } = req.body;
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 🔔 Send password changed notification
    try {
      await createPasswordChangedNotification(user._id);
      console.log("✅ Password changed notification sent");
    } catch (notificationError) {
      console.error(
        "❌ Error sending password changed notification:",
        notificationError
      );
    }

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const posts = await Post.find({ user: userId })
      .populate("user", "_id name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalPosts / limit);

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const likesCount = post.likes ? post.likes.length : 0;

        return {
          ...post,
          commentsCount,
          likesCount,
        };
      })
    );

    res.status(200).json({
      posts: postsWithCounts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    next(error);
  }
};

export const getUserTrips = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const includePrivate = req.query.includePrivate === "true";
    const skip = (page - 1) * limit;

    console.log(
      `Getting trips for user: ${userId}, includePrivate: ${includePrivate}`
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let query = { user: userId };

    if (!includePrivate || req.user._id.toString() !== userId) {
      if (req.user._id.toString() === userId) {
        console.log("Owner viewing their own trips - showing all");
      } else if (user.friends.includes(req.user._id)) {
        console.log("Friend viewing trips - showing all");
      } else {
        query.isPrivate = false;
        console.log("Non-friend viewing trips - showing only public");
      }
    }

    console.log("Trip query:", query);

    try {
      const Itinerary = (await import("../models/Itinerary.js")).default;

      const itineraries = await Itinerary.find(query)
        .populate("user", "_id name avatar")
        .populate("travelers.userId", "_id name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalTrips = await Itinerary.countDocuments(query);

      const mappedTrips = itineraries.map((itinerary) => {
        const sortedBoards =
          itinerary.boards?.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          ) || [];
        const startDate =
          sortedBoards.length > 0 ? sortedBoards[0].date : itinerary.createdAt;
        const endDate =
          sortedBoards.length > 0
            ? sortedBoards[sortedBoards.length - 1].date
            : itinerary.createdAt;

        return {
          _id: itinerary._id,
          title: itinerary.name,
          description: `Viaje de ${itinerary.travelDays} días`,
          destination: "Destino por definir",
          coverImage: itinerary.coverImage,
          startDate: startDate,
          endDate: endDate,
          privacy: itinerary.isPrivate ? "private" : "public",
          user: itinerary.user,
          travelers: itinerary.travelers, // Include travelers for permission checking
          travelDays: itinerary.travelDays,
          totalBudget: itinerary.totalBudget,
          status: itinerary.status,
          likes: itinerary.likes,
          views: itinerary.views,
          boards: itinerary.boards,
          createdAt: itinerary.createdAt,
          updatedAt: itinerary.updatedAt,
        };
      });

      console.log(
        `Returning ${mappedTrips.length} itineraries out of ${totalTrips} total`
      );

      const totalPages = Math.ceil(totalTrips / limit);

      res.status(200).json({
        trips: mappedTrips,
        currentPage: page,
        totalPages,
        totalTrips,
        hasMore: page < totalPages,
      });
    } catch (error) {
      console.log("Itinerary model not found:", error);
      return res.status(200).json({
        trips: [],
        currentPage: 1,
        totalPages: 0,
        totalTrips: 0,
        hasMore: false,
        message: "No itinerary model available",
      });
    }
  } catch (error) {
    console.error("Error fetching user trips:", error);
    next(error);
  }
};

export const sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === userId) {
      return res
        .status(400)
        .json({ message: "No puedes enviarte una solicitud a ti mismo" });
    }

    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const sender = await User.findById(senderId);

    if (sender.friends.includes(userId)) {
      return res.status(400).json({ message: "Ya son amigos" });
    }

    if (
      sender.sentFriendRequests &&
      sender.sentFriendRequests.includes(userId)
    ) {
      return res.status(400).json({ message: "Solicitud ya enviada" });
    }

    if (!sender.sentFriendRequests) sender.sentFriendRequests = [];
    sender.sentFriendRequests.push(userId);

    if (!recipient.receivedFriendRequests)
      recipient.receivedFriendRequests = [];
    recipient.receivedFriendRequests.push(senderId);

    await sender.save();
    await recipient.save();

    // 🔔 Send friend request notification (correct type)
    try {
      await createFriendRequestNotification(senderId, sender.name, userId);
      console.log("✅ Friend request notification sent");
    } catch (notificationError) {
      console.error(
        "❌ Error sending friend request notification:",
        notificationError
      );
    }

    res.status(200).json({
      message: "Solicitud de amistad enviada",
      requestSent: true,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    next(error);
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const requester = await User.findById(requestId);
    const currentUser = await User.findById(currentUserId);

    if (!requester) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (
      !currentUser.receivedFriendRequests ||
      !currentUser.receivedFriendRequests.includes(requestId)
    ) {
      return res
        .status(400)
        .json({ message: "Solicitud de amistad no encontrada" });
    }

    if (!currentUser.friends) currentUser.friends = [];
    if (!requester.friends) requester.friends = [];

    currentUser.friends.push(requestId);
    requester.friends.push(currentUserId);

    currentUser.receivedFriendRequests =
      currentUser.receivedFriendRequests.filter(
        (id) => id.toString() !== requestId
      );
    requester.sentFriendRequests = requester.sentFriendRequests.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await requester.save();

    // 🔔 Send friend request accepted notification
    try {
      await createFriendRequestAcceptedNotification(
        currentUserId,
        currentUser.name,
        requestId
      );
      console.log("✅ Friend request accepted notification sent");
    } catch (notificationError) {
      console.error(
        "❌ Error sending friend request accepted notification:",
        notificationError
      );
    }

    res.status(200).json({
      message: "Solicitud de amistad aceptada",
      newFriend: {
        _id: requester._id,
        name: requester.name,
        avatar: requester.avatar,
      },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    next(error);
  }
};

export const getFriendRequests = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("receivedFriendRequests", "_id name avatar")
      .populate("sentFriendRequests", "_id name avatar");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      received: user.receivedFriendRequests || [],
      sent: user.sentFriendRequests || [],
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.favorites || user.favorites.length === 0) {
      return res.status(200).json({
        favorites: [],
        currentPage: page,
        totalPages: 0,
        totalFavorites: 0,
        hasMore: false,
      });
    }

    const favorites = await Post.find({ _id: { $in: user.favorites } })
      .populate("user", "_id name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalFavorites = user.favorites.length;
    const totalPages = Math.ceil(totalFavorites / limit);

    const favoritesWithCounts = await Promise.all(
      favorites.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const likesCount = post.likes ? post.likes.length : 0;

        return {
          ...post,
          commentsCount,
          likesCount,
        };
      })
    );

    res.status(200).json({
      favorites: favoritesWithCounts,
      currentPage: page,
      totalPages,
      totalFavorites,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    next(error);
  }
};

export const updateUserCounts = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const postsCount = await Post.countDocuments({ user: userId });

    let tripsCount = 0;
    try {
      const Itinerary = (await import("../models/Itinerary.js")).default;
      tripsCount = await Itinerary.countDocuments({ user: userId });
    } catch (error) {
      // Itinerary model doesn't exist yet
    }

    user.publicationsCount = postsCount;
    user.tripsCount = tripsCount;
    await user.save();

    return { postsCount, tripsCount };
  } catch (error) {
    console.error("Error updating user counts:", error);
  }
};

export const getEnhancedUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    const user = await User.findById(userId)
      .populate("friends", "_id name avatar")
      .select("-password -passwordResetToken -passwordResetExpires");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isOwnProfile = requestingUser._id.toString() === userId;
    const isFriend = user.friends.some(
      (friend) => friend._id.toString() === requestingUser._id.toString()
    );
    const friendRequestSent =
      user.receivedFriendRequests?.includes(requestingUser._id) || false;

    const profileData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      coverImg: user.coverImg,
      bio: user.bio,
      city: user.city,
      country: user.country,
      joinedDate: user.joinedDate,
      verified: user.verified,
      tripsCount: user.tripsCount || 0,
      publicationsCount: user.publicationsCount || 0,
      friends: user.friends,
      isOwnProfile,
      isFriend,
      friendRequestSent,
      email: isOwnProfile || user.showEmail ? user.email : null,
      dateOfBirth:
        isOwnProfile || isFriend || user.showDateOfBirth
          ? user.dateOfBirth
          : null,
      website: user.website,
      occupation: user.occupation,
      education: user.education,
      travelStyle: isOwnProfile || isFriend ? user.travelStyle : null,
      budget: isOwnProfile || isFriend ? user.budget : null,
      languages: isOwnProfile || isFriend ? user.languages : null,
      interests: user.interests,
    };

    if (isOwnProfile) {
      updateUserCounts(userId);
    }

    res.status(200).json(profileData);
  } catch (error) {
    console.error("Error fetching enhanced user profile:", error);
    next(error);
  }
};

export const toggleFavoritePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.favorites) user.favorites = [];

    const isFavorited = user.favorites.includes(postId);

    if (isFavorited) {
      user.favorites = user.favorites.filter((id) => id.toString() !== postId);
    } else {
      user.favorites.push(postId);
    }

    await user.save();

    res.status(200).json({
      favorited: !isFavorited,
      favoritesCount: user.favorites.length,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    next(error);
  }
};

export const rejectFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const currentUser = await User.findById(req.user._id);
    const requester = await User.findById(requestId);

    if (!requester) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    currentUser.receivedFriendRequests =
      currentUser.receivedFriendRequests?.filter(
        (id) => id.toString() !== requestId
      ) || [];

    requester.sentFriendRequests =
      requester.sentFriendRequests?.filter(
        (id) => id.toString() !== currentUser._id.toString()
      ) || [];

    await currentUser.save();
    await requester.save();

    // 🔔 Send friend request rejected notification
    try {
      await createFriendRequestRejectedNotification(
        currentUser._id,
        currentUser.name,
        requestId
      );
      console.log("✅ Friend request rejected notification sent");
    } catch (notificationError) {
      console.error(
        "❌ Error sending friend request rejected notification:",
        notificationError
      );
    }

    res.status(200).json({ message: "Solicitud de amistad rechazada" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    next(error);
  }
};

export const removeFriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const currentUser = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendId
    );
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await friend.save();

    // 🔔 Send friend removed notification
    try {
      await createFriendRemovedNotification(
        currentUser._id,
        currentUser.name,
        friendId
      );
      console.log("✅ Friend removed notification sent");
    } catch (notificationError) {
      console.error(
        "❌ Error sending friend removed notification:",
        notificationError
      );
    }

    res.status(200).json({ message: "Amigo eliminado" });
  } catch (error) {
    console.error("Error removing friend:", error);
    next(error);
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

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const { hash, compare } = bcrypt;
import jwt from "jsonwebtoken";
const { sign } = jwt;

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    username: {
      type: String,
      min: 2,
      max: 50,
    },
    city: {
      type: String,
      required: false,
      default: "",
    },
    country: {
      type: String,
      required: false,
      default: "",
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    passwordResetToken: {
      type: String,
      default: undefined,
    },
    passwordResetExpires: {
      type: Date,
      default: undefined,
    },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // Friend requests
    sentFriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    receivedFriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // User favorites (posts, trips, etc.)
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    // Additional profile fields for enhanced profile
    bio: {
      type: String,
      maxLength: 500,
    },

    dateOfBirth: {
      type: Date,
    },

    website: {
      type: String,
    },

    occupation: {
      type: String,
    },

    education: {
      type: String,
    },

    // Travel preferences
    travelStyle: {
      type: String,
      enum: ["budget", "mid-range", "luxury", "backpacker", "business"],
    },

    budget: {
      type: String,
      enum: ["low", "medium", "high", "unlimited"],
    },

    languages: [
      {
        type: String,
      },
    ],

    interests: [
      {
        type: String,
      },
    ],

    // Privacy settings
    showEmail: {
      type: Boolean,
      default: false,
    },

    showDateOfBirth: {
      type: Boolean,
      default: false,
    },

    // Counts for quick access
    tripsCount: {
      type: Number,
      default: 0,
    },

    publicationsCount: {
      type: Number,
      default: 0,
    },

    // Join date
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});
UserSchema.methods.generateJWT = async function () {
  const payload = {
    id: this._id,
    admin: this.admin, // ← ADD: Admin status for frontend
    verified: this.verified, // ← ADD: Verification status for frontend
    name: this.name, // ← ADD: User name for UI display
    email: this.email, // ← ADD: Email for profile display
  };

  console.log("🔵 Generating JWT with enhanced payload:", payload);

  return await sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);
export default User;

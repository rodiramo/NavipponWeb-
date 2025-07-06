// models/Checklist.js
import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      enum: [
        "viaje",
        "documentos",
        "equipaje",
        "reserva",
        "planificación",
        "otro",
      ],
      default: "otro",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
checklistSchema.index({ userId: 1, createdAt: -1 });
checklistSchema.index({ userId: 1, checked: 1 });

const Checklist = mongoose.model("Checklist", checklistSchema);

export { Checklist };

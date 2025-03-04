import { Schema, model } from "mongoose";

const TRAVELER_ROLES = ["viewer", "editor"];
const ItinerarySchema = new Schema(
  {
    name: { type: String, required: true },
    travelDays: { type: Number, required: true },
    totalBudget: { type: Number, required: true },
    boards: [
      {
        date: { type: String, required: true },
        favorites: [
          {
            type: Schema.Types.ObjectId,
            ref: "Favorite",
            required: true,
          },
        ],
        dailyBudget: { type: Number, required: true },
      },
    ],
    isPrivate: { type: Boolean, default: true },
    travelers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: TRAVELER_ROLES, default: "viewer" },
      },
    ],
    notes: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
        author: { type: String, required: true },
      },
    ],

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Itinerary = model("Itinerary", ItinerarySchema);
export default Itinerary;

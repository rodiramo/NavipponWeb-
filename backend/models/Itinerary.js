import { Schema, model } from "mongoose";

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
                        ref: 'Favorite',
                        required: true
                    }
                ],
                dailyBudget: { type: Number, required: true },
            },
        ],
        notes: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Itinerary = model("Itinerary", ItinerarySchema);
export default Itinerary;
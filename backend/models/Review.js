import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        desc: { type: String, required: true },
        experience: { type: Schema.Types.ObjectId, ref: "Experience", required: true },  
        check: { type: Boolean, default: false },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Review",
            default: null,
        },
        replyOnUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

ReviewSchema.virtual("replies", {
    ref: "Review",
    localField: "_id",
    foreignField: "parent",
});

const Review = model("Review", ReviewSchema);
export default Review;
import { Schema, model } from "mongoose";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    photo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: { 
      type: String, 
      enum: categoriesEnum, 
      required: true 
    },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

ExperienceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "experience",
});

const Experience = model("Experience", ExperienceSchema);
export default Experience;
import { Schema, model } from "mongoose";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: ["Tokio", "Kanagawa", "Chiba", "Saitama", "Ibaraki", "Tochigi", "Gunma"],
  Chubu: ["Aichi", "Shizuoka", "Gifu", "Nagano", "Niigata", "Toyama", "Ishikawa", "Fukui"],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: ["Fukuoka", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Saga"],
};

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
    region: { type: String, enum: Object.keys(regions) },
    prefecture: { type: String, validate: {validator: function(value) {
          return regions[this.region] && regions[this.region].includes(value);
        },
        message: "La prefectura seleccionada no es válida para la región elegida."
      }
    },
    price: { type: Number, required: true },  
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
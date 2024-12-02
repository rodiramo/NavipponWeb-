const mongoose = require('mongoose');
const { Schema } = mongoose;

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

const daySchema = new Schema({
    date: { type: Date, required: false },
    region: { type: String, enum: Object.keys(regions), required: false },
    prefecture: { type: String, enum: [].concat(...Object.values(regions)), required: false },
    hotel: { type: Schema.Types.ObjectId, ref: 'Favorite', required: false },
    activities: [{ type: Schema.Types.ObjectId, ref: 'Favorite', required: false }],
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Favorite', required: false }],
    budget: { type: Number, required: false, default: 0 },
    notes: { type: String, required: false }
});

const Day = mongoose.model('Day', daySchema);
module.exports = Day;
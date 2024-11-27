const mongoose = require('mongoose');

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

const itinerarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: [{dayNumber: { type: Number, required: true },
    region: { type: String, enum: Object.keys(regions), required: true },
    prefecture: { type: String, enum: [].concat(...Object.values(regions)), required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }],
    restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }],
    budget: { type: Number, required: true }, 
    notes: { type: String, required: false }
    }],
    totalBudget: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema); 
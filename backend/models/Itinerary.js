const mongoose = require('mongoose');
const { Schema } = mongoose;

const itinerarySchema = new Schema({
    title: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    totalBudget: { type: Number, required: false, default: 0 },
    days: [{ type: Schema.Types.ObjectId, ref: 'Day' }]
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;
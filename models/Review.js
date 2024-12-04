// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    movieId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);
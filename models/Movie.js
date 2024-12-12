const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    reviews: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
        review: { type: String }
    }]
});

module.exports = mongoose.model('Movie', movieSchema);
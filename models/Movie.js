
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieSchema = new Schema({
    name: String,
    synopsis: String,
    lang: [String],
    thumbnail: String,
    photos: [String],
    trailer: String,
    censor: String,

    releaseDate: Date,
    category: String,
    genre: [String],

    castAndcrew: [Object],
    location: [String],
    theatres: [String],
});

const MovieModel = mongoose.model('Movie', MovieSchema);

module.exports = MovieModel;
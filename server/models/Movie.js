import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    poster_path: {
        type: String,
        required: true,
    },
    backdrop_path: {
        type: String,
        required: true,
    },
    release_date: {
        type: String,
        required: true,
    },
    original_language: {
        type: String,
    },
    tagline: {
        type: String,
    },
    genre_names: {
        type: Array,
        required: true,
    },
    vote_average: {
        type: Number,
        required: true,
    },
    vote_count: {
        type: Number,
        default: 0,
    },
    runtime: {
        type: Number,
        required: true,
    },
    trailerKey: {
        type: String,
    },
}, {timestamps: true});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;

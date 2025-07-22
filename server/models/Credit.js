import mongoose from 'mongoose';

const CastSchema = new mongoose.Schema({
  adult: Boolean,
  gender: Number,
  id: Number,
  known_for_department: String,
  name: String,
  original_name: String,
  popularity: Number,
  profile_path: String,
  cast_id: Number,
  character: String,
  credit_id: String,
  order: Number
}, { _id: false });

const CreditsSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., "movie_1011477"
  credits: {
    _id: { type: Number, required: true }, // TMDb numeric ID
    cast: [CastSchema]
  }
});

const Credit = mongoose.model('Credit', CreditsSchema);

export default Credit;

const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Director",
  },
  rating: {
    type: Number,
  },
  year: {
    type: Number,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

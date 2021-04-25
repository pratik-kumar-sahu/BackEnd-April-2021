const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

const Director = mongoose.model("Director", directorSchema);

module.exports = Director;

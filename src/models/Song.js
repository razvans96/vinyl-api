const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  date: { type: Date, required: true },
  photo: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, required: true },
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;

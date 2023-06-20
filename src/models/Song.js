const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  date: { type: Date, required: true },
  photo: { type: String, required: false },
  photobase64: { type: String, required: false },
  duration: { type: Number },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, required: true },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;

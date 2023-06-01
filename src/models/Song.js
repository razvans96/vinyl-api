const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  date: { type: Date, required: true },
  photoUrl: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, required: true },
  },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

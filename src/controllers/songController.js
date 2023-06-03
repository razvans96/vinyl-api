const Song = require("../models/Song");

const getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

const searchSongs = async (req, res, next) => {
  try {
    const { title, artist, date } = req.query;

    const query = {};
    if (title) query.title = title;
    if (artist) query.artist = artist;
    if (date) query.date = date;

    const songs = await Song.find(query);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

const createSong = async (req, res, next) => {
  try {
    const { title, artist, date, photo, location } = req.body;
    const newSong = new Song({
      title,
      artist,
      date,
      photo,
      location,
    });

    const createdSong = await newSong.save();
    res.status(201).json(createdSong);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSongs, searchSongs, createSong };

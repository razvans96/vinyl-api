const axios = require("axios");
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

const searchSpotifySongs = async (req, res, next) => {
  try {
    const { q, l = 20, o = 0 } = req.query;

    // Realiza una solicitud a la API de Spotify para buscar canciones
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${process.env.CLIENT_TOKEN}`,
      },
      params: {
        q,
        type: "track",
        limit: l,
        offset: o,
      },
    });

    // Extrae los resultados de la respuesta de la API de Spotify
    const songs = response.data.tracks.items.map((item) => ({
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(", "),
      date: item.album.release_date,
      photo: item.album.images[0].url,
      duration: item.duration_ms,
    }));

    res.status(200).json({ songs });
  } catch (error) {
    console.log("Error al obtener el listado de canciones de Spotify.");
    next(error);
  }
};

const createSong = async (req, res, next) => {
  try {
    const { title, artist, date, photo, location } = req.body;
    const userId = req.user._id;
    const newSong = new Song({
      title,
      artist,
      date,
      photo,
      location,
      user: userId,
    });

    const createdSong = await newSong.save();
    res.status(201).json(createdSong);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSongs, searchSongs, searchSpotifySongs, createSong };

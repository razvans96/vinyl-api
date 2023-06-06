const axios = require("axios");
const Song = require("../models/Song");
const { JSONResponse } = require("../config/jsonResponse");

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
    if (title) query.title = { $regex: title, $options: "i" };
    if (artist) query.artist = { $regex: artist, $options: "i" };
    if (date) query.date = date;
    const hasCriteria = Object.keys(query).length > 0;
    if (!hasCriteria) {
      const songs = [];
      return JSONResponse(res, 200, songs);
    }
    const songs = await Song.find(query);
    JSONResponse(res, 200, songs);
  } catch (error) {
    JSONResponse(res, error.code, {
      error: {
        code: error.code,
        message: "La búsqueda ha fallado.",
      },
    });
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
    const userId = req.body.user;
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

const deleteSong = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const songId = req.params.id;

    // Buscar la canción y verificar que el usuario sea el propietario
    const song = await Song.findOne({ _id: songId, user: userId });

    if (!song) {
      return res.status(404).json({ message: "La canción no existe" });
    }

    // Eliminar la canción
    await song.deleteOne();

    res.status(200).json({ message: "Canción eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la canción:", error);
    next(error);
  }
};

module.exports = { getSongs, searchSongs, searchSpotifySongs, createSong };

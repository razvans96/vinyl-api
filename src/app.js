const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const commentRoutes = require("./routes/commentRoutes");
const bodyParser = require("body-parser");
const spotify = require("./config/spotify");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

//const spotify = require("./config/spotify");

//spotify.renewSpotifyAccessToken();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use("/api", authRoutes);
app.use("/api", songRoutes);
app.use("/api", commentRoutes);

spotify.renewSpotifyAccessToken();
// Ejecutar spotify.renewSpotifyAccessToken() cada 50 minutos
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    spotify.renewSpotifyAccessToken();
  }, 3000000);
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error en el servidor" });
});

module.exports = app;

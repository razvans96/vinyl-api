const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const songController = require("../controllers/songController");

router.get("/songs", songController.getSongs);
router.get("/songs/search", songController.searchSongs);
router.get(
  "/songs/spotifySearch",
  auth.verify,
  songController.searchSpotifySongs
);
router.post("/songs", auth.verify, songController.createSong);

module.exports = router;

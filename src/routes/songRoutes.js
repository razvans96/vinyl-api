const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const songController = require("../controllers/songController");

router.get("/song", songController.getSongs);
router.get("/song/search", songController.searchSongs);
router.get(
  "/song/spotifySearch",
  auth.verify,
  songController.searchSpotifySongs
);
router.post("/song", auth.verify, songController.createSong);
router.delete("/song/:id", auth.verify, songController.deleteSong);

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const spotify = require("../config/spotify");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/login/spotify", spotify.renewSpotifyAccessToken);

module.exports = router;

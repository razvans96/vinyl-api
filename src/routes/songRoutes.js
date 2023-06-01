const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/songs', songController.getSongs);
router.get('/songs/search', songController.searchSongs);
router.post('/songs', songController.createSong);
router.post('/songs/:id/comments', songController.createComment);

module.exports = router;

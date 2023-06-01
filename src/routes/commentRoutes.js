const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/songs/:id/comments', commentController.createComment);
router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;

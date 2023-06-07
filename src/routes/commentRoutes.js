const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../controllers/authController");

router.post("/song/:id/comment", commentController.createComment);
router.delete(
  "/song/:id/comment/:commentId",
  auth.verify,
  commentController.deleteComment
);
router.get("/song/:id/comment", commentController.getComments);

module.exports = router;

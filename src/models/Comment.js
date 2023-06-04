const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  comment: { type: String, required: true, maxlength: 1000 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, required: true },
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

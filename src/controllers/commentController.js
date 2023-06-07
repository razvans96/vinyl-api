const Comment = require("../models/Comment");
const Song = require("../models/Song");
const { JSONResponse } = require("../config/jsonResponse");

const getComments = async (req, res) => {
  try {
    const songId = req.params.id;

    const comments = await Comment.find({ song: songId });

    JSONResponse(res, 200, comments);
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    JSONResponse(res, 500, {
      error: {
        code: "500",
        message: "Error en el servidor.",
      },
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { author, comment, rating, location } = req.body;
    const songId = req.params.id;

    const commentData = {
      author,
      comment,
      rating,
      location,
      song: songId,
    };

    const new_comment = await Comment.create(commentData);

    JSONResponse(res, 201, new_comment);
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    JSONResponse(res, 500, {
      error: {
        code: "500",
        message: "Error en el servidor.",
      },
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const songId = req.params.id;
    const commentId = req.params.commentId;

    // Verificar si la canción existe
    const song = await Song.findById(songId);
    if (!song) {
      return JSONResponse(res, 404, {
        error: {
          code: "404",
          message: "Canción no encontrada.",
        },
      });
    }

    // Verificar si el comentario existe
    const comment = await Comment.findOne({ _id: commentId, song: songId });
    if (!comment) {
      return JSONResponse(res, 404, {
        error: {
          code: "404",
          message: "Comentario no encontrado.",
        },
      });
    }

    // Eliminar el comentario
    await Comment.findByIdAndDelete(commentId);
    JSONResponse(res, 200, { message: "Comentario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    JSONResponse(res, 500, {
      error: {
        code: "500",
        message: "Error en el servidor.",
      },
    });
  }
};

module.exports = { createComment, deleteComment, getComments };

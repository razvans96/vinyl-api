const axios = require("axios");
const { JSONResponse } = require("./jsonResponse");

const renewSpotifyAccessToken = async (req, res) => {
  try {
    const response = await axios.post(
      `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    );

    if (response.status === 200) {
      const data = response.data;
      spotifyToken = data.access_token;
      process.env.CLIENT_TOKEN = spotifyToken;
      console.log(`Token de Spotify actualizado: ${spotifyToken}`);
      setTimeout(renewSpotifyAccessToken, (data.expires_in - 60) * 1000);
      JSONResponse(res, 200, response.data);
    } else {
      console.error("Error en la autenticación con Spotify");
      setTimeout(renewSpotifyAccessToken, 60000);
      JSONResponse(res, 401, {
        error: {
          code: "401",
          message:
            "La autenticación con Spotify ha fallado. Verifique las credenciales e inténtelo de nuevo.",
        },
      });
    }
  } catch (error) {
    console.error(
      `Excepción: Error al obtener el token de Spotify: ${error.message}`
    );
    setTimeout(renewSpotifyAccessToken, 60000);
    JSONResponse(res, 401, {
      error: {
        code: "401",
        message:
          "La autenticación con Spotify ha fallado. Verifique las credenciales e inténtelo de nuevo.",
      },
    });
  }
};

module.exports = { renewSpotifyAccessToken };

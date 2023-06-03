const app = require("./app.js");
const db = require("./config/database.js");

// Conexión a la base de datos
db.connectDB();

let server;

const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const stopServerAndCloseDB = async () => {
  try {
    if (server) {
      await server.close();
      console.log("Servidor detenido");
    }

    db.closeDB();
    console.log("Conexión a la base de datos cerrada");

    process.exit(0);
  } catch (error) {
    console.error("Error al cerrar la conexión o el servidor:", error);
    process.exit(1);
  }
};

// Señal enviada por Ctrl+C
process.on("SIGINT", async () => {
  await stopServerAndCloseDB();
});

// Señal definida por el usuario - nodemon restart
process.on("SIGUSR2", async () => {
  await stopServerAndCloseDB();
});

// Señal enviada por comando de terminación
process.on("SIGTERM", async () => {
  await stopServerAndCloseDB();
});

const express = require('express');
const app = express();
require('dotenv').config()
const db = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const songRoutes = require('./src/routes/songRoutes');
const commentRoutes = require('./src/routes/commentRoutes');



// Conexión a la base de datos
db.connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api', authRoutes);
app.use('/api', songRoutes);
app.use('/api', commentRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error en el servidor' });
});

// Puerto de escucha
if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}


// PARA KILL DEL PROCESO
// TODO: Detener también el servidor
process.on('SIGINT', async () => {
  try {
    await db.closeDB;
    console.log('Conexión a la base de datos cerrada');
    process.exit(0)
  } catch (error) {
    console.error('Error al cerrar la conexión o el servidor:', error);
    process.exit(1);
  }
});

// PARA NODEMON RESTART
// TODO: Detener también el servidor
process.on('SIGUSR2', async () => {
  try {
    await db.closeDB;
    console.log('Conexión a la base de datos cerrada');
    process.exit(0)
  } catch (error) {
    console.error('Error al cerrar la conexión o el servidor:', error);
    process.exit(1);
  }
});

module.exports = app;
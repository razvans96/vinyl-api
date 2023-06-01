const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const songRoutes = require('./src/routes/songRoutes');
const commentRoutes = require('./src/routes/commentRoutes');

if (process.env.NODE_ENV === 'test') {
  console.log("test");
  dotenv.config({ path: '.env.test' });
} else {
  console.log("prod");
  dotenv.config();
}

// Conexión a la base de datos
connectDB();

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
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = server;
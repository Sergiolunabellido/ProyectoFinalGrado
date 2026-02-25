const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')


const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en las peticiones
app.use(cookieParser());
// Rutas
app.use('/', authRoutes); // POST /login

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

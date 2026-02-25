// Rutas de autenticación (Login, Registro) - CommonJS
const express = require('express');
const { comprobarLogin } = require('../controllers/authController');
const { registrarUsuario } = require('../controllers/registerController');
const { refreshAccessToken } = require('../controllers/refreshTokenController')
const {listarUsuariosId, cerrarSesion} = require('../controllers/usersController')
const {libros,librosCompletos,librosFavoritosUser, librosCompradosUser, eliminarFavoritoPorId, librosFiltradosGenero} = require('../controllers/librosController')
const authMiddleware = require( '../middleware/auth.middleware');

const router = express.Router();

// El login no debe ir protegido con el middleware de auth,
// porque precisamente se usa para obtener el primer token.

router.post('/login', comprobarLogin);
router.post('/register', registrarUsuario);
router.post('/refresh', refreshAccessToken); 
router.post('/usuarios',authMiddleware, listarUsuariosId )
router.post('/librosFavoritos', authMiddleware, librosFavoritosUser)
router.post('/librosComprados', authMiddleware, librosCompradosUser)
router.post('/libros', librosCompletos)
router.post('/eliminarLibro', authMiddleware, eliminarFavoritoPorId)
router.post('/cerrarSesion', cerrarSesion )
router.post('/librosPublicos', libros)
router.post('/librosFiltrados', librosFiltradosGenero)

module.exports = router;
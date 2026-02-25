// Aquí irá la lógica de login y registro (CommonJS)
const conexionBD = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function comprobarLogin(req, res) {
  const { usuario, contraseña } = req.body;

  try {
    const db = await conexionBD();
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE nombre_usuario = ? LIMIT 1',
      [usuario],
    );

    if (rows.length <= 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos',
      });
    }

    const validarContraseña = await bcrypt.compare(contraseña, rows[0].contrasena);
    if(!validarContraseña){
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos',
      });
    }
    
    /**
     * @brief Creacion del token de usuario
     */
    const token = jwt.sign(
      { id_usuario: rows[0].id_usuario }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );


  /**
   * @Brief Creacion de refresh token para 
   */
    const refreshToken = jwt.sign(
      { id_usuario: rows[0].id_usuario }, 
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
   
    const [filas] = await db.execute(
      'UPDATE usuarios SET token = ? WHERE id_usuario = ? LIMIT 1',
      [refreshToken, rows[0].id_usuario]
    );
    if(filas.affectedRows <= 0){
      return res.status(404).json({
        ok: false,
        mensaje: 'Error al actualizar el token',
      });
    }
   
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    
    return res.status(200).json({
      ok: true,
      mensaje: 'Login correcto',
      token: token,
      
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno en el servidor',
    });
  }
}

module.exports = {
  comprobarLogin,
};
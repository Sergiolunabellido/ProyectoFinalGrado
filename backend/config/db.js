// Aquí se configura la conexión a SQL (CommonJS)
const mysql = require('mysql2/promise');

/**
 * @brief Crea y devuelve una conexion a la base de datos.
 * @fecha 2026-01-08
 * @returns {Promise<object|undefined>} Conexion creada o undefined si falla.
 */
async function conexionBD() {
  try {
    const conexion = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'sergio',
      database: 'basedatosProyecto',
    });
    console.log('Nueva conexion creada');
    return conexion;
  } catch (e) {
    console.log(e);
  }
}

// Exportamos la función, NO la ejecución
module.exports = conexionBD;



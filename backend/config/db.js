// Aquí se configura la conexión a SQL (CommonJS)
const mysql = require('mysql2/promise');

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



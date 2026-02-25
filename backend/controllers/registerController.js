const conexionBD = require('../config/db');
const bcrypt = require('bcryptjs');


async function registrarUsuario(req, res) {
    const { nombre, email, password } = req.body;
    try {
        const db = await conexionBD();
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await db.execute('INSERT INTO usuarios (nombre_usuario, gmail, contrasena) VALUES (?, ?, ?)',
             [nombre, email, hashedPassword]);
        
            return res.status(200).json({
                ok: true,
                mensaje: 'Usuario registrado correctamente',
            });
       
    }catch(e){
        console.error(e);
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al registrar el usuario catch'
        });
    }
}

module.exports = { registrarUsuario };
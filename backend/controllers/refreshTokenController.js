const jwt = require('jsonwebtoken');
const conexionBD = require('../config/db');

/**
 * @brief Compruebo si el token guardado en la base de datos aun no a expirado y si este
 * a expirado creo un nuevo token para que el usuario pueda seguir con la sesion iniciada
 */

async function refreshAccessToken(req, res) {
    const  refreshToken  = req.cookies.refreshToken;

    
    if(!refreshToken){
        return res.status(400).json({
            ok: false,
            mensaje: "Refresh token requerido"
        });
    }

    try{
        //Verifico que el token sea valido
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        //Compruebo que el usuario se encuentre en la base de datos
        const db = await conexionBD();
        const [rows] = await db.execute(
            'SELECT id_usuario, token FROM usuarios WHERE id_usuario = ?',
            [decoded.id_usuario]    
        );
        if(rows.length <= 0){
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado',
            });
        }
       
        //Compruebo que el token mandado por el frontend y el de la base de datos sean iguales
        //si no lo son devuelve que el token no es valido
        if(rows[0].token !== refreshToken){
            return res.status(401).json({
                ok:false,
                mensaje: "Refresh token invalido"
            });
        }

       
       //Creo un nuevo token para que el usuario pueda seguir con la sesion activa. 
        const newToken = jwt.sign(
            { id_usuario: decoded.id_usuario }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        //Devuelvo el nuevo token.
        return  res.status(200).json({
            ok:true,
            token: newToken
        })
            
    }catch(e){
        console.error(e);
        return  res.status(401).json({
            ok: false,
            mensaje: 'Refresh token invalido o expirado',
        });
    }
}

module.exports = {
    refreshAccessToken
}
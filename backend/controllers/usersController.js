const conexionBD = require('../config/db');
const jwt = require('jsonwebtoken')
async function listarUsuarios(req, res){
    let conexion;

    try{
        conexion = await conexionBD();

        const [filas] = conexion.execute("SELECT * FROM usuarios")
        res.status(200).json({
            ok: true,
            filas: filas
        })
    }catch(e){
        res.status(400).json({ok:false, mensaje:"Error al listar los usuarios"})
    }
}

async function listarUsuariosId(req, res){
    let conexion;

    try{
        conexion = await conexionBD();

        const [filasPorId] = await conexion.execute('SELECT * FROM usuarios where id_usuario = ?',
            [req.id_usuario]
        )
        

        if(filasPorId.length === 0){
            return res.status(404).json({ok:false, mensaje:"Usuario no encontrado"})
        }

        return res.status(200).json({
            ok: true,
            filas: filasPorId
        })
    }catch(e){
       return res.status(500).json({ok:false, mensaje:"Error al listar los usuarios"})
    }
};


async function cerrarSesion(req, res){
    let conexion;
    const refreshToken = req.cookies.refreshToken;
    try{

         if (!refreshToken) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });

            return res.status(200).json({
                ok: true,
                mensaje: 'Sesión cerrada',
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        conexion = await conexionBD();

        const [usuario] = await conexion.execute('SELECT token from usuarios where id_usuario = ? LIMIT 1', [decoded.id_usuario])

        if (usuario.length > 0 && usuario[0].token === refreshToken) {
            const [resultado] = await conexion.execute(
                'UPDATE usuarios SET token = NULL WHERE id_usuario = ? LIMIT 1',
                [decoded.id_usuario]
            );

            if (resultado.affectedRows <= 0) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'No se ha podido cerrar sesión',
                });
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });


        return res.status(200).json({
            ok: true,
        })

    }catch(e) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        return res.status(200).json({
            ok: true,
            mensaje: 'Sesión cerrada',
        });

    }
}

module.exports= {
    listarUsuariosId,
    listarUsuarios,
    cerrarSesion
}

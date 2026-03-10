//FUNCIONES QUE TIENEN RELACION CON EL CARRITO.

const conexionBD = require('../config/db');

/**
 * @brief AñadirLibroCarrito es una funcion que permite añadir el id_libro e id_usuario a la tabla carrito haciendo referencia la usuario que ha guardado 
 * ese libro en su carrito para posteriormente  mostrarlo en el carrito y poder comprarlo.
 * @fecha 02/03/2026
 * @return boolean
 */
async function añadirLibroCarrito(req, res){

    const idLibro = req.body.id_libro;
    const idUsuario = req.id_usuario

    let conexion ;

    try{
        conexion = await conexionBD();

        const [registroExistente] = await conexion.execute(
            "SELECT * FROM carrito WHERE id_user = ? AND id_libro = ? LIMIT 1",
            [idUsuario, idLibro]
        )

        if (registroExistente.length > 0) {
            return res.json({
                ok: false,
                mensaje: "El libro ya existe en el carrito"
            });
        }

        const [filas] = await conexion.execute("Insert into carrito (id_user, id_libro) values (?,?)", [idUsuario, idLibro])
        console.log("Se ha insertado el libro en el carrito del usuario: ", idUsuario);
        return res.status(200).json({ ok: true, filas });
    }catch(e){
        console.log("Error al insertar el libro en el carrito del usuario: ", req.id_usuario)
        return res.status(500).json({ ok: false, mensaje: "Error al añadir el libro al carrito" });
    } finally {
        if (conexion) await conexion.end();
    }


}

async function librosCarrito(req, res) {

    const idUsuario = req.id_usuario

    let conexion ;

    try{

        conexion = await conexionBD();

        const [libros] = await conexion.execute(
            `SELECT l.* FROM libros l
             INNER JOIN carrito c ON l.id_libro = c.id_libro
             WHERE c.id_user = ?`,
            [idUsuario]
        );

        if(libros.length === 0){
            return res.json({
                ok: false,
                mensaje: "No se han encontrado libros para este usuario"
            });
        }

        return res.json({
            ok: true,
            libros: libros
        })

    }catch(e){
        console.log("Error al recoger los libros del carrito del usuario: ", req.id_usuario)
        return res.status(500).json({ ok: false, mensaje: "Error al recoger los libros del carrito" });
    } finally {
        if (conexion) await conexion.end();
    }

}

module.exports={
    añadirLibroCarrito,
    librosCarrito
}

const conexionBD = require('../config/db');


async function crearLibro(isbn, titulo, autor, precio, stock) {
    let conexion;
    try {
        conexion = await conexionBD();
        const [resultado] = await conexion.execute(
            'INSERT INTO libros (isbn, titulo, autor, precio, stock) VALUES (?, ?, ?, ?, ?)',
            [isbn, titulo, autor, precio, stock]
        );
        console.log('Libro insertado en la BD:', resultado);
        return resultado;
    } catch (e) {
        console.error('Error al insertar libro:', e);
        throw e;
    } finally {
        if (conexion) await conexion.end();
    }
}

async function libros(req, res) {
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT * FROM libros LIMIT 6');

        if(filas.length === 0){
            res.status(404).json({
                ok: false,
                mensaje: "No se han encontrado libros en la base de datos"
            })
        }

        res.status(200).json({
            ok: true,
            filas: filas
        }) 
    } catch (e) {
        console.error('Error al obtener los libros de la BD:', e);
        throw e;
    } finally {
        if (conexion) await conexion.end();
    }
}

async function librosCompletos(req, res) {
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT * FROM libros');

        if(filas.length === 0){
            res.status(404).json({
                ok: false,
                mensaje: "No se han encontrado libros en la base de datos"
            })
        }

        res.status(200).json({
            ok: true,
            filas: filas
        }) 
    } catch (e) {
        console.error('Error al obtener los libros de la BD:', e);
        throw e;
    } finally {
        if (conexion) await conexion.end();
    }
}


async function librosFavoritosUser(req, res) {
    const id_usuario = req.id_usuario;
    console.log(id_usuario)
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute(`
            SELECT 
                f.id_favorito,
                f.fecha,
                l.id_libro,
                l.titulo,
                l.autor,
                l.categoria,
                l.editorial,
                l.existencias,
                l.url_imagen,
                l.descripcion,
                l.idioma
            FROM favoritos f
            INNER JOIN libros l ON f.id_libro = l.id_libro
            WHERE f.id_user = ?
            `, [id_usuario]
        );

        if(filas.length === 0){
            return res.status(404).json({
                ok: false,
                mensaje: "No se han encontrado libros favoritos para este usuario"
            })
        }

        return res.status(200).json({
            ok: true,
            filas: filas
        })
    } catch (e) {
        console.error('Error al obtener los libros favoritos de la BD:', e);
        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        })
    } finally {
        if (conexion) await conexion.end();
    }
}

async function eliminarFavoritoPorId(req,res) {
    const id_favorito = req.body.idFavorito
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute(
            'SELECT id_favorito FROM favoritos WHERE id_favorito = ?',
            [id_favorito]
        );

        if (filas.length === 0) return null;

        const [resultado] = await conexion.execute(
            'DELETE FROM favoritos WHERE id_favorito = ?',
            [id_favorito]
        );

        return res.status(200).json({
            ok: true,
            filas: resultado
        })
    } catch (e) {
        console.error('Error al eliminar favorito por id:', e);
        throw e;
    } finally {
        if (conexion) await conexion.end();
    }
}


//FUNCIONES LIBROS COMPRADOS
async function librosCompradosUser(req, res){
   const id_usuario = req.id_usuario;
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT c.id_compra, l.categoria, l.titulo, l.isbn, l.editorial, l.url_imagen, c.fecha '
            + 'from compra c join usuarios u on c.id_user = u.id_usuario JOIN libros l ON c.id_libro = l.id_libro where id_usuario = ?', [id_usuario]);

        if(filas.length === 0){
            return res.status(400).json({
                ok: false,
                mensaje: "No se han encontrado libros comprados para este usuario"
            })
        }

        return res.status(200).json({
            ok: true,
            filas: filas
        })
    } catch (e) {
        console.error('Error al obtener los libros comprados de la BD:', e);
        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        })
    } finally {
        if (conexion) await conexion.end();
    }
}


//FUNCION LIBROS FILTRADOS
async function librosFiltradosGenero(req, res) {
  let conexion;
  try {
    const listaCategorias = req.body.listaCategorias || [];
    conexion = await conexionBD();

    let sentencia = "SELECT * FROM libros";
    let parametrosWhere = [];

    if (Array.isArray(listaCategorias) && listaCategorias.length > 0) {
      const placeholders = listaCategorias.map(() => "?").join(", ");
      sentencia += ` WHERE categoria IN (${placeholders})`;
      parametrosWhere = listaCategorias;
    }

    const [filas] = await conexion.execute(sentencia, parametrosWhere);
    return res.status(200).json({ ok: true, filas });
  } catch (e) {
    return res.status(500).json({ ok: false, mensaje: "Error interno" });
  } finally {
    if (conexion) await conexion.end();
  }
}


module.exports= {
    librosFavoritosUser,
    libros,
    crearLibro,
    librosCompradosUser,
    eliminarFavoritoPorId,
    librosCompletos,
    librosFiltradosGenero
}

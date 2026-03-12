const conexionBD = require('../config/db');


/**
 * @brief Crea un libro en la base de datos.
 * @fecha 2026-01-08
 * @returns {Promise<object>} Resultado de la insercion.
 */
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

/**
 * @brief Lista libros con un limite simple.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con libros.
 */
async function libros(req, res) {
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT * FROM libros LIMIT 6');

        if(filas.length === 0){
            return res.status(404).json({
                ok: false,
                mensaje: "No se han encontrado libros en la base de datos"
            })
            
        }

        return res.status(200).json({
            ok: true,
            filas: filas
        }) 
    } catch (e) {
        console.error('Error al obtener los libros de la BD:', e);

    } finally {
        if (conexion) await conexion.end();
    }
}

/**
 * @brief Busca un libro por id.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con el libro.
 */
async function libroId(req, res) {
    let conexion;
    let {id_libro} = req.body;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT * FROM libros where id_libro = ?', [id_libro]);

        if(filas.length === 0){
            return res.status(404).json({
                ok: false,
                mensaje: "No se han encontrado libros en la base de datos"
            })
            
        }

        return res.status(200).json({
            ok: true,
            filas: filas
        }) 
    } catch (e) {
        console.error('Error al obtener los libros de la BD:', e);

    } finally {
        if (conexion) await conexion.end();
    }
}


/**
 * @brief Busca libros por titulo.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con resultados.
 */
async function libroTitulo(req, res) {
    let conexion;
    let {titulo_libro} = req.body;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT * FROM libros where LOWER(titulo) LIKE LOWER(?)', [`%${titulo_libro}%`]);

        if(filas.length === 0){
            return res.status(404).json({
                ok: false,
                mensaje: `No se han encontrado el libro con titulo: ${titulo_libro} en la base de datos`
            })
            
        }

        return res.status(200).json({
            ok: true,
            filas: filas
        }) 
    } catch (e) {
        console.error('Error al obtener los libros de la BD:', e);
        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });

    } finally {
        if (conexion) await conexion.end();
    }
}


/**
 * @brief Lista todos los libros sin limite.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con libros.
 */
async function librosCompletos(req, res) {
    let conexion;
    try {
        conexion = await conexionBD();
        const [filas] = await conexion.execute('SELECT * FROM libros');

        if(filas.length === 0){
            return res.status(404).json({
                ok: false,
                mensaje: "No se han encontrado libros en la base de datos"
            })
            return
        }

        return res.status(200).json({
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


/**
 * @brief Lista los favoritos del usuario.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con favoritos.
 */
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

/**
 * @brief Anade un libro a favoritos.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con resultado.
 */
async function anadirFavorito(req, res){
    const id_usuario = req.id_usuario;
    const id_libro = req.body.id_libro;

    if (!id_libro) {
        return res.status(400).json({
            ok: false,
            mensaje: "Id de libro requerido"
        });
    }

    let conexion;
    try{
        conexion = await conexionBD();
        const [existe] = await conexion.execute(
            'SELECT id_favorito FROM favoritos WHERE id_user = ? AND id_libro = ? LIMIT 1',
            [id_usuario, id_libro]
        );

        if (existe.length > 0) {
            return res.status(200).json({
                ok: true,
                mensaje: "El libro ya estaba en favoritos"
            });
        }

        const [resultado] = await conexion.execute(
            'INSERT INTO favoritos (id_user, id_libro) VALUES (?, ?)',
            [id_usuario, id_libro]
        );

        return res.status(200).json({
            ok: true,
            resultado
        });
    }catch(e){
        console.error('Error al añadir favorito:', e);
        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    } finally {
        if (conexion) await conexion.end();
    }
}

/**
 * @brief Elimina un favorito por id.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con resultado.
 */
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
/**
 * @brief Lista los libros comprados por el usuario.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con compras.
 */
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
/**
 * @brief Filtra libros por una lista de categorias.
 * @fecha 2026-01-08
 * @returns {Promise<void>} Respuesta JSON con libros filtrados.
 */
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
    anadirFavorito,
    librosFavoritosUser,
    libros,
    crearLibro,
    librosCompradosUser,
    eliminarFavoritoPorId,
    librosCompletos,
    librosFiltradosGenero,
    libroId,
    libroTitulo
}

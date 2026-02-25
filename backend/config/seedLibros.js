const axios = require("axios");
const conexionBD = require('../config/db')

async function seedLibros() {
  try {
    // 🔹 Conexión a la base de datos
    const conexion = await conexionBD()

    console.log("Conectado a la base de datos");

    // 🔹 Consulta a Open Library (búsqueda amplia)
    const response = await axios.get(
      "https://openlibrary.org/search.json?q=fiction&limit=50"
    );

    const libros = response.data.docs;
    console.log("Total recibidos:", libros.length);
    let insertados = 0;

    for (const libro of libros) {
      // Necesitamos ISBN válido
      if (!libro.isbn || libro.isbn.length === 0) continue;

      const isbn = libro.isbn;
        console.log("Procesando:", libro.title);
      // Saltar ISBN demasiado largo o raro
      if (isbn.length > 20) continue;

      const titulo = libro.title || "Título desconocido";
      const autor = libro.author_name ? libro.author_name[0] : "Autor desconocido";
      const idioma = libro.language ? libro.language[0] : "Desconocido";

      const url_imagen = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

      const categoria = "Ficción";
      const editorial = libro.publisher ? libro.publisher[0] : "Editorial desconocida";
      const existencias = Math.floor(Math.random() * 20) + 1;
      const descripcion = "Libro importado automáticamente desde Open Library.";

      try {
       await conexion.execute(
        `INSERT INTO libros 
        (isbn, titulo, autor, categoria, editorial, existencias, url_imagen, descripcion, idioma)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        titulo = VALUES(titulo)`,
        [
            isbn,
            titulo,
            autor,
            categoria,
            editorial,
            existencias,
            url_imagen,
            descripcion,
            idioma
        ]
        );

        insertados++;
      } catch (error) {
        // Evita que el script se pare si hay ISBN duplicado
    console.error("Error insertando:", error.code, error.message);
      }
    }

    console.log(`Libros insertados: ${insertados}`);

    await conexion.end();

  } catch (error) {
    console.error("Error general:", error.message);
  }
}

seedLibros();
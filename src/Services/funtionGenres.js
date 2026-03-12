/**
 * @brief Modelo simple de genero para la portada.
 * @fecha 2026-02-15
 * @returns {void} No devuelve nada.
 */
class Genero {
    /**
     * @brief Crea un genero con nombre e imagen.
     * @fecha 2026-02-15
     * @returns {void} No devuelve nada.
     */
    constructor(nombre, img) {
        this.nombre = nombre;
        this.img = img;
    }
}

const generosArray = [
    new Genero("Fantasia Épica", "/images/fantasiaEpica.png"),
    new Genero("Ciencia Ficción", "/images/cienciaFiccion.png"),
    new Genero("Misterio", "/images/misterio.png"),
    new Genero("Thiller", "/images/terror.png")
];

export default generosArray;

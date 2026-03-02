class Genero {
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

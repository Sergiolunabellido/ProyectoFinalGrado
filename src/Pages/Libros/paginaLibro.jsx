import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import toast from 'react-hot-toast';
import Header from "../../Components/Header/header";
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";

/**
 * @brief Devuelve un texto seguro cuando falta un dato.
 * @fecha 2026-01-28
 * @returns {string} Valor original o "No disponible".
 */
function valorDetalle(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "No disponible";
    }
    return valor;
}

/**
 * @brief Formatea una fecha a YYYY-MM-DD si es valida.
 * @fecha 2026-01-28
 * @returns {string} Fecha formateada o un texto de respaldo.
 */
function formatearFechaYMD(fechaRaw) {
    if (!fechaRaw) return "No disponible";

    const fecha = new Date(fechaRaw);
    if (Number.isNaN(fecha.getTime())) return fechaRaw;

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}


/**
 * @brief Pagina de detalle de un libro.
 * @fecha 2026-01-28
 * @returns {JSX.Element} Vista con portada, descripcion y datos.
 */
export default function PageBook(){

    const { id } = useParams();
    const { state } = useLocation();
    const [libro, setLibro] = useState(state?.libro || null);
    const [esFavorito, setEsFavorito] = useState(false);
    const [voces, setVoces] = useState([]);
   
    useEffect(() => {
        if (!("speechSynthesis" in window)) return;
        /**
         * @brief Carga las voces disponibles del navegador.
         * @fecha 2026-01-28
         * @returns {void} No devuelve nada.
         */
        const cargarVoces = () => {
            setVoces(window.speechSynthesis.getVoices());
        };
        cargarVoces();
        window.speechSynthesis.addEventListener("voiceschanged", cargarVoces);
        return () => window.speechSynthesis.removeEventListener("voiceschanged", cargarVoces);
    }, []);
    /**
     * @brief Elige la mejor voz disponible en español.
     * @fecha 2026-01-28
     * @returns {SpeechSynthesisVoice|null} Voz encontrada o null.
     */
    const seleccionarVoz = (lista) => {
        if (!Array.isArray(lista) || lista.length === 0) return null;
        const vocesES = lista.filter((v) => typeof v.lang === "string" && v.lang.toLowerCase().startsWith("es"));
        const preferenciaNombre = ["neural", "natural", "google", "microsoft"];
        for (const pref of preferenciaNombre) {
            const encontrada = vocesES.find((v) => v.name?.toLowerCase().includes(pref) || v.voiceURI?.toLowerCase().includes(pref));
            if (encontrada) return encontrada;
        }
        return vocesES[0] || lista[0];
    };
    /**
     * @brief Lee la descripcion del libro con voz del navegador.
     * @fecha 2026-01-28
     * @returns {void} No devuelve nada.
     */
    const leerResumen = () => {
        const texto = typeof libro?.descripcion === "string" ? libro.descripcion.trim() : "";
        if (!texto) {
            toast.error("No hay descripción disponible para leer.");
            return;
        }
        if (!("speechSynthesis" in window)) {
            toast.error("Tu navegador no soporta lectura por voz.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = "es-ES";
        const voz = seleccionarVoz(voces.length ? voces : window.speechSynthesis.getVoices());
        if (voz) utterance.voice = voz;
        utterance.rate = 0.98;
        window.speechSynthesis.speak(utterance);
    };
    /**
     * @brief Envia el libro actual al carrito del usuario.
     * @fecha 2026-01-28
     * @returns {void} No devuelve nada.
     */
    function añadirLibroCarrito(){
            fetch(`http://localhost:5000/anadirLibroCarrito`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ id_libro: id }),
            })
            .then((r) => {
                if(r.status === 401){
                    toast.error("Debes iniciar sesion primero.");
                    throw new Error("AUTH_REQUIRED")
                }
                return r.json()
            })
            .then(data => {
                if (data.ok) {
                    toast.success("El libro se ha añadido al carrito correctamente");
                } else {
                    toast.error(data.mensaje || "Ya existe este libro en tu carrito");
                }
            })
            .catch((error) => {
                console.error("Error al añadir al carrito:", error.message);
            });
    }
    /**
     * @brief Comprueba si el libro esta en favoritos.
     * @fecha 2026-01-28
     * @returns {Promise<void>} No devuelve datos, solo actualiza estado.
     */
    const comprobarFavorito = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try{
            const r = await fetch("http://localhost:5000/librosFavoritos",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (r.status === 401) return;
            const data = await r.json();
            if (data.ok && Array.isArray(data.filas)) {
                const existe = data.filas.some((f) => String(f.id_libro) === String(id));
                setEsFavorito(existe);
            } else {
                setEsFavorito(false);
            }
        }catch(e){
            setEsFavorito(false);
        }
    }
    /**
     * @brief Anade el libro a favoritos si no esta.
     * @fecha 2026-01-28
     * @returns {Promise<void>} No devuelve datos, solo actualiza estado.
     */
    const anadirFavorito = async () => {
        if (esFavorito) return;
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Debes iniciar sesion primero.");
            return;
        }
        try{
            const r = await fetch("http://localhost:5000/anadirFavorito",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id_libro: id }),
            });
            if (r.status === 401) {
                toast.error("Debes iniciar sesion primero.");
                return;
            }
            const data = await r.json();
            if (data.ok) {
                setEsFavorito(true);
                toast.success("Añadido a favoritos");
            } else {
                toast.error(data.mensaje || "No se pudo añadir a favoritos");
            }
        }catch(e){
            toast.error("Error al añadir a favoritos");
        }
    }
    useEffect(() => {
        if(!libro){
            fetch(`http://localhost:5000/libroId`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_libro: id }),
            })
            .then(r => r.json())
            .then(data => {
                if (data.ok && data.filas?.length) setLibro(data.filas[0]);
            });
        }
        comprobarFavorito();
    },[id,libro])

    if (!libro) return <p>Cargando...</p>;

    const precioLibro = Number(libro.precio);
    const precioOriginal = precioLibro + 10

    return (
        <div className="body1 overflow-x-hidden flex flex-col items-center w-screen h-full bg-[#102216] text-gray-300 ">
            
            <Header/> 
            <hr className="border-gray-700 border-solid w-[100%] opacity-50"/>

            <div className="flex flex-col items-center text-center gap-6 w-full px-4 sm:flex-row sm:items-start sm:text-left sm:gap-3 sm:px-0 mt-6">
                <div id="divPortadaLibro" className="w-full sm:w-[40%] flex items-center justify-center">
                    <div className="w-full max-w-[22rem] sm:max-w-[30rem] lg:max-w-[34rem]">
                        <div className="h-[22rem] sm:h-[28rem] lg:h-[34rem] relative">
                            <button
                                type="button"
                                onClick={anadirFavorito}
                                aria-label="AÃ±adir a favoritos"
                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#1B3120]/80 hover:bg-[#1B3120] text-[#22C55E]"
                            >
                                {esFavorito ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-star">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-star">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
                                    </svg>
                                )}
                            </button>
                            <Canvas
                                className="w-full h-full rounded-[10px] overflow-hidden"
                                frameloop="demand"
                                dpr={[1, 1.5]}
                                gl={{ antialias: true, powerPreference: "high-performance" }}
                                camera={{ position: [0, 0.2, 3.6], fov: 40 }}
                            >
                                <ambientLight intensity={1} />
                                <directionalLight position={[2.2, 2.8, 2]} intensity={1.1} />
                                <Suspense fallback={null}>
                                    <Libro3D libro={libro} />
                                </Suspense>
                                <OrbitControls enableRotate={true} enablePan={false} />
                            </Canvas>
                        </div>
                        <button
                            type="button"
                            onClick={leerResumen}
                            className="mt-4 w-full flex items-center justify-center gap-2 font-bold text-black bg-[#22C55E] text-base rounded-lg h-[3rem]"
                            aria-label="Leer resumen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 5v14l12-7z" />
                            </svg>
                            Resumen
                        </button>
                    </div>
                </div>
                <div id="divInformacionLibro" className="w-full sm:w-[70%] flex flex-col items-center sm:items-start justify-center">
                    <div id="tituloAutor" className="flex flex-col items-start gap-3">
                        <h1 className="font-bold leading-tight truncate text-white text-3xl">{libro.titulo}</h1>
                        <p className="text-[#22C55E] underline">{libro.autor}</p>
                        <div></div>
                    </div>
                    <hr className="border-gray-700 border-solid w-[70%] opacity-50"/>
                    <div id="precioCompraCarrito" className="flex flex-wrap items-center gap-5 mt-5 p-4 rounded-xl w-[70%] bg-[#1B3120]">
                        <div className="flex items-end gap-3 ms-3">
                            <h1 id="precioCompra" className="font-bold leading-tight truncate text-3xl text-white ">{"$"+libro.precio}</h1>
                            <p id="precioOriginal" className=" leading-tight truncate text-gray-300 text-2xl line-through ms-2 me-2">{"$"+precioOriginal} </p>
                        </div>
                        

                        <button id="botonCarrito" className="flex items-center justify-center font-bold text-black bg-[#22C55E] text-1xl w-[30%] rounded-lg h-[4rem]" onClick={añadirLibroCarrito}> Añadir al carrito</button>
                        <button id="botonCompra" className="flex items-center justify-center font-bold text-black bg-[#22C55E] text-1xl w-[30%] rounded-lg h-[4rem]">Comprar Libro</button>
                    </div>
                    <div id="descripcion" className="flex flex-col items-start text-justify w-[70%] mt-6 mb-5 gap-5">
                        <h1 className="font-bold text-2xl leading-tight truncate text-gray-300">Descripcion</h1>
                        {libro.descripcion}
                    </div>
                    <div id="detalleLibro"  className="flex flex-col items-start text-justify w-[70%] mt-6 mb-5 gap-5">
                        <h1 className="font-bold text-2xl leading-tight truncate text-gray-300">Detalles del Producto</h1>
                        <div className="mt-4 w-[100%] max-w-[32rem] ">
                            <div className="grid grid-cols-[auto,1fr] gap-x-20 gap-y-3 text-left">
                                <span className="font-bold text-gray-200">ISBN:</span>
                                <span className="text-gray-300">{valorDetalle(libro.isbn)}</span>

                                <span className="font-bold text-gray-200">Editorial:</span>
                                <span className="text-gray-300">{valorDetalle(libro.editorial)}</span>

                                <span className="font-bold text-gray-200">Publicacion:</span>
                                <span className="text-gray-300">{formatearFechaYMD(libro.publicacion)}</span>

                                <span className="font-bold text-gray-200">Paginas:</span>
                                <span className="text-gray-300">{valorDetalle(libro.paginas)}</span>

                                <span className="font-bold text-gray-200">Formato:</span>
                                <span className="text-gray-300">{valorDetalle(libro.formato)}</span>

                                <span className="font-bold text-gray-200">Idioma:</span>
                                <span className="text-gray-300">{valorDetalle(libro.idioma)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="reseñasUsuarios">
                <div id="valoracionLibro"></div>
                <div id="porcentajesEstrellas"></div>
            </div>
        </div>
    )
}









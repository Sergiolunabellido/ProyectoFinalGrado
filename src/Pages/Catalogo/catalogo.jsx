import Header from '../../Components/Header/header.jsx';
import Footer from '../../Components/Footer/footer.jsx';
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react"
import {useNavigate, useLocation} from "react-router-dom";



const LIBROS_POR_PAGINA = 12;

/**
 * @brief Pagina de catalogo con filtros y paginacion.
 * @fecha 2026-02-15
 * @returns {JSX.Element} Vista del catalogo de libros.
 */
export default function Catalogo(){


    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const location = useLocation();
    const [generosSeleccionados, setGenerosSeleccionados] = useState(location.state?.generos || []);
    const [paginaActual, setPaginaActual] = useState(1);


    /**
     * @brief Abre la pagina de detalle de un libro.
     * @fecha 2026-02-15
     * @returns {void} No devuelve nada.
     */
    const irPaginaLibro = (libro) =>{
        navigate(`/libro/${libro.id_libro}`,
            {
                state : {libro}
            }
        )
    }

    /**
     * @brief Actualiza la lista de generos seleccionados.
     * @fecha 2026-02-15
     * @returns {void} No devuelve nada.
     */
    const manejarCambioGenero = (e) =>{
        const {value, checked} = e.target;

        setGenerosSeleccionados((prev) => 
            checked ? [...prev, value] : prev.filter((g) => g !== value)
        )
    }

    /**
     * @brief Trae todos los libros del catalogo.
     * @fecha 2026-02-15
     * @returns {Promise<void>} No devuelve datos, solo actualiza estado.
     */
    const obtenerLibros = async () =>{
    
        try{


            let respuesta = await fetch("http://localhost:5000/libros",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                }
            });

    
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setLibros(datos.filas);
            }
            
        }catch(e){
            console.error("Error al pedir los datos del usuario:  ", e)
        }
        
    };


     /**
      * @brief Filtra libros por titulo o limpia el filtro.
      * @fecha 2026-02-15
      * @returns {Promise<void>} No devuelve datos, solo actualiza estado.
      */
     const filtradoTitulo = async (titulo) =>{

        if (!titulo || titulo.trim() === '') {
            obtenerLibros();
            return;
        }

        try{
            let respuesta = await fetch("http://localhost:5000/libroTitulo",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json',
                    
                },
                body: JSON.stringify({ titulo_libro: titulo })
            });

           
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setLibros(datos.filas);
            }

        }catch(e){
            console.error("Error al filtrar por titulo:  ", e)
        }

    };
    

 useEffect(() => {
  obtenerLibros();
}, []);

 useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const esReload = navEntry?.type === "reload";
    if (esReload) {
        setGenerosSeleccionados([]);
        return;
    }
    if (Array.isArray(location.state?.generos) && location.state.generos.length > 0) {
        setGenerosSeleccionados(location.state.generos);
    } else {
        setGenerosSeleccionados([]);
    }
 }, [location.key]);

 useEffect(() => {
  /**
   * @brief Pide al backend los libros filtrados por genero.
   * @fecha 2026-02-15
   * @returns {Promise<void>} No devuelve datos, solo actualiza estado.
   */
  const fetchFiltrados = async () => {
    const respuesta = await fetch("http://localhost:5000/librosFiltrados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listaCategorias: generosSeleccionados })
    });

    const datos = await respuesta.json();
    if (datos.ok) setLibros(datos.filas);
  };

  fetchFiltrados();
}, [generosSeleccionados]);

    useEffect(() => {
        setPaginaActual(1);
    }, [libros]);

    const totalPaginas = Math.max(1, Math.ceil(libros.length / LIBROS_POR_PAGINA));
    const inicio = (paginaActual - 1) * LIBROS_POR_PAGINA;
    const fin = inicio + LIBROS_POR_PAGINA;
    const librosPaginados = libros.slice(inicio, fin);

    /**
     * @brief Cambia a una pagina del paginador.
     * @fecha 2026-02-15
     * @returns {void} No devuelve nada.
     */
    const irPagina = (numeroPagina) => {
        if (numeroPagina < 1 || numeroPagina > totalPaginas) return;
        setPaginaActual(numeroPagina);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className='body1 overflow-x-hidden flex flex-col w-screen min-h-screen bg-[#102216] items-center'>
            <Header onSearchChange={(e) => filtradoTitulo(e.target.value)}/>
            <hr className="border-gray-700 border-solid w-[100%] m-[1rem] sm:w-800px opacity-50"/>
            <div className='flex w-full flex-col md:flex-row md:items-start md:justify-center gap-4 px-4'>
                <div className='flex flex-col items-start bg-white/5 w-full md:w-[18rem] h-auto md:h-[25rem] rounded-xl p-5 md:m-5'>

                    <h1 className='text-white font-bold text-[1.5rem]'>Filtros</h1>

                    <div className='flex flex-col items-start w-full' id='generos'>
                        <p className='text-white/50 text-[1.3rem] m-1.5'>Géneros</p>
                        <hr className="border-gray-700 border-solid w-[100%] "/>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 mt-3 w-full'>
                            <label className='flex items-center gap-2'>
                            <input type="checkbox" value='Fantasia' onChange={manejarCambioGenero} checked={generosSeleccionados.includes('Fantasia')}/>
                                <span className='text-white/50 text-[1rem]'>Fantasia</span>
                            </label>
                            <label className='flex items-center gap-2'>
                            <input type="checkbox" value='Ciencia Ficcion 'onChange={manejarCambioGenero} checked={generosSeleccionados.includes('Ciencia Ficcion ')}/>
                                <span className='text-white/50 text-[1rem]'>Ciencia Ficción</span>
                            </label>
                            <label className='flex items-center gap-2'>
                            <input type="checkbox" value='Misterio'onChange={manejarCambioGenero} checked={generosSeleccionados.includes('Misterio')}/>
                                <span className='text-white/50 text-[1rem]'>Misterio</span>
                            </label>
                            <label className='flex items-center gap-2'>
                            <input type="checkbox" value='Thriller'onChange={manejarCambioGenero} checked={generosSeleccionados.includes('Thriller')}/>
                                <span className='text-white/50 text-[1rem]'>Thriller</span>
                            </label>
                            <label className='flex items-center gap-2'>
                            <input type="checkbox" value='Novela'onChange={manejarCambioGenero} checked={generosSeleccionados.includes('Novela')}/>
                                <span className='text-white/50 text-[1rem]'>Novela</span>
                            </label>
                            <label className='flex items-center gap-2'>
                            <input type="checkbox" value='Programacion'onChange={manejarCambioGenero} checked={generosSeleccionados.includes('Programacion')}/>
                                <span className='text-white/50 text-[1rem]'>Programacion</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap items-center w-full md:w-[90%] m-2'>
                        {librosPaginados.map((libro) => (
                                <div
                                    key={`${libro.id_libro ?? "libro"}`}
                                    className="flex flex-col flex-shrink-0 w-[14rem] m-3 items-center"
                                    onClick={()=> irPaginaLibro(libro)}
                                >
                                    <div
                                        id="libroFavorito"
                                        className="h-[40vh] rounded-[10px] hover:scale-105 overflow-hidden"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Canvas
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

                                    <div className="mt-2 px-1">
                                        <p className="font-semibold leading-tight truncate text-gray-300">
                                            {libro.titulo ?? libro.titulo_libro ?? "Sin titulo"}
                                        </p>
                                        <p className="text-sm text-gray-300 truncate">
                                            {libro.autor ?? libro.autor_libro ?? "Autor desconocido"}
                                        </p>
                                        <p className="text-sm text-gray-400 truncate">
                                            {libro.editorial ?? libro.editorial_libro ?? "Editorial desconocida"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                </div>

            </div>
            <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-40"
                    onClick={() => irPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                >
                    Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => irPagina(num)}
                        className={`px-3 py-1 rounded ${
                            paginaActual === num ? "bg-green-600 text-black font-bold" : "bg-white/10 text-white"
                        }`}
                    >
                        {num}
                    </button>
                ))}

                <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-40"
                    onClick={() => irPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                >
                    Siguiente
                </button>
            </div>
            <hr className="border-gray-700 border-solid w-[100%] m-[1rem] sm:w-800px opacity-50"/>
            <Footer/>
        </div>
    )
}



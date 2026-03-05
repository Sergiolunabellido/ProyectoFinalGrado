import Header from '../../Components/Header/header.jsx';
import Footer from '../../Components/Footer/footer.jsx';
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react"
import {useNavigate} from "react-router-dom";

const LIBROS_POR_PAGINA = 12;

export default function Catalogo(){


    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);


    const irPaginaLibro = (libro) =>{
        navigate(`/libro/${libro.id_libro}`,
            {
                state : {libro}
            }
        )
    }

    const manejarCambioGenero = (e) =>{
        const {value, checked} = e.target;

        setGenerosSeleccionados((prev) => 
            checked ? [...prev, value] : prev.filter((g) => g !== value)
        )
    }

    const obtenerLibros = async () =>{
    
        try{


            let respuesta = await fetch("http://localhost:5000/libros",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials : 'include'
            });

        
    
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setLibros(datos.filas);
            }
            
        }catch(e){
            console.error("Error al pedir los datos del usuario:  ", e)
        }
        
    };


     const filtradoTitulo = async () =>{
    
        try{


            let respuesta = await fetch("http://localhost:5000/libroTitulo",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials : 'include'
            });

        
    
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setLibros(datos.filas);
            }
            
        }catch(e){
            console.error("Error al pedir los datos del usuario:  ", e)
        }
        
    };
    

 useEffect(() => {
  obtenerLibros();
}, []);

 useEffect(() => {
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

    const irPagina = (numeroPagina) => {
        if (numeroPagina < 1 || numeroPagina > totalPaginas) return;
        setPaginaActual(numeroPagina);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className='body1 overflow-x-hidden flex flex-col w-screen min-h-screen bg-[#102216] items-center'>
            <Header />
            <hr className="border-gray-700 border-solid w-[100%] m-[1rem] sm:w-800px opacity-50"/>
            <div className='flex w-[100%] ms-[40%] sm:m-3 justify-center'>
                <div className='flex flex-col items-start bg-white/5 w-[15%] h-[25rem] hidden md:flex rounded-xl p-5 m-5'>

                    <h1 className='text-white font-bold text-[1.5rem]'>Filtros</h1>

                    <div className='flex flex-col items-start w-full ' id='generos'>
                        <p className='text-white/50 text-[1.3rem] m-1.5'>Géneros</p>
                        <hr className="border-gray-700 border-solid w-[100%] "/>
                        <div className='flex items-center gap-2 m-3'>
                            <input type="checkbox" value='Fantasia' onChange={manejarCambioGenero}/>
                            <p className='text-white/50 text-[1rem]'>Fantasia</p>
                        </div>
                        <div className='flex items-center gap-2 m-3'>
                            <input type="checkbox" value='Ciencia Ficcion 'onChange={manejarCambioGenero} />
                            <p className='text-white/50 text-[1rem]'>Ciencia Ficción</p>
                        </div>
                        <div className='flex items-center gap-2 m-3'>
                            <input type="checkbox" value='Misterio'onChange={manejarCambioGenero}/>
                            <p className='text-white/50 text-[1rem]'>Misterio</p>
                        </div>
                        <div className='flex items-center gap-2 m-3'>
                            <input type="checkbox" value='Thriller'onChange={manejarCambioGenero}/>
                            <p className='text-white/50 text-[1rem]'>Thriller</p>
                        </div>
                        <div className='flex items-center gap-2 m-3'>
                            <input type="checkbox" value='Novela'onChange={manejarCambioGenero}/>
                            <p className='text-white/50 text-[1rem]'>Novela</p>
                        </div>
                        <div className='flex items-center gap-2 m-3'>
                            <input type="checkbox" value='Programacion'onChange={manejarCambioGenero}/>
                            <p className='text-white/50 text-[1rem]'>Programacion</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap items-center w-[90%] m-2'>
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

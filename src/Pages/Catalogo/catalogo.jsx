import Header from '../../Components/Header/header.jsx';
import Footer from '../../Components/Footer/footer.jsx';
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react"
import {useNavigate} from "react-router-dom";

export default function Catalogo(){


    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const [generosSeleccionados, setGenerosSeleccionados] = useState([]);


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


    return (
        <div className='body1 overflow-x-hidden flex flex-col w-screen h-full bg-[#102216] items-center'>
            <Header/>
            <hr className="border-gray-700 border-solid w-[100%] m-[1rem] sm:w-800px opacity-50"/>
            <div className='flex w-[100%] h-full'>
                <div className='flex flex-col items-start bg-white/5 w-[15%] h-[38%] hidden md:flex rounded-xl p-5 m-5'>

                    <h1 className='text-white font-bold text-[1.5rem]'>Filtros</h1>

                    <div className='flex flex-col items-start w-full' id='generos'>
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
                    </div>
                </div>
                <div className='flex flex-wrap items-start  float-rigth w-[90%] h-[100%] m-2'>
                        {libros.map((libro, index) => (
                                <div
                                    key={`${libro.id_libro ?? "libro"}`}
                                    className="flex flex-col flex-shrink-0 w-[14rem] m-3 items-center"
                                    
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

        </div>
    )
}

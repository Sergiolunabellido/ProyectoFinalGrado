import './principal.css'

import generosArray from '../../Services/funtionGenres.js';
import {useNavigate} from "react-router-dom";
import Header from '../../Components/Header/header.jsx';
import Footer from '../../Components/Footer/footer.jsx';
import { renovarToken } from "../../utils/utils";
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react"
export default function Principal (){

    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
   
    const handleClickLibros = () => {
        navigate('');
    };

    const handleClickGeneros = () => {
        navigate('');
    };

    const handleClickCatalogo = () => {
        navigate('/catalogo');
    };

    const obtenerLibros = async () =>{
    
        try{


            let respuesta = await fetch("http://localhost:5000/librosPublicos",{
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
     useEffect(() =>{
        obtenerLibros();
    },[])

    return (
            <div className="body1 overflow-x-hidden flex flex-col w-screen h-full bg-[#102216] items-center">
                <Header />
                <hr className="border-gray-700 border-solid w-[90%] m-[1rem] sm:w-800px opacity-50"/>
                <main className="m-4 flex-grow flex flex-col w-[90%]  items-center ">

                    <section className="presentacion flex flex-col items-center w-[90%] justify-center text-center mt-10 ">

                        <h1 className="text-white text-[3rem] font-bold uppercase mb-4">GoblinVerse</h1>
                        <p className="text-white text-xl uppercase mb-8 md:w-[90%] ">Adentrate en un mundo de intrepidantes
                            aventuras y conecta con tus personajes favoritos en GoblinVerse. </p>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-black text-[22px] font-bold py-3 px-8 rounded-[10px] transition duration-300 ease-in-out" onClick={handleClickCatalogo}>Explorar
                            Catálogo
                        </button>
                    </section>

                    <section className="mt-10 mb-10 w-[100%] ">
                        <div className="p-10 flex items-start">
                            <h2 className="text-white text-4xl font-bold mb-10">Nuestras gemas destacadas</h2>
                        </div>

                        <div id="bookList"
                             className=" flex flex-wrap items-center justify-center horizontal-scroll w-full space-x-4 gap-5">

                            {libros.map((libro, index) => (
                                <div
                                    key={`${libro.id_libro ?? "libro"}-${index}`}
                                    className="flex-shrink-0 w-[14rem] m-3"
                                    
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
                    </section>


                    

                    <section className="flex flex-col items-start w-[100%]">
                        <div className="p-10 flex items-start">
                            <h2 className="text-white text-4xl font-bold  mt-16 mb-10">Explora tu genero favorito</h2>
                        </div>
                   
                        <div id="divGeneros"
                             className="flex flex-wrap justify-center items-center gap-4 mb-10 h-full w-full  ">
                            {generosArray.map((genero, index) => (
                                <div
                                    key={index}
                                    className=" text-white h-[15rem] w-[25rem] rounded-[20px] flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-black-100"
                                    style={{
                                        cursor: "pointer",
                                        backgroundSize: "cover",
                                        backgroundImage: `url(${genero.img})`,
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                    }}

                                >
                                    <h2 className="text-lg font-bold w-ful text-center rounded-md mb-2 p-2 object-cover">
                                        {genero.nombre}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </section>


                </main>
                <hr className="border-gray-700 w-[90%] border-solid m-[1rem]  opacity-50"/>
                <Footer />


            </div>
    )
}

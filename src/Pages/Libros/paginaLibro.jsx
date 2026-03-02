import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import Header from "../../Components/Header/header";
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";

function valorDetalle(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "No disponible";
    }
    return valor;
}

function formatearFechaYMD(fechaRaw) {
    if (!fechaRaw) return "No disponible";

    const fecha = new Date(fechaRaw);
    if (Number.isNaN(fecha.getTime())) return fechaRaw;

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}


export default function PageBook(){

    const { id } = useParams();
    const { state } = useLocation();
    const [libro, setLibro] = useState(state?.libro || null);
   


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
                    <div className="w-full max-w-[22rem] sm:max-w-[30rem] lg:max-w-[34rem] h-[22rem] sm:h-[28rem] lg:h-[34rem]">
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
                            <h1 id="precioCompra" className="font-bold leading-tight truncate text-4xl text-white ">{"$"+libro.precio}</h1>
                            <p id="precioOriginal" className=" leading-tight truncate text-gray-300 text-2xl line-through ms-2 me-2">{"$"+precioOriginal} </p>
                        </div>
                        

                        <button id="botonCarrito" className="flex items-center justify-center font-bold text-black bg-[#22C55E] text-xl w-[28%] rounded-lg h-[4rem]"> Añadir al carrito</button>
                        <button id="botonCompra" className="flex items-center justify-center font-bold text-black bg-[#22C55E] text-1xl w-[28%] rounded-lg h-[4rem]">Comprar Libro</button>
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

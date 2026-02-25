import { Suspense,useState, useEffect } from "react"
import { renovarToken } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";
export default function MisCompras(){

    const navigate = useNavigate()

    const [compras, setCompras] = useState([]);

    const obtenerDatosCompra = async () => {
    try {
        let respuesta = await fetch("http://localhost:5000/librosComprados", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        });

        if (respuesta.status === 401) {
        const tokenRenovado = await renovarToken();
        if (!tokenRenovado) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        respuesta = await fetch("http://localhost:5000/librosComprados", {
            method: "POST",
            headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenRenovado}`,
            },
            credentials: "include",
        });
        }

        const datos = await respuesta.json();
        if (datos.ok && Array.isArray(datos.filas)) {
        setCompras(datos.filas);
        document.getElementById('textoAviso').textContent = ''
        } else {

        setCompras([]);
        document.getElementById('textoAviso').textContent = datos.mensaje
        }
    } catch (e) {

        setCompras([]);
        console.error("Error al pedir compras:", e);
    }
    };

    useEffect(() =>{
        obtenerDatosCompra() 
    },[])

    return (
        <>
            <h1 className="text-2xl lg:text-5xl ml-3 mb-3">Compras Realizadas</h1>
            <div id="listadoCompras" className="flex flex-col items-center m-3  w-[100%] h-[100%]">
                <h1 id="textoAviso" className="text-2xl"></h1>
                    {compras.map((libro, index) => (
                        <div
                            key={`${libro.id_libro ?? "libro"}-${index}`} 
                            className="flex items-center justify-between  w-[100%] h-[25%] border-green border-2  shadow-md shadow-green-600/70 rounded-2xl m-3 p-2"
                                style={{ cursor: "pointer" }}
                            >
                                <div className="flex items-center gap-2 m-3 w-[30%]">
                                     <Canvas
                                        frameloop="demand"
                                        dpr={[1.6, 1.5]}
                                        gl={{ antialias: true, powerPreference: "high-performance" }}
                                        camera={{ position: [0, 0.5, 3.6], fov: 35 }}
                                    >
                                        <ambientLight intensity={0.7} />
                                        <directionalLight position={[2.2, 2.8, 2]} intensity={1.1} />
                                        <Suspense fallback={null}>
                                            <Libro3D libro={libro} />
                                        </Suspense>
                                        <OrbitControls enableRotate={true} enablePan={false} />
                                    </Canvas>
                                    <div id="datosLibroCompra" className="flex flex-col gap-1 m-2 items-start w-[100%]">
                                        <p>ISBN: {libro.isbn}</p>
                                        <p>Titulo: {libro.titulo}</p>
                                        <p>Categoria: {libro.categoria}</p>
                                        <p>Editorial: {libro.editorial}</p>
                                    </div>
                                </div>
                                <div id="datosCompra" className="flex items-start flex-col gap-3 p-4">
                                    <p>Id de compra: {libro.id_compra}</p>
                                    <p>Fecha de compra: {libro.fecha}</p>
                                </div>
                        </div>
                    ))}
                   

                
            </div>
        </>
    )
}

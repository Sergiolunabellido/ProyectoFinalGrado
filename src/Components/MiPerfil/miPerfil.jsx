import { Suspense, useState, useEffect } from "react"
import { renovarToken } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import {Libro3D} from '../../utils/utils'
import { OrbitControls } from "@react-three/drei";

export default function MiPerfil(){
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState("");
    const [librosFavoritos, setLibrosFavoritos] = useState([]);
    const [librosComprados, setLibrosComprados] = useState(0);
    const [generoFavorito, setGeneroFavorito] = useState("");
    const [menuCtx, setMenuCtx] = useState({
        visible: false,
        x: 0,
        y: 0,
        libro: null,
    });


    const abrirMenuContextual = (e, libro) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuCtx({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            libro,
        });
    };

    const cerrarMenuContextual = () => {
        setMenuCtx((m) => ({ ...m, visible: false }));
    };

    const eliminarFavorito = async (idFavorito) => {
        // aquí tu fetch al backend para borrar favorito
        // await fetch("http://localhost:5000/eliminarFavorito", {...})
        let respuesta = await fetch("http://localhost:5000/eliminarLibro",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials : 'include',
                body: JSON.stringify({ idFavorito }),
            });

            const datos = await respuesta.json();
            if(datos.ok ){
                alert("Se a eliminado el libro de favoritos")
                setLibrosFavoritos((prev) => prev.filter((l) => l.id_libro !== idFavorito));
                cerrarMenuContextual();
                await obtenerLibros()
        
            }
       
        
    };



    const obtenerUsuario = async () =>{
    
        try{
            let respuesta = await fetch("http://localhost:5000/usuarios",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials : 'include'
            });

            if(respuesta.status === 401){
                const tokenRenovado = await renovarToken();
                console.log(tokenRenovado)
                if(!tokenRenovado){
                    localStorage.removeItem('token');
                    navigate('/login')
                    alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                    return;
                }


                respuesta = await fetch("http://localhost:5000/usuarios", {
                    method: 'POST',
                    headers: {
                        "Content-type": 'application/json', 
                        'Authorization': `Bearer ${tokenRenovado}`
                    },
                    credentials: 'include'
                });
                
            }
    
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setUsuario(datos.filas[0].nombre_usuario);
            }
            
        }catch(e){
            console.error("Error al pedir los datos del usuario:  ", e)
        }
        
    };

    const obtenerLibros = async () =>{
        try{
            let respuesta = await fetch("http://localhost:5000/librosFavoritos",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if(respuesta.status === 401){
                const tokenRenovado = await renovarToken();

                if(!tokenRenovado){
                    localStorage.removeItem('token');
                    navigate('/login')
                    return;
                }

                respuesta = await fetch("http://localhost:5000/librosFavoritos", {
                    method: 'POST',
                    headers: {
                        "Content-type": 'application/json', 
                        'Authorization': `Bearer ${tokenRenovado}`
                    },
                    credentials: 'include'
                });

            }
    
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setLibrosFavoritos(datos.filas);
            
            // contar cuántas veces aparece cada género
            const conteoGeneros = datos.filas.reduce((acc, libro) => {
                const genero = libro.categoria?.trim();
                if (!genero) return acc;
                acc[genero] = (acc[genero] || 0) + 1;
                return acc;
            }, {});

            // obtener el género con mayor cantidad
            const generoMasRepetido = Object.keys(conteoGeneros).reduce((max, genero) => {
                return conteoGeneros[genero] > (conteoGeneros[max] || 0) ? genero : max;
            }, "");

            setGeneroFavorito(generoMasRepetido);

            }else  document.getElementById('textoAviso').textContent = datos.mensaje
            
        }catch(e){
            console.error("Error al pedir los datos de los libros:  ", e)
        }
    }

    const obtenerComprados = async () =>{
        try{
            let respuesta = await fetch("http://localhost:5000/librosComprados",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if(respuesta.status === 401){
                const tokenRenovado = await renovarToken();

                if(!tokenRenovado){
                    localStorage.removeItem('token');
                    navigate('/login')
                    return;
                }

                respuesta = await fetch("http://localhost:5000/librosComprados", {
                    method: 'POST',
                    headers: {
                        "Content-type": 'application/json', 
                        'Authorization': `Bearer ${tokenRenovado}`
                    },
                    credentials: 'include'
                });

            }
    
            const datos = await respuesta.json();
            if(datos.ok && datos.filas.length > 0){
                setLibrosComprados(datos.filas.length)
            } else {
                setLibrosComprados(0);
            }
            
        }catch(e){
            setLibrosComprados(0);
            console.error("Error al pedir los datos de los libros:  ", e)
        }
    }

    useEffect(() =>{
        obtenerUsuario();
        obtenerLibros();
        obtenerComprados() 
    },[])


    return(
        <>
            <h1 className="text-2xl lg:text-5xl">Bienvenido de nuevo, {usuario}</h1>
            <div className="flex gap-5 items-center mt-[5%] w-full">
                    <div className="flex flex-col items-start justify-center p-5 gap-3 w-1/2 h-[10rem] border-solid border-[1px] border-[#39ff14]/15 rounded-lg bg-[#1a3a25]/50">
                        <p className="text-xl text-gray-300">Libros Comprados</p>
                        <p className="text-3xl font-black">{librosComprados || "0"}</p>
                    </div>
                    <div className="flex flex-col items-start justify-center p-5 gap-3 w-1/2  h-[10rem] border-solid border-[1px] border-[#39ff14]/15 rounded-lg bg-[#1a3a25]/50">
                        <p className="text-xl text-gray-300">Genero Favorito</p>
                        <p className="text-3xl font-black">{generoFavorito || "No tiene favoritos"}</p>
                    </div>
            </div>

            <div id="divFavoritos" className="flex flex-col gap-5 items-start mt-[3%] w-full ">
                <h1 className="text-2xl lg:text-3xl flex-shrink-0">Tu Biblioteca de Favoritos</h1>

                <div className="flex gap-5 items-center mt-[1%] w-full overflow-x-auto pb-3 flex-wrap ">
                    <h1 id="textoAviso" className="text-2xl"></h1>
                    {librosFavoritos.map((libro, index) => (
                        <div
                            key={`${libro.id_libro ?? "libro"}-${index}`}
                            className="flex-shrink-0 w-[14rem] m-3 select-none"
                            onContextMenu={(e) => abrirMenuContextual(e, libro)}
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
                                <p className="font-semibold leading-tight truncate">
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
            {menuCtx.visible && (
                <>
                    <div className="fixed inset-0 z-40" onClick={cerrarMenuContextual} />
                    <ul
                    className="fixed z-50 bg-[#1a1a1a] border border-[#39ff14]/30 rounded-md shadow-lg min-w-[160px]"
                    style={{ top: menuCtx.y, left: menuCtx.x }}
                    >
                    <li>
                        <button
                        className="w-full text-left px-4 py-2 hover:bg-red-600/20 text-red-400"
                        onClick={() => eliminarFavorito(menuCtx.libro.id_favorito)}
                        >
                        Eliminar
                        </button>
                    </li>
                    </ul>
                </>
            )}

        </>
    )
}

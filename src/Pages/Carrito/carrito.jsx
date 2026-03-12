import Header from "../../Components/Header/header"
import {useNavigate} from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { renovarToken } from "../../utils/utils";

import toast from 'react-hot-toast';

/**
 * @brief Pagina de carrito con listado y resumen de compra.
 * @fecha 2026-02-25
 * @returns {JSX.Element} Vista del carrito.
 */
export default function Carrito(){

    const navigate = useNavigate();
    const yaCargadoRef = useRef(false);
    /**
     * @brief Vuelve al catalogo para seguir comprando.
     * @fecha 2026-02-25
     * @returns {void} No devuelve nada.
     */
    const handleClickCatalogo = () => {
        navigate('/catalogo');
    };

    const [libros, setLibros] = useState([]);
    const [cantidadLibros, setCantidadLibros] = useState(1)
    const [cantidadesPorLibro, setCantidadesPorLibro] = useState({})
    const [precioLibro, setPrecioLibro] = useState()
    const PRECIO_ENVIO = 5.99;

    /**
     * @brief Suma una unidad al libro indicado.
     * @fecha 2026-02-25
     * @returns {void} No devuelve nada.
     */
    const cantidadMas1 = ((idLibro)=>{
        setCantidadesPorLibro((prev) => ({
            ...prev,
            [idLibro]: (prev[idLibro] ?? 1) + 1
        }));
    })

    /**
     * @brief Elimina un libro del carrito en backend y refresca lista.
     * @fecha 2026-02-25
     * @returns {Promise<void>} No devuelve datos.
     */
    const eliminarLibro = (async (idLibro) => {
        try{
            await fetch("http://localhost:5000/eliminarLibroCarrito",{
                method: 'POST',
                headers: {
                    "Content-type": 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials : 'include',
                body: JSON.stringify({ id_libro: idLibro }),
            });
            await recogerLibrosCarrito();
        }catch(e){
            console.error("Error al eliminar el libro del carrito:  ", e)
        }
    })

    /**
     * @brief Resta una unidad y elimina si llega a cero.
     * @fecha 2026-02-25
     * @returns {void} No devuelve nada.
     */
    const cantidadMenos1 = ((idLibro)=>{
        setCantidadesPorLibro((prev) => {
            const actual = prev[idLibro] ?? 1;
            const siguiente = actual - 1;
            if (siguiente <= 0) {
                eliminarLibro(idLibro)
                // Quitar el libro del carrito cuando la cantidad llega a 0
                setLibros((prev) => prev.filter((l) => l.id_libro !== idLibro));
                const actualizado = { ...prev };
                delete actualizado[idLibro];
                return actualizado;
            }
            return { ...prev, [idLibro]: siguiente };
        });
    })

    // useMemo cachea el resultado y solo recalcula cuando 'libros' cambia
    const subtotal = useMemo(() => {
        return libros.reduce((total, libro) => {
            const cantidad = cantidadesPorLibro[libro.id_libro] ?? 1;
            return total + (parseFloat(libro.precio) || 0) * cantidad;
        }, 0);
    }, [libros, cantidadesPorLibro]);

    const precioTotal = useMemo(() => {
        return subtotal + PRECIO_ENVIO;
    }, [subtotal]);

    /**
     * @brief Carga los libros del carrito con control de token.
     * @fecha 2026-02-25
     * @returns {Promise<void>} No devuelve datos, solo actualiza estado.
     */
    const recogerLibrosCarrito = async () =>{

        try{


            let respuesta = await fetch("http://localhost:5000/librosCarrito",{
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
                    toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                    return;
                }

                respuesta = await fetch("http://localhost:5000/librosCarrito",{
                    method: 'POST',
                    headers: {
                        "Content-type": 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials : 'include'
                });

            }

            const datos = await respuesta.json();
            console.log("Respuesta del backend:", datos);

            if(datos.ok && datos.libros && datos.libros.length > 0){
                setLibros(datos.libros);
                setCantidadesPorLibro((prev) => {
                    const actualizado = { ...prev };
                    datos.libros.forEach((libro) => {
                        if (actualizado[libro.id_libro] == null) {
                            actualizado[libro.id_libro] = 1;
                        }
                    });
                    return actualizado;
                });
            }else {
                console.log("No se cargaron libros:", datos.mensaje);
                toast.error(datos.mensaje || "Error al cargar el carrito");
            }
            
        }catch(e){
            console.error("Error al pedir los datos del usuario:  ", e)
        }

    }

    useEffect(() =>{
        if (yaCargadoRef.current) return;
        yaCargadoRef.current = true;
        recogerLibrosCarrito()
    }, [])

    return (
       <div className="body1 flex flex-col items-center w-screen min-h-screen bg-[#102216]">  
            <Header/>
            <div id="divPadreCarrito" className="flex flex-col gap-3 p-5 w-screen flex-grow">
                <div id="divTituloPedido" className="flex flex-col gap-3 items-start m-5">
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">Mi carrito</h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300">Revisa tus articulos antes del pago</p>
                </div>
                <div id="divListaResumenPedido" className="flex gap-5 justify-between w-[100%] h-[100%]">
                    <div id="divListaPedido" className="flex flex-col gap-5 w-[70%]  p-2">
                       {libros.map((libro) => (
                            <div key={libro.id_libro} className="flex items-center justify-between gap-3 p-5 w-[100%] min-h-[180px] max-h-[200px] border border-solid rounded-xl border-gray-500">
                                <div className="flex items-center w-[50%] min-h-[180px] max-h-[200px] gap-5">
                                    <img src={libro.url_imagen} alt={libro.titulo} className="w-[25%] h-[160px] rounded-lg object-cover"/>
                                    <div className="flex flex-col gap-2 items-start ">
                                        <p className="text-2xl ">{libro.titulo}</p>
                                        <p className="text-lg text-gray-500">Por {libro.autor}</p>
                                        <p className="text-xl ">${parseFloat(libro.precio).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 items-center w-[30%] h-[100%] gap-[15%]">
                                    <div className="flex items-center justify-between ps-3 pe-3 w-[30%] h-[20%] bg-gray-500 rounded-2xl">
                                        <button className="text-2xl" onClick={() => cantidadMenos1(libro.id_libro)}>-</button>
                                        <p className="text-xl">{cantidadesPorLibro[libro.id_libro] ?? 1}</p>
                                        <button className="text-2xl w-10%" onClick={() => cantidadMas1(libro.id_libro)}>+</button>
                                    </div>
                                    <div className="flex items-center justify-around w-[50%] ">
                                        <h1 className="text-xl font-bold">
                                            ${((parseFloat(libro.precio) || 0) * (cantidadesPorLibro[libro.id_libro] ?? 1)).toFixed(2)}
                                        </h1>
                                        <button onClick={() => eliminarLibro(libro.id_libro)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button>
                                    </div>
                                </div>
                            </div>
                       ))}
                    </div>
                    <div id="divResumenPedido" className="flex flex-col justify-between me-6 bg-[#1a3a25] w-full sm:w-[80%] md:w-[55%] lg:w-[30%] min-w-[320px] max-w-[440px] min-h-[520px] rounded-xl shadow-xl">
                        <div id="divSubEnvio" className="flex flex-col gap-4 m-4 items-start">

                            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-bold">Resumen Pedido</h1>

                            <div id="divSubtotalPedido" className="flex items-center justify-between gap-3 w-[100%]">
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-bold">Subtotal: </p>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300">${subtotal.toFixed(2)}</p>
                            </div>

                            <div id="divPrecioEnvio" className="flex items-center justify-between  gap-3 w-[100%]">
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-bold">Precio envio: </p>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300">${PRECIO_ENVIO.toFixed(2)}</p>
                            </div>

                        </div>
                        <hr />
                        <div id="divTotalBotonesCompra"  className="flex flex-col gap-5 m-4 justify-between h-[50%]">
                            <div id="divTotalPedido" className="flex items-center justify-between w-[100%]">
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-200">Total: </p>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">${precioTotal.toFixed(2)}</p>
                            </div>
                            <div id="divBotonesCompra" className="flex flex-col gap-4 h-[50%]">
                                <button id="botonComprar" className="bg-green-600 hover:bg-green-700 text-black text-sm sm:text-base md:text-lg lg:text-xl font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-[10px] transition duration-300 ease-in-out">
                                    Procesar Pago
                                </button>
                                <button id="botonSeguirComprando" onClick={handleClickCatalogo} className="text-green-600 hover:text-green-700 text-sm sm:text-base md:text-lg lg:text-xl font-bold py-2 sm:py-3 transition duration-300 ease-in-out">
                                    Continuar Compra
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
    )
}

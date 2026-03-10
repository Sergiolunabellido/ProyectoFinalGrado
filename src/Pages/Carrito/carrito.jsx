import Header from "../../Components/Header/header"
import {useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';




export default function Carrito(){

    const navigate = useNavigate();
    const handleClickCatalogo = () => {
        navigate('/catalogo');
    };

    const [libros, setLibros] = useState([]);

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

            const datos = await respuesta.json();
            console.log("Respuesta del backend:", datos);

            if(datos.ok && datos.libros && datos.libros.length > 0){
                setLibros(datos.libros);
            }else {
                console.log("No se cargaron libros:", datos.mensaje);
                toast.error(datos.mensaje || "Error al cargar el carrito");
            }
            
        }catch(e){
            console.error("Error al pedir los datos del usuario:  ", e)
        }

    }

    useEffect(() =>{
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
                            <div key={libro.id_libro} className="flex items-center gap-3 p-5 w-[100%] border border-solid rounded-xl border-gray-500">
                                <div>
                                    <img src={libro.url_imagen} alt={libro.titulo} className="w-[50%] rounded-xl"/>
                                    <div></div>
                                </div>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                       ))}
                    </div>
                    <div id="divResumenPedido" className="flex flex-col justify-between me-6 bg-[#1a3a25] w-[50%] lg:w-[25%] rounded-xl shadow-xl">
                        <div id="divSubEnvio" className="flex flex-col gap-4 m-4 items-start">

                            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-bold">Resumen Pedido</h1>

                            <div id="divSubtotalPedido" className="flex items-center justify-between gap-3 w-[100%]">
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-bold">Subtotal: </p>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300">precioSubtotal</p>
                            </div>

                            <div id="divPrecioEnvio" className="flex items-center justify-between  gap-3 w-[100%]">
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-bold">Precio envio: </p>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300">precioEnvio</p>
                            </div>

                        </div>
                        <hr />
                        <div id="divTotalBotonesCompra"  className="flex flex-col gap-5 m-4 justify-between h-[50%]">
                            <div id="divTotalPedido" className="flex items-center justify-between w-[100%]">
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-200">Total: </p>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">precioTotal</p>
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
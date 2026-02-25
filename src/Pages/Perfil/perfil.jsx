import MiPerfil from "../../Components/MiPerfil/miPerfil"
import MisCompras from "../../Components/MisCompras/misCompras";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CerrarSesion } from "../../Services/cerrarSesion";

export default function Perfil(){

    const [perfil, setPerfil] = useState(true);
    const navigate = useNavigate();

    const closeSession = async ()=>{
        await CerrarSesion()
        navigate('/')
    }

    const volverPrincipal = ()=>{
        navigate('/')
    }
        const [usuario, setUsuario] = useState("");
        const [gmail, setGmail] = useState("");
        
    
        const obtenerUsuario = async () =>{
        
            try{
                const respuesta = await fetch("http://localhost:5000/usuarios",{
                    method: 'POST',
                    headers: {
                        "Content-type": 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
        
                const datos = await respuesta.json();
                if(datos.ok && datos.filas.length > 0){
                    setUsuario(datos.filas[0].nombre_usuario);
                    setGmail(datos.filas[0].gmail)
                }
                
            }catch(e){
                console.error("Error al pedir los datos del usuario:  ", e)
            }
            
        };
    
        useEffect(() =>{
            obtenerUsuario();
            
        },[])

    return(
        <div className="flex  bg-[#102216] min-h-screen text-white font-medium" id="perfil">
            <div className="flex flex-col items-start justify-between bg-[#1a3a25]/50 min-h-screen w-1/5" id="navbar-perfil">
                <div className="flex flex-col items-start gap-2 w-full">
                    <div >
                        <button type="button" onClick={volverPrincipal} className="flex items-center m-8 ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                    stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="inherit"
                                    className="icon icon-tabler icons-tabler-outline icon-tabler-books">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
                                <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
                                <path d="M5 8h4"/>
                                <path d="M9 16h4"/>
                                <path
                                    d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z"/>
                                <path d="M14 9l4 -1"/>
                                <path d="M16 16l3.923 -.98"/>
                            </svg>
                            <h1 className="text-3xl font-bold m-1 hidden lg:flex"><a href="">GoblinVerse</a>
                            </h1>
                        </button>
                        
                    </div>
                    <hr  />
                    <div className="m-7">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-user-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></svg>
                            <div className="flex flex-col items-start">
                                <h2 className=" hidden sm:flex">{usuario}</h2>
                                <p className=" hidden xl:flex text-gray-400">{gmail}</p>
                            </div>
                        </div>
                    </div>
                    <hr  />
                    <div className=" flex flex-col gap-5 m-8">
                       <div id="div-perfil">
                            <button type="button" className={`flex gap-2 items-center text-white/75 w-full h-full  rounded-lg  ${perfil  ? "bg-green-700 p-3" : ""}`} onClick={() => setPerfil(true)}>
                            
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" 
                                fill="currentColor"
                                className="icon icon-tabler icons-tabler-filled icon-tabler-user">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                                    <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                                </svg>
                                <h1 className="text-xl hidden lg:flex " >Mi Perfil</h1>
                            </button>
                       </div>

                       <div id="div-compras">
                            <button type="button" className={`flex gap-2 items-center text-white/75 w-full h-full  rounded-lg  ${perfil  ? "" : "bg-green-700 p-3"}`} onClick={() => setPerfil(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="currentColor" 
                                    class="icon icon-tabler icons-tabler-filled icon-tabler-shopping-cart">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 
                                    .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 
                                    -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 
                                    -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 
                                    -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2m11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2" />
                                </svg>
                                <h1 className="text-xl hidden lg:flex" >Mis Compras</h1>
                            </button>
                       </div>
                    </div>
                </div>



                <div id="divCerrarSesion" >
                    <button className="flex items-center text-lg gap-2 m-8 hover:text-green-500 text-2xl" onClick={closeSession}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                            class="icon icon-tabler icons-tabler-outline icon-tabler-door-exit">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 12v.01" />
                            <path d="M3 21h18" /><path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" />
                            <path d="M14 7h7m-3 -3l3 3l-3 3" />
                        </svg>
                        <h1 className="hidden lg:block">cerrar sesion</h1>
                    </button>
                </div>
            </div>
            <div className="w-px self-stretch bg-[#39ff14]/25" />
            {/*Div contenido main dinamico*/}
            <div id="contenidoPerfil" className="flex items-start flex-col w-[90%] m-[5%] ml-[2%] ">
                {perfil ? <MiPerfil /> : <MisCompras />}
            </div>
        </div>
    )
}
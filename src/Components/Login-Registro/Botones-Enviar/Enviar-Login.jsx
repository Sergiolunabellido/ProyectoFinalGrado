import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @brief Boton que valida el login y guarda el token si todo va bien.
 * @fecha 2026-01-12
 * @returns {JSX.Element} Boton y posible mensaje de error.
 */
export default function BotonEnviarLogin({usuario, contraseña}){

    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    /**
     * @brief Envia las credenciales al backend y gestiona la respuesta.
     * @fecha 2026-01-12
     * @returns {Promise<void>} No devuelve datos, solo actualiza estado y navega.
     */
    const comprobarLogin = async () =>{
    
        try{
            const respuesta = await fetch("http://localhost:5000/login",{
                method: 'POST',
                headers: {"Content-type": 'application/json'},
                body: JSON.stringify({
                    usuario: usuario,
                    contraseña: contraseña,
                }),
                credentials: 'include',
            });
    
            const datos = await respuesta.json();
            if(datos.ok){
                setError();
                console.log(datos.mensaje)
                localStorage.setItem('token', datos.token);
                console.log('token', datos.token)
                navigate("/")
            }else{
                setError(datos.mensaje);
            }
            
        }catch(e){
            console.error("Error al realizar el inicio de sesion: ", e)
        }
        
    };

    return(
        <>
           {error && 
                <div className="flex items-center justify-center w-[30vw] h-[8vh] text-red-500 p-3 m-3 border-2 border-red-500 rounded-md bg-red-500/20">
                    {error}
                </div>
            }
            <button type='button' className="btn-submit" onClick={comprobarLogin}>Enviar</button>
        </>
        
       
        
    )
}

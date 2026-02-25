import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @brief Esta funcion realiza una peticion al back-end para comprobar si el usuario se encuentra registrado
 * en la base de datos, asi como generar un token junto a las sesiones correspondientes que permitiran gestionar
 * las acciones de dicho usuario y guardarlas en la base de datos.
 * @param {usuario, contraseña} param0 
 * @returns error: div_error || button(enviar)
 */
export default function BotonEnviarLogin({usuario, contraseña}){

    const [error, setError] = useState("");
    const navigate = useNavigate(); 

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
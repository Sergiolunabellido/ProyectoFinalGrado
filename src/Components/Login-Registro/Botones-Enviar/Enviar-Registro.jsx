import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BotonEnviarRegistro({nombre, email, password}){

    const [error, setError] = useState('');
    const [correcto, setCorrecto] = useState('');
    const navigate = useNavigate();

    const enviarRegistro = async (e) => {
        e.preventDefault();
        try{
            const respuesta = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    password: password,
                }),
            });
            const datos = await respuesta.json();
            if(datos.ok){
                setCorrecto(datos.mensaje);
                console.log(datos.mensaje);
                navigate('/login');
            }else{
                setError(datos.mensaje);
            }
        }catch(e){
            console.error(e);
        }
    };

    return(
        <>
        {error && 
        <div className="flex items-center justify-center w-[30vw] h-[8vh] text-red-500 p-3 m-3 border-2 border-red-500 rounded-md bg-red-500/20">
            {error}
        </div>}
        {correcto && 
        <div className="flex items-center justify-center w-[30vw] h-[8vh] text-green-500 p-3 m-3 border-2 border-green-500 rounded-md bg-green-500/20">
            {correcto}
        </div>} 
        <button type='button' className="btn-submit" onClick={enviarRegistro}>Enviar</button>
    </>
    );
}
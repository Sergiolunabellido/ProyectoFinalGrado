export default function InicioRegistro({ isLoginView, setIsLoginView }) {
    return (
        <div className="opciones flex justify-center items-center w-[100%] m-auto h-[5vh]">
            {/* Botón Iniciar Sesión */}
            <button 
                className="boton-login  h-[3.5vh] w-[50%] text-center m-[1.5vw]"
                onClick={() => setIsLoginView(true)}
                style={{ backgroundColor: isLoginView ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }}
            >
                Iniciar Sesión
            </button>
            
            {/* Botón Registrarse */}
            <button 
                className="boton-registro h-[3.5vh] w-[50%]  text-center m-[1.5vw]"
                onClick={() => setIsLoginView(false)}
                style={{ backgroundColor: !isLoginView ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }}
            >
                Registrarse
            </button>
    </div>
    )
}
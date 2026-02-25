
import { useState } from 'react';
import './styles-login.css';
import InicioRegistro from '../../Components/Login-Registro/InicioRegistro/inicioRegistro';
import BotonEnviarLogin from '../../Components/Login-Registro/Botones-Enviar/Enviar-Login'
import BotonEnviarRegistro from '../../Components/Login-Registro/Botones-Enviar/Enviar-Registro';
export default function Login() {
    // Estado: true = Login, false = Registro
    const [isLoginView, setIsLoginView] = useState(true);
    const [contraseña, setContraseña] = useState('');
    const [nombre, setNombre] =useState('');
    const [email, setEmail] = useState('');

    return (
        <div className="body flex justify-center items-center font-sans h-[100vh] ">
            <div className="main-div flex flex-col justify-center items-center text-center w-[55vh] bg-[#1a3a25] ">
                <header className="header-main ">
                    <h1 className="text-[22px]  font-bold">Bienvenido a GoblinVerse</h1>
                    <p className="text-[18px]  ">Tu Aventura Comienza Aquí</p>
                </header>

                <main className="contenido">
                    {/* --- Botones Log-in y Registro --- */}
                    <InicioRegistro isLoginView={isLoginView} setIsLoginView={setIsLoginView} />

                    <div className="formularios">
                        {/* --- FORMULARIO LOGIN --- */}
                        <div className={isLoginView ? "form-login" : "hidden"} id="form-login">
                            <form className="f-login">
                                <div className="correo-login">
                                    <p className="p-correo-login">Correo Electrónico</p>
                                    <input type="text" className="input-correo-login " placeholder="Usuario" 
                                    onChange={(e) =>{setNombre(e.target.value)}}/>
                                </div>
                                <div className="contrasena-login">
                                    <p className="p-contrasena-login">Contraseña</p>
                                    <input type="password" className="input-contrasena-login" placeholder="Contraseña" 
                                    onChange={(e) =>{setContraseña(e.target.value)}} />
                                </div>
                                <div className="div-olvidaste">
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#">¿Olvidaste tu contraseña?</a>
                                    <BotonEnviarLogin usuario={nombre} contraseña={contraseña}/>
                                </div>
                                <div className="div-cuenta">
                                    <p>¿No tienes una cuenta?</p>
                                    {/* Enlace para cambiar a Registro */}
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginView(false); }}>Regístrate</a>
                                </div>
                                <div className="registro-con">
                                    <hr />
                                    <p>O continúa con</p>
                                    <hr />
                                </div>
                                <div className="google-facebook">
                                    <button className="btn-google">
                                        <img src="/images/google-app-logo-in-big-sur-style-3d-render-icon-design-concept-element-isolated-transparent-background-free-png.webp" alt="Google" />
                                        <p>Google</p>
                                    </button>
                                    <button className="btn-facebook">
                                        <img src="/images/facebook-3d-facebook-logo-3d-facebook-icon-3d-facebook-symbol-free-png.webp" alt="Facebook" />
                                        <p>Facebook</p>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* --- FORMULARIO REGISTRO --- */}
                        <div className={!isLoginView ? "form-registro" : "hidden"} id="form-registro">
                            <form className="f-registro">
                                <div className="nombre-registro">
                                    <p>Nombre Completo</p>
                                    <input type="text" id="nombre-registro" placeholder="Tu Nombre" 
                                    onChange={(e) =>{setNombre(e.target.value)}}/>
                                </div>
                                <div className="correo-registro">
                                    <p >Correo Electrónico</p>
                                    <input type="email" id='correo-registro' placeholder="tu@gmail.com" 
                                    onChange={(e) =>{setEmail(e.target.value)}}/>
                                </div>
                                <div className="contrasena-registro">
                                    <p >Contraseña</p>
                                    <input type="password" id='contrasena-registro' placeholder="Contraseña" 
                                    onChange={(e) =>{setContraseña(e.target.value)}}/>
                                </div>
                            </form>
                            <div className="div-olvidaste">
                                <div className="div-cuenta-form">
                                    <p>¿Ya tienes una cuenta?</p>
                                    {/* Enlace para cambiar a Login */}
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginView(true); }}>Inicia Sesión</a>
                                </div>
                                <BotonEnviarRegistro nombre={nombre} email={email} password={contraseña}/>
                            </div>
                            <div className="registro-con-form">
                                <hr />
                                <p>O continúa con</p>
                                <hr />
                            </div>
                            <div className="google-facebook-form">
                                <button className="btn-google">
                                    <img src="/images/google-app-logo-in-big-sur-style-3d-render-icon-design-concept-element-isolated-transparent-background-free-png.webp" alt="Google" />
                                    <p>Google</p>
                                </button>
                                <button className="btn-facebook">
                                    <img src="/images/facebook-3d-facebook-logo-3d-facebook-icon-3d-facebook-symbol-free-png.webp" alt="Facebook" />
                                    <p>Facebook</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

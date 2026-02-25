
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';

export default function Header() {
    const [estaLogueado, setEstaLogueado] = useState();
    const navigate = useNavigate();

   

    const handleClick = () => {
        navigate('/login');
    };
    const handleClickPerfil = () =>{
        navigate('/perfil')
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        setEstaLogueado(!!token)
    },[])

    return (
        <div className="bg-[#102216] text-white xl:w-[100%]  p-4 flex items-center justify-between ">
                    <div className="flex   p-1 xl:w-[100%]  items-center md:justify-between   ">

                        <div className="flex items-center m-[1rem]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
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
                            <h1 className="text-3xl font-bold  m-1"><a href="/">GoblinVerse</a>
                            </h1>
                        </div>

                        <nav className="flex flex-wrap items-center m-1 flex-1 text-[1rem] md:flex hidden justify-center">
                            <ul className="flex flex-wrap space-x-4 m-1 items-center mx-auto">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <li><a href="/catalogo" className="hover:underline ">Catálogo</a></li>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <li><a href="#" className="hover:underline ">Novedades</a></li>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <li><a href="#" className="hover:underline ">Sobre nosotros</a></li>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <li><a href="#" className="hover:underline ">Contacto</a></li>
                            </ul>
                        </nav>

                        <div className=" flex items-center justify-center  ml-auto m-1">
                            <form >

                                <input type="text" name="q" placeholder="Buscar por nombre, categoria, etc..."
                                       className="px-2 py-1 rounded bg-white text-black  md:flex  hidden"/>

                            </form>
                            <button type="button" className="bg-gray-400 p-1 rounded ml-1 bg-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                                     className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                                    <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                                    <path d="M17 17h-11v-14h-2"/>
                                    <path d="M6 5l14 1l-1 7h-13"/>
                                </svg>
                            </button>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <button type="button" className="bg-gray-400 p-1 rounded ml-1 bg-opacity-50" 
                                    onClick={estaLogueado ? handleClickPerfil : handleClick}>
                                {estaLogueado ? (
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                                     className="icon icon-tabler icons-tabler-filled icon-tabler-user">
                                         <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                         <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                                         <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                                     </svg>
                                    ):(
                                        
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                                        className="icon icon-tabler icons-tabler-outline icon-tabler-user-plus">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/>
                                            <path d="M16 19h6"/>
                                            <path d="M19 16v6"/>
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4"/>
                                        </svg>
                                    )
                                }
                               
                            </button>

                        </div>
                    </div>
                </div>
    )
}
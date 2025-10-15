import { useState } from 'react'
import '@fontsource/anton'
import '@fontsource-variable/inter-tight'
import estilosHeader from './KickHeader.module.css'

export default function KickMain() {
    const [menuAbierto, setMenuAbierto] = useState(false)

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto)
    }

    return (
        <header className="bg-black py-5 px-4 sm:py-6 sm:px-6 md:py-8 sticky top-0 z-50">
            <div className="flex items-center justify-between ml-3 sm:ml-4 md:ml-6 mr-3 sm:mr-4 md:mr-6">
                {/* Título y logo */}
                <div className="flex items-center">
                    <h1 className={`${estilosHeader.titulo} text-white text-2xl sm:text-3xl md:text-4xl font-bold`}>kickRadar</h1>
                    <img src="/images/logo_radar.png" alt="KickRadar Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto ml-2 sm:ml-3" />
                </div>
                
                {/* Barra de busqueda - desktop */}
                <div id='barra_busqueda' className="hidden lg:block">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar sneaker..."
                            className={`${estilosHeader.barraBusqueda} bg-gray-900 border-2 border-green-400 text-white pl-10 pr-4 py-2 rounded-full 
                                     shadow-[0_0_10px_rgba(34,197,94,0.5)] 
                                     hover:shadow-[0_0_15px_rgba(34,197,94,0.7)]
                                     hover:border-green-300
                                     focus:shadow-[0_0_20px_rgba(34,197,94,0.8)] 
                                     focus:border-green-300 focus:outline-none 
                                     placeholder-white/70 transition-all duration-300
                                     w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]`}
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-green-400 
                                      shadow-[inset_0_0_10px_rgba(34,197,94,0.3)] pointer-events-none">
                        </div>
                    </div>
                </div>
                
                {/* Botones de autenticación - desktop */}
                <div className="hidden lg:flex items-center space-x-3">
                    <button className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 
                                     shadow-[0_0_8px_rgba(255,255,255,0.3)] 
                                     hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] 
                                     hover:scale-105 active:scale-95 
                                     transform hover:-translate-y-0.5">
                        Login
                    </button>
                    <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 
                                     shadow-[0_0_10px_rgba(34,197,94,0.4)] 
                                     hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] 
                                     hover:scale-105 active:scale-95 
                                     transform hover:-translate-y-0.5">
                        Regístrate
                    </button>
                </div>

                {/* Botón hamburguesa - móvil y tablet */}
                <button 
                    onClick={toggleMenu}
                    className="lg:hidden text-white p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /> {/* Cambia de las tres rayas a la x si esta abierto o cerrado */}
                    </svg>
                </button>
            </div>

            {/* Barra de busqueda - móvil y tablet */}
            <div className="lg:hidden mt-4 flex justify-center px-6">
                <div className="relative w-full max-w-md">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar sneaker..."
                        className={`${estilosHeader.barraBusqueda} bg-gray-900 border-2 border-green-400 text-white pl-10 pr-4 py-2 rounded-full 
                                 shadow-[0_0_10px_rgba(34,197,94,0.5)] 
                                 hover:shadow-[0_0_15px_rgba(34,197,94,0.7)]
                                 hover:border-green-300
                                 focus:shadow-[0_0_20px_rgba(34,197,94,0.8)] 
                                 focus:border-green-300 focus:outline-none 
                                 placeholder-white/70 transition-all duration-300
                                 w-full`}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 
                                  shadow-[inset_0_0_10px_rgba(34,197,94,0.3)] pointer-events-none">
                    </div>
                </div>
            </div>

            {/* Menú desplegable */}
            {menuAbierto && (
                <div className="lg:hidden mt-4 mx-3 sm:mx-4 md:mx-6 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden animate-[slideDown_0.3s_ease-out]">
                    <div className="flex flex-col space-y-2 p-4">
                        <button className="bg-white hover:bg-gray-100 text-black px-4 py-3 rounded-full text-base font-medium transition-all duration-300 
                                         shadow-[0_0_8px_rgba(255,255,255,0.3)] 
                                         hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] 
                                         hover:scale-105 active:scale-95 
                                         transform hover:-translate-y-0.5">
                            Login
                        </button>
                        <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-3 rounded-full text-base font-medium transition-all duration-300 
                                         shadow-[0_0_10px_rgba(34,197,94,0.4)] 
                                         hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] 
                                         hover:scale-105 active:scale-95 
                                         transform hover:-translate-y-0.5">
                            Regístrate
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
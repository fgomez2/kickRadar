import { useNavigate } from "react-router-dom"
import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"
import { useEffect, useRef } from "react"

export default function NotFound() {
    const navigate = useNavigate()
    const headRef = useRef(null)

    useEffect(() => {
        document.title = '404 Página no encontrada - KickRadar'
        headRef.current?.focus()
    }, [])

    const irInicio = () => {
        navigate('/')
    }

    const volverAtras = () => {
        navigate(-1)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
            <KickHeader ref={headRef} />
            
            {/* Contenido principal del 404 */}
            <div className="flex-grow flex items-center justify-center px-3 sm:px-4 md:px-4 py-6 sm:py-8 md:py-12">
                <div className="max-w-xs sm:max-w-md md:max-w-2xl w-full mx-auto text-center">
                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl 
                        shadow-[0_0_40px_rgba(34,197,94,0.2)] sm:shadow-[0_0_50px_rgba(34,197,94,0.25)] md:shadow-[0_0_60px_rgba(34,197,94,0.25)]
                        border border-green-500/20 p-6 sm:p-8 md:p-12
                        backdrop-blur-sm hover:shadow-[0_0_80px_rgba(34,197,94,0.35)] transition-all duration-300">
                        
                        {/* Brillo en las esquinas */}
                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative flex justify-center mb-6 sm:mb-7 md:mb-8">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-green-600 
                                rounded-2xl sm:rounded-3xl flex items-center justify-center 
                                shadow-[0_0_30px_rgba(34,197,94,0.4)] sm:shadow-[0_0_35px_rgba(34,197,94,0.45)] md:shadow-[0_0_40px_rgba(34,197,94,0.5)]
                                transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* 404  */}
                        <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-transparent bg-clip-text 
                            bg-gradient-to-r from-green-400 via-green-500 to-green-600 mb-3 sm:mb-3 md:mb-4 animate-pulse"> {/* animate-pulse parpadeo */}
                            404
                        </h1>

                        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-3 sm:mb-3 md:mb-4">
                            ¡Ups! Página no encontrada
                        </h2>

                        <p className="text-gray-400 text-sm sm:text-base md:text-xl mb-6 sm:mb-7 md:mb-8 max-w-[280px] sm:max-w-sm md:max-w-md mx-auto px-2 sm:px-0">
                            Parece que la zapatilla que buscas se escapó del radar. 
                            Esta página no existe o fue movida a otro lugar.
                        </p>

                        <div className="relative my-6 sm:my-7 md:my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-3 sm:px-4 bg-gray-800 text-gray-500 text-xs sm:text-sm">¿Qué quieres hacer?</span>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center relative z-10">
                            {/* Botón irInicio */}
                            <button onClick={irInicio}
                                className="group relative w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-green-400 to-green-600 
                                hover:from-green-500 hover:to-green-700 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base
                                transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] sm:shadow-[0_0_25px_rgba(34,197,94,0.35)] md:shadow-[0_0_30px_rgba(34,197,94,0.4)]
                                hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 overflow-hidden"
                            >
                                {/* Efecto de brillo animado */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                
                                <span className="relative flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Ir al inicio
                                </span>
                            </button>

                            {/* Botón volverAtras */}
                            <button onClick={volverAtras}
                                className="group w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 
                                bg-gray-800/50 hover:bg-gray-700 text-white 
                                font-semibold rounded-lg sm:rounded-xl text-sm sm:text-base
                                border-2 border-green-400/50 hover:border-green-400 
                                transition-all duration-300 
                                shadow-[0_0_10px_rgba(34,197,94,0.15)] sm:shadow-[0_0_12px_rgba(34,197,94,0.17)] md:shadow-[0_0_15px_rgba(34,197,94,0.2)]
                                hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 backdrop-blur-sm"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver atrás
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <KickFooter />
        </div>
    )
}
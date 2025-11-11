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
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full mx-auto text-center">
                    {/* Card con efecto neón */}
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl 
                        shadow-[0_0_60px_rgba(34,197,94,0.25)] border border-green-500/20 p-8 md:p-12
                        backdrop-blur-sm hover:shadow-[0_0_80px_rgba(34,197,94,0.35)] transition-all duration-300">
                        
                        {/* Efectos de brillo en las esquinas */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                        
                        {/* Icono de zapatilla rota/perdida */}
                        <div className="relative flex justify-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl 
                                flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)]
                                transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* 404  */}
                        <h1 className="text-2xl md:text-9xl font-bold text-transparent bg-clip-text 
                            bg-gradient-to-r from-green-400 via-green-500 to-green-600 mb-4 animate-pulse"> {/* animate-pulse parpadeo */}
                            404
                        </h1>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            ¡Ups! Página no encontrada
                        </h2>

                        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
                            Parece que la zapatilla que buscas se escapó del radar. 
                            Esta página no existe o fue movida a otro lugar.
                        </p>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-gray-800 text-gray-500 text-sm">¿Qué quieres hacer?</span>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                            {/* Botón irInicio */}
                            <button onClick={irInicio}
                                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 
                                hover:from-green-500 hover:to-green-700 text-white font-bold rounded-xl
                                transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.4)]hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 overflow-hidden"
                            >
                                {/* Efecto de brillo animado */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                
                                <span className="relative flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Ir al inicio
                                </span>
                            </button>

                            {/* Botón volverAtras */}
                            <button onClick={volverAtras}
                                className="group w-full sm:w-auto px-8 py-4 bg-gray-800/50 hover:bg-gray-700 text-white 
                                font-semibold rounded-xl border-2 border-green-400/50 hover:border-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]
                                hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95backdrop-blur-sm"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver atrás
                                </span>
                            </button>
                        </div>

                        {/* Mensaje 404 not found */}
                        <div className="mt-8 pt-6 border-t border-gray-700/50">
                            <p className="text-gray-500 text-sm">
                                Código de error: <span className="text-green-400 font-mono">404 - NOT_FOUND</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <KickFooter />
        </div>
    )
}
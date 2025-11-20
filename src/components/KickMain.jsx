import '@fontsource/dm-serif-display'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import estilosMain from './KickMain.module.css'
import CarruselMarcas from './KickCarruselMarcas.jsx'
import KickCaracteristicas from './KickCaracteristicas.jsx'

export default function KickMain({ onEmpiezaYaClick }) {
    const [modalLoginVisible, setModalLoginVisible] = useState(false)
    const [busquedaPendiente, setBusquedaPendiente] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const handleMostrarModal = (e) => {
            setBusquedaPendiente(e.detail.busqueda)
            setModalLoginVisible(true)
            
            // Se cierra el modal a los 4s
            // setTimeout(() => {
            //     setModalLoginVisible(false)
            // }, 4000)
        }

        window.addEventListener('mostrarModalLogin', handleMostrarModal)
        
        return () => {
            window.removeEventListener('mostrarModalLogin', handleMostrarModal)
        }
    }, [])

    const irALogin = () => {
        setModalLoginVisible(false)
        navigate(`/auth?redirect=/sneakers/search?q=${encodeURIComponent(busquedaPendiente)}`)
    }

    // const [botonPresionado, setBotonPresionado] = useState(false)

    // const abrirBarraBusqueda = () => {
        
    // }

    return (
        <main className="flex-grow bg-black text-white relative overflow-hidden">
            <div className="flex items-center justify-center min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-160px)] lg:min-h-screen lg:pt-20 xl:pt-24">
                {/* Efecto de fondo */}
                <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] pointer-events-none opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(34,197,94,0.1) 40%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                ></div>
                
                <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-6 sm:py-8 lg:py-12">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
                        
                        {/* Div izquierdo - Contenido de texto */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-7 lg:space-y-8">
                            <h1 className={`${estilosMain.eslogan} text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight`}>
                                Encuentra tus sneakers favoritas al mejor precio.
                            </h1>
                            
                            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide">
                                Explora. Compara. Acierta.
                            </p>
                            
                            <button onClick={onEmpiezaYaClick}
                                className="bg-green-400 hover:bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 
                                shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_35px_rgba(34,197,94,0.9)] hover:scale-105 active:scale-95 transform hover:-translate-y-1">
                                Empieza ya
                            </button>
                        </div>
                        
                        {/* Div derecho - imagen oculta en el movil) */}
                        <div className="hidden lg:flex justify-center items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-400/20 blur-[80px] rounded-full scale-125"></div>
                                <img src="/images/jordan1_pinegreen_4.webp" alt="Jordan 1 Pine Green"
                                    className="relative z-10 w-full max-w-2xl h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CarruselMarcas />

            <KickCaracteristicas onComenzarClick={onEmpiezaYaClick} />

            {/* Modal login requerido para buscar */}
            {modalLoginVisible && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4" 
                    onClick={() => setModalLoginVisible(false)}
                >
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)] border border-green-500/30 p-8 md:p-10 max-w-md w-full animate-[scaleIn_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            {/* Título y mensaje */}
                            <div className="text-center">
                                <h2 className="text-white text-2xl font-bold mb-3">Login Requerido</h2>
                                <p className="text-gray-300 mb-2">
                                    Para buscar y comparar sneakers necesitas iniciar sesión o estar registrado en kickRadar
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button onClick={() => setModalLoginVisible(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 
                                        border-2 border-gray-600 hover:border-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.3)] hover:shadow-[0_0_20px_rgba(107,114,128,0.5)]"
                                >
                                    Cancelar
                                </button>
                                <button onClick={irALogin}
                                    className="flex-1 bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 
                                        shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:scale-105 active:scale-95"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
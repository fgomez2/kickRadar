import { useEffect, useRef, useState } from "react"
import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"

export default function MisFavoritos() {
    const headRef = useRef(null)
    const [favoritos, setFavoritos] = useState([])

    useEffect(() => {
        document.title = 'Mis Sneakers Favoritas - KickRadar'
        headRef.current?.focus()
        // IMPORTANTEEEE (POR HACER): CARGAR FAVORITOS DEL USUARIO DESDE SUPABASE (TABLA FAVORITES)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
            <KickHeader ref={headRef} />
            
            {/* Contenido principal */}
            <div className="flex-grow px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center 
                                shadow-[0_0_40px_rgba(34,197,94,0.5)] transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600 mb-4">
                            Mis Sneakers Favoritas
                        </h1>
                        
                        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                            Aquí encontrarás todas las zapatillas que has guardado como favoritas
                        </p>
                    </div>

                    {/* Lista de favoritos */}
                    {favoritos.length === 0 ? (
                        // CUANDO NO HAYA FAVORITOS
                        <div className="max-w-2xl mx-auto">
                            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.25)] 
                                border border-green-500/20 p-12 backdrop-blur-sm hover:shadow-[0_0_80px_rgba(34,197,94,0.35)] transition-all duration-300">
                                
                                <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                                
                                <div className="relative text-center">
                                    {/* Icono */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center border-2 border-gray-700
                                            transform hover:scale-110 transition-all duration-300">
                                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                        Aún no tienes favoritos
                                    </h2>
                                    
                                    <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
                                        Explora nuestra colección y guarda tus sneakers favoritas para encontrarlas fácilmente más tarde
                                    </p>

                                    <button onClick={() => window.location.href = '/'}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-xl
                                            transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 overflow-hidden"
                                    >

                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700">
                                        </div>
                                        
                                        <span className="relative flex items-center justify-center gap-2">
                                            Explorar sneakers
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // CUANDO HAYA FAVORITOS
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favoritos.map((sneaker) => (
                                <div key={sneaker.id} className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                                        rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] border border-green-500/20 p-6
                                        backdrop-blur-sm hover:shadow-[0_0_50px_rgba(34,197,94,0.35)] hover:scale-105 transition-all duration-300 group">
                                    
                                    {/* Botón eliminar favorito */}
                                    <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500/20 hover:bg-red-500 rounded-full
                                            flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                        aria-label="Eliminar de favoritos"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Contenido de la card - TODO: personalizar con datos reales */}
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">👟</div>
                                        <h3 className="text-white font-bold text-lg mb-2">{sneaker.name}</h3>
                                        <p className="text-gray-400 text-sm">{sneaker.brand}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <KickFooter />
        </div>
    )
}
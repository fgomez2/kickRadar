import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"
import { supabase } from "../supabase-client"
import { format } from "date-fns"

export default function MisFavoritos() {
    const headRef = useRef(null)
    const navigate = useNavigate()

    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = 'Mis Sneakers Favoritas - KickRadar'
        headRef.current?.focus()

        const cargarFavoritos = async () => {
            setCargando(true)
            setError(null)

            // Obtener el usuario autenticado
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                setFavoritos([])
                setCargando(false)
                return
            }

            // Traer favoritos desde la tabla favorites
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
            
            if (error) {
                console.error('Error al cargar favoritos:', error)
                setError('No se pudieron cargar los favoritos. Intenta nuevamente más tarde.')
                setFavoritos([])
            } else {
                setFavoritos(data || [])
            }

            setCargando(false)
        }

        cargarFavoritos()
    }, [])

    const handleEliminarFavorito = async (productId) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) return

            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId)

            if (error) {
                console.error('Error al eliminar favorito:', error)
                return
            }

            setFavoritos((prev) => prev.filter((fav) => fav.product_id !== productId))
        } catch (err) {
            console.error('Error al eliminar favorito:', err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
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

                    {/* Mensajes de carga / error */}
                    {cargando && (
                        <div className="text-gray-400 text-center mb-8">
                            Cargando tus favoritos...
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-center mb-8">
                            {error}
                        </div>
                    )}

                    {/* Lista de favoritos */}
                    {!cargando && favoritos.length === 0 ? (
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

                                    <button onClick={() => navigate('/')}
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
                            {favoritos.map((fav) => (
                                <div key={`${fav.user_id}-${fav.product_id}`} onClick={() => navigate(`/sneakers/${fav.product_id}`)}
                                    className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                                        rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] border border-green-500/20 p-6
                                        backdrop-blur-sm hover:shadow-[0_0_50px_rgba(34,197,94,0.35)] hover:scale-105 transition-all duration-300 group">
                                    
                                    {/* Botón eliminar favorito */}
                                    <button onClick={(e) => {
                                            e.stopPropagation()
                                            handleEliminarFavorito(fav.product_id)
                                        }}
                                        className="absolute top-4 right-4 z-10 group/button flex items-center justify-center w-14 h-14
                                        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                                        rounded-full border border-gray-700 hover:border-red-400 transition-all duration-300 hover:scale-110 active:scale-95"
                                        aria-label="Eliminar de favoritos"
                                    >
                                        <svg className="w-6 h-6 text-red-400 fill-red-500 group-hover/button:fill-transparent group-hover/button:text-gray-400 transition-all duration-300" 
                                            fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>

                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 
                                            group-hover/button:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                                Quitar de favoritos
                                            </span>
                                    </button>

                                    {/* Contenido de la card */}
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className="relative w-full h-52 bg-gray-900/60 rounded-xl overflow-hidden flex items-center justify-center">
                                            {fav.image_url && (
                                                <img src={fav.image_url} alt={fav.title}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        // Por si la imagen falla
                                                        e.currentTarget.style.display = "none"
                                                        const fallback = e.currentTarget.parentElement?.querySelector(
                                                            "[data-fallback]"
                                                        )
                                                        if (fallback) fallback.classList.remove("hidden")
                                                    }}
                                                />
                                            )}

                                            {/* Icono cuando no hay foto o URL falla */}
                                            <div data-fallback 
                                                className={`flex flex-col items-center justify-center text-gray-500 ${fav.image_url ? "hidden" : ""}`}
                                            >
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 10l2.5 3 2-2.5L18 16H6l3-6z" />
                                                    <circle cx="9" cy="7" r="1.2" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Texto */}
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-green-400 mb-1">
                                                {fav.brand || 'Marca desconocida'}
                                            </p>
                                            <h3 className="text-white font-bold text-sm line-clamp-2">
                                                {fav.title || 'Título desconocido'}
                                            </h3>
                                            {fav.price_text && (
                                                <p className="text-green-400 font-semibold mt-2">
                                                    {fav.price_text}
                                                </p>
                                            )}
                                            {fav.created_at && (
                                                <p className="text-sm text-gray-400 font-semibold mt-2">
                                                    Añadida el{" "}  
                                                    <span className="text-green-400">
                                                        {format(new Date(fav.created_at), "dd-MM-yyyy 'a las' HH:mm")}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
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
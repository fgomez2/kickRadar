import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"
import useStockxProduct from "../hooks/useStockxProduct"
import useStockxPrices from "../hooks/useStockxPrices"
import TablaPrecios from "../components/TablaPrecios"
import { supabase } from "../supabase-client"

export default function DetalleSneaker() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { sneaker, cargando, error, cargaCompleta } = useStockxProduct(id)

    // HOOK DE PRECIOS de Stockx
    const { precios, loading: cargandoPrecios } = useStockxPrices(sneaker?.urlKey)

    const [imagenCargada, setImagenCargada] = useState(false)
    const [errorImagen, setErrorImagen] = useState(false)

    // Estados para favoritos
    const [esFavorito, setEsFavorito] = useState(false)
    const [cargandoFavorito, setCargandoFavorito] = useState(false)

    useEffect(() => {
        const comprobarFavorito = async () => {
            if (!id) return

            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                setEsFavorito(false)
                return
            }

            const { data, error } = await supabase
                .from('favorites')
                .select('product_id')
                .eq('user_id', user.id)
                .eq('product_id', id)
                .maybeSingle()
            
            if (!error && data) {
                setEsFavorito(true)
            } else {
                setEsFavorito(false)
            }
        }

        comprobarFavorito()
    }, [id])

    // Manejar añadir o quitar de favoritos
    const handleToggleFavorito = async () => {
        if (cargandoFavorito || !sneaker) return 
        setCargandoFavorito(true)

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                console.warn("Usuario no autenticado")
                setCargandoFavorito(false)
                return
            }

            if (!esFavorito) {
                const { error } = await supabase
                    .from('favorites')
                    .insert({
                        user_id: user.id,
                        product_id: sneaker.id ?? id,
                        title: sneaker.titulo,
                        brand: sneaker.marca,
                        price_text: sneaker.precioRetail != null ? `${sneaker.precioRetail} €` : null,
                        image_url: sneaker.imagenUrl,
                    })

                if (error) {
                    console.error("Error al añadir a favoritos:", error)
                } else {
                    setEsFavorito(true)
                }
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', id)

                if (error) {
                    console.error("Error al eliminar de favoritos:", error)
                } else {
                    setEsFavorito(false)
                }
            }
        } finally {
            setCargandoFavorito(false)
        }
    }

    if (cargando || !cargaCompleta) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
                <KickHeader />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-green-400 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <p className="text-gray-300 mt-6 text-lg font-medium animate-pulse">
                            Cargando detalles...
                        </p>
                    </div>
                </main>
                <KickFooter />
            </div>
        )
    }

    if (!sneaker && !cargando && cargaCompleta) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
                <KickHeader />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Sneaker no encontrada</h1>
                        <button onClick={() => navigate(-1)}
                            className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-all"
                        >
                            Volver atrás
                        </button>
                    </div>
                </main>
                <KickFooter />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
            <KickHeader />
            
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a resultados
                </button>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Imagen */}
                    <div className="self-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-2 flex items-center justify-center">
                        {sneaker.imagenUrl && !errorImagen ? (
                            <>
                                {!imagenCargada && (
                                    <div className="w-16 h-16 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin"></div>
                                )}
                                <img src={sneaker.imagenUrl} alt={sneaker.titulo}
                                    className={`max-h-[380px] w-auto object-contain transition-opacity duration-500 ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setImagenCargada(true)} onError={() => setErrorImagen(true)}
                                />
                            </>
                        ) : (
                            <svg className="w-32 h-32 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-green-400 font-semibold uppercase tracking-wider mb-2">
                                {sneaker.marca}
                            </p>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                {sneaker.titulo}
                            </h1>
                        </div>

                        {/* Precio */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-6">
                            <p className="text-gray-400 text-sm mb-2">Precio Retail</p>
                            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                                {sneaker.precioRetail} €
                            </p>
                        </div>

                        {/* Detalles */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">Detalles</h2>
                            <div className="space-y-3">
                                {sneaker.colores && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                        <span className="text-gray-400">Combinación de colores</span>
                                        <span className="text-white font-medium">{sneaker.colores}</span>
                                    </div>
                                )}
                                {sneaker.genero && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                        <span className="text-gray-400">Género</span>
                                        <span className="text-white font-medium">{sneaker.genero}</span>
                                    </div>
                                )}
                                {sneaker.fechaDeSalida && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                        <span className="text-gray-400">Fecha de salida</span>
                                        <span className="text-white font-medium">
                                            {new Date(sneaker.fechaDeSalida).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-4">
                            <button onClick={handleToggleFavorito} disabled={cargandoFavorito}
                                className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:from-red-500/20 hover:via-red-500/10 hover:to-red-500/20 rounded-full border border-gray-700 hover:border-red-400 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                title={esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                <svg className={`w-6 h-6 transition-colors duration-300 ${esFavorito ? "text-red-400 fill-red-500" : "text-gray-400 group-hover:text-red-400"}`} 
                                    fill={esFavorito ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            <button className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:from-green-500/20 hover:via-green-500/10 hover:to-green-500/20 rounded-full border border-gray-700 hover:border-green-400 transition-all duration-300 hover:scale-110 active:scale-95"
                                title="Crear alerta de precio"
                            >
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-6xl mx-auto">
                    <TablaPrecios precios={precios} cargando={cargandoPrecios} />
                </div>

            </main>

            <KickFooter />
        </div>
    )
}
import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"
import { useParams } from "react-router-dom"
import useStockxSearch from "../hooks/useStockxSearch"
import TarjetaSneaker from "../components/TarjetaSneaker"

export default function BusquedaSneakers() {

    const { busqueda } = useParams()
    const termino = decodeURIComponent(busqueda || '')
    const { sneakers, cargando, error } = useStockxSearch(termino)

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
            <KickHeader />
            
            <main className="flex-grow container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
                {/* Título de búsqueda */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                        Resultados para: 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 ml-2">
                            "{termino}"
                        </span>
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>

                {/* Loading state */}
                {cargando && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-green-400 rounded-full animate-spin border-t-transparent absolute top-0 left-0 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        <p className="text-gray-300 mt-6 text-lg font-medium animate-pulse">
                            Buscando sneakers...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-gradient-to-br from-red-900/30 via-red-800/20 to-red-900/30 border-2 border-red-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-red-200 font-semibold mb-1">Error en la búsqueda</h3>
                                <p className="text-red-300/80">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sin resultados */}
                {!cargando && !error && sneakers.length === 0 && (
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-8 sm:p-12 text-center shadow-[0_0_40px_rgba(75,85,99,0.2)]">
                        <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-6 shadow-[0_0_20px_rgba(75,85,99,0.3)]">
                            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No se encontraron resultados</h2>
                        <p className="text-gray-400 mb-2">No encontramos sneakers que coincidan con tu búsqueda.</p>
                        <p className="text-gray-500 text-sm">Intenta con otro nombre, marca o modelo.</p>
                    </div>
                )}

                {/* Resultados */}
                {!cargando && !error && sneakers.length > 0 && (
                    <>
                        <p className="text-gray-400 mb-6">
                            Se encontraron <span className="text-green-400 font-semibold">{sneakers.length}</span> resultados
                        </p>
                        
                        <section className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                            {sneakers.map((sneaker) => (
                                <TarjetaSneaker key={sneaker.id} sneaker={sneaker} />
                            ))}
                        </section>
                    </>
                )}
            </main>

            <KickFooter />
        </div>
    )
}
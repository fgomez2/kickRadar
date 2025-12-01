import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"
import { useParams } from "react-router-dom"
import useStockxSearch from "../hooks/useStockxSearch"

export default function BusquedaSneakers() {

    const { busqueda } = useParams()
    const termino = decodeURIComponent(busqueda || '')
    const { sneakers, cargando, error } = useStockxSearch(termino)

    return (
        <>
            <KickHeader />
            <main className="min-h-screen bg-black text-white pt-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Resultados para: <span className="text-green-400">"{termino}"</span></h1>

                {cargando && (
                    <p className="text-gray-300 animate-pulse text-center py-10">
                        Cargando resultados...
                    </p>
                )}

                {error && (
                    <div className="bg-red-600 text-white p-4 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* SIN RESULTADOS */}
                {!cargando && !error && sneakers.length === 0 && (
                    <div className="text-center bg-gray-900/40 border border-gray-700 px-4 py-6 rounded-xl">
                        <p className="text-gray-300">No se encontraron sneakers para esta búsqueda.</p>
                        <p className="text-gray-500 text-sm mt-1">Prueba con otro nombre o modelo.</p>
                    </div>
                )}

                {/* RESULTADOS */}
                {!cargando && !error && sneakers.length > 0 && (
                    <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {sneakers.map((sneaker) =>
                            <article key={sneaker.id} className="bg-gray-900 rounded-xl border border-gray-800 hover:border-green-400/70 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all overflow-hidden">
                                {/* IMAGEN DE MOMENTO NADA */}

                                {/* INFO */}
                                <div className="">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                                        {sneaker.marca}
                                    </p>

                                    <h2 className="text-sm font-semibold leading-tight line-clamp-2">
                                        {sneaker.titulo}
                                    </h2>

                                    {sneaker.precioRetail ? (
                                        <p className="text-lg font-bold text-green-400 mt-2">
                                            {sneaker.precioRetail} €
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm mt-2">
                                            Precio no disponible
                                        </p>
                                    )}
                                </div>
                            </article>
                        )}
                    </section>
                )}
            </main>

            <KickFooter />
        </>
    )
}
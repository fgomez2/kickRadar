import { useState } from "react"

export default function TarjetaSneaker({ sneaker }) {
    const [imagenCargada, setImagenCargada] = useState(false)
    const [errorImagen, setErrorImagen] = useState(false)

    return (
        <article 
            className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl sm:rounded-2xl border border-gray-700/50 
            hover:border-green-400/70 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 overflow-hidden 
            hover:scale-[1.02] active:scale-[0.98] cursor-pointer backdrop-blur-sm"
        >

            {/* CONTENEDOR DE IMAGEN: MISMA ALTURA SIEMPRE */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {sneaker.imagenUrl && !errorImagen ? (
                    <>
                        {!imagenCargada && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin" />
                            </div>
                        )}

                        <img src={sneaker.imagenUrl} alt={sneaker.titulo}
                            className={`w-full h-full object-contain block transition-all duration-500 group-hover:scale-105 ${
                                imagenCargada ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() => setImagenCargada(true)} onError={() => setErrorImagen(true)} loading="lazy"
                        />
                    </>
                ) : (
                    // MISMA ALTURA, ICONO CENTRADO
                    <svg className="w-20 h-20 text-gray-700 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                )}
            </div>

            {/* INFO */}
            <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 group-hover:text-green-400/80 transition-colors">
                    {sneaker.marca}
                </p>

                <h2 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2 mb-3 group-hover:text-green-50 transition-colors">
                    {sneaker.titulo}
                </h2>

                {sneaker.precioRetail ? (
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                            {sneaker.precioRetail} €
                        </p>
                        <span className="text-xs text-gray-500 uppercase">Retail</span>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm font-medium">
                        Precio no disponible
                    </p>
                )}

                {/* Badge hover */}
                <div className="mt-3 pt-3 border-t border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                        Ver detalles
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>

        </article>
    )
}
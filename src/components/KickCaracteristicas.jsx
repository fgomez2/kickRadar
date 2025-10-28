import estilosCaracteristicas from './KickCaracteristicas.module.css' // Para reutilizar la fuente del main

export default function KickCaracteristicas({ onComenzarClick }) {
    const caracteristicas = [
        {
            id: 1,
            titulo: "Comparador de Precios",
            descripcion: "Encuentra el mejor precio entre múltiples tiendas en tiempo real. Ahorra dinero en cada compra.",
            icono: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 2,
            titulo: "Búsqueda Avanzada",
            descripcion: "Filtra por marca, modelo, talla y precio. Encuentra exactamente lo que buscas en segundos.",
            icono: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            id: 3,
            titulo: "Base de Datos Actualizada",
            descripcion: "Accede a miles de sneakers de las marcas más populares. Información actualizada diariamente.",
            icono: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
            )
        },
        {
            id: 4,
            titulo: "Alertas de Precio",
            descripcion: "Recibe notificaciones cuando tus sneakers favoritas bajen de precio. No te pierdas ninguna oferta.",
            icono: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            )
        },
        {
            // Dejo este comentario para pensarme si dejo esta caracteristica o no
            id: 5,
            titulo: "Historial de Precios",
            descripcion: "Consulta la evolución del precio a lo largo del tiempo. Compra en el momento ideal.",
            icono: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            id: 6,
            titulo: "Guardados y Favoritos",
            descripcion: "Crea listas personalizadas con tus sneakers preferidas. Accede a ellas cuando quieras.",
            icono: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        }
    ]

    return (
        <section className="bg-black text-white mt-32 sm:mt-44 lg:mt-25 py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <h2 className={`${estilosCaracteristicas.fuenteDmSerif} text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6`}>
                        ¿Qué puedes hacer con <span className="text-green-400">kickRadar</span>?
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
                       style={{ fontFamily: "'Inter Tight Variable', sans-serif" }}>
                        Todo lo que necesitas para encontrar tus sneakers preferidas al mejor precio
                    </p>
                </div>

                {/* Grid con las 6 caracteristicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {caracteristicas.map((caracteristica) => (
                        <div 
                            key={caracteristica.id}
                            className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 
                                     hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]
                                     transition-all duration-500 group hover:scale-105 hover:-translate-y-2"
                        >
                            {/* Icono */}
                            <div className="text-green-400 mb-5 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                {caracteristica.icono}
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors duration-300">
                                {caracteristica.titulo}
                            </h3>
                            
                            {/* Descripción */}
                            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                                {caracteristica.descripcion}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Botón, de momento lo dejo */}
                <div className="text-center mt-12 sm:mt-16 lg:mt-20">
                    <button onClick={onComenzarClick}
                        className="bg-green-400 hover:bg-green-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 
                                    shadow-[0_0_20px_rgba(34,197,94,0.5)] 
                                    hover:shadow-[0_0_35px_rgba(34,197,94,0.9)] 
                                    hover:scale-105 active:scale-95 
                                    transform hover:-translate-y-1"
                    >
                        Comienza a explorar
                    </button>
                </div>
            </div>
        </section>
    )
}
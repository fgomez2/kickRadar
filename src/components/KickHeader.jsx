import '@fontsource/anton'

const KickHeader = () => {
    return (
        <header className="bg-black py-5 px-4 sm:py-6 sm:px-6 md:py-8">
            <div className="flex items-center justify-between ml-3 sm:ml-4 md:ml-6 mr-3 sm:mr-4 md:mr-6">
                {/* Logo y título */}
                <div className="flex items-center">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">kickRadar</h1>
                    <img src="/images/logo_radar.png" alt="KickRadar Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto ml-2 sm:ml-3" />
                </div>
                
                {/* Barra de búsqueda solo visible en pc y tablet */}
                <div className="hidden sm:block">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar sneaker..."
                            className="bg-black border-2 border-cyan-400 text-white pl-10 pr-4 py-2 rounded-full 
                                     shadow-[0_0_10px_rgba(34,211,238,0.5)] 
                                     focus:shadow-[0_0_20px_rgba(34,211,238,0.8)] 
                                     focus:border-cyan-300 focus:outline-none 
                                     placeholder-white/70 transition-all duration-300
                                     w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]"
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 
                                      shadow-[inset_0_0_10px_rgba(34,211,238,0.3)] pointer-events-none">
                        </div>
                    </div>
                </div>
                
                {/* Espacio para mantener el balance del layout */}
                <div className="hidden sm:block w-20 md:w-24 lg:w-28 xl:w-32"></div>
            </div>
        </header>
    )
}

export default KickHeader
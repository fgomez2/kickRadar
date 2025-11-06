import '@fontsource/dm-serif-display'
import estilosMain from './KickMain.module.css'
import CarruselMarcas from './KickCarruselMarcas.jsx'
import KickCaracteristicas from './KickCaracteristicas.jsx'

export default function KickMain({ onEmpiezaYaClick }) {

    // const [botonPresionado, setBotonPresionado] = useState(false)

    // const abrirBarraBusqueda = () => {
        
    // }

    return (
        <main className="flex-grow bg-black text-white relative overflow-hidden">
            <div className="flex items-center justify-center min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-160px)] lg:min-h-screen lg:pt-32">
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
                                             shadow-[0_0_20px_rgba(34,197,94,0.5)] 
                                             hover:shadow-[0_0_35px_rgba(34,197,94,0.9)] 
                                             hover:scale-105 active:scale-95 
                                             transform hover:-translate-y-1">
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
        </main>
    )
}
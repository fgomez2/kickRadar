import '@fontsource/anton'
import estilosFooter from './KickFooter.module.css'
import { redireccionStockxLogin } from '../utils/stockxAuth.js'

export default function KickFooter() {
    return (
        <footer className={`${estilosFooter} bg-black text-white text-center p-6 relative`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-gray-900/20 to-transparent pointer-events-none"></div>
            <div className="p-4 relative z-10">
                <p className="text-sm">&copy; 2024 KickRadar. Todos los derechos reservados.</p>
                <button 
                    onClick={redireccionStockxLogin}
                    className="mt-4 bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 
                        shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] hover:scale-105 active:scale-95"
                >
                    Iniciar sesión con StockX
                </button>
            </div>
        </footer>
    )
}
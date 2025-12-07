import '@fontsource/anton'
import estilosFooter from './KickFooter.module.css'

export default function KickFooter() {
    return (
        <footer className={`${estilosFooter} bg-black text-white text-center p-6 relative`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-gray-900/20 to-transparent pointer-events-none"></div>
            <div className="p-4 relative z-10">
                <p className="text-sm">&copy; 2025 KickRadar. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}
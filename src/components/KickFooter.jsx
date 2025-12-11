import '@fontsource/anton'
import estilosFooter from './KickFooter.module.css'

export default function KickFooter() {
    return (
        <footer className={`${estilosFooter.footer} bg-black text-white p-8 relative`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-gray-900/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-5xl mx-auto space-y-8 text-center">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Sobre nosotros</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            {/* QUEDAN LOS ENLACES */}
                            <li><a href="#" className="hover:text-white transition-colors">Quiénes somos</a></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Legal</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Redes Sociales</p>
                        <div className="flex items-center justify-center gap-4">
                            {/* QUEDAN LOS ENLACES */}
                            {/* icono github */}
                            <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-emerald-400 hover:text-emerald-300 transition-colors" aria-label="GitHub">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.23-.01-.85-.01-1.67-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .26.18.58.69.48A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                                </svg>
                            </a>
                            {/* icono linkedin */}
                            <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-emerald-400 hover:text-emerald-300 transition-colors" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
                                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H6V10h2.34ZM7.17 8.88a1.36 1.36 0 1 1 0-2.73 1.36 1.36 0 0 1 0 2.73ZM18 18h-2.33v-3.86c0-.92-.02-2.11-1.28-2.11-1.3 0-1.5 1.01-1.5 2.05V18H10.6V10h2.23v1.09h.03a2.44 2.44 0 0 1 2.2-1.21c2.35 0 2.78 1.55 2.78 3.55Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center text-xs text-gray-400">
                    <p>&copy; 2025 KickRadar. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

import { Link } from 'react-router-dom'
import estilosHeader from './KickHeader.module.css'

export default function KickHeaderAuth() {
    return (
        <header className={`${estilosHeader.header} bg-black/95 backdrop-blur-sm py-4 sm:py-5 md:py-6`}>
            <div className="container mx-auto px-4">
                {/* Logo centrado */}
                <Link to="/" className="flex items-center justify-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
                    <span className={`${estilosHeader.titulo} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white`}>
                        kick<span className="text-green-400">Radar</span>
                    </span>
                    <img src="/images/logo_radar.png" alt="KickRadar Logo" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto ml-1 sm:ml-2" />
                </Link>
            </div>
        </header>
    )
}

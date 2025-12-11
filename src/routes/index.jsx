import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import AuthPage from '../pages/AuthPage'
import NotFound from '../pages/NotFound'
import MiPerfil from '../pages/MiPerfil'
import MisFavoritos from '../pages/MisFavoritos'
import Callback from '../pages/Callback'
import BusquedaSneakers from '../pages/BusquedaSneakers'
import DetalleSneaker from '../pages/DetalleSneaker'
import QuienesSomos from '../pages/QuienesSomos'


export default function AppRoutes() {
    return (
        <Routes>
            {/* Ruta --> página de inicio */}
            <Route path="/" element={<Home />} />

            {/* Ruta de autenticación (login y registro) */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Rutas protegidas */}
            {/* Ruta de perfil */}
            <Route path="/miPerfil" element={<MiPerfil />} />
            {/* Ruta de favoritos */}
            <Route path="/misFavoritos" element={<MisFavoritos />} />

            {/* Ruta cuando se busca una sneaker */}
            <Route path="/sneakers/search/:busqueda" element={<BusquedaSneakers />} />
            {/* Ruta de una sneaker en concreto */}
            <Route path="/sneakers/:id" element={<DetalleSneaker />} />

            {/* Rutas públicas */}
            {/* Ruta callback OAuth */}
            <Route path="/callback" element={<Callback />} />

            {/* Rutas del footer */}
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            
            {/* /* <Route path="/sobrenosotros" element={<SobreNosotros />} /> */}

            {/* Ruta error 404 not found */}
            <Route path="*" element={<NotFound />} /> {/* SIEMPRE AL FINAL */}
        </Routes>
    )
}
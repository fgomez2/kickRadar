import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import AuthPage from '../pages/AuthPage'
import NotFound from '../pages/NotFound'
import MiPerfil from '../pages/MiPerfil'

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

            {/* Rutas públicas */}
            {/* <Route path="/sobrenosotros" element={<SobreNosotros />} />

            {/* Ruta error 404 not found */}
            <Route path="*" element={<NotFound />} /> {/* SIEMPRE AL FINAL */}
        </Routes>
    )
}
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import AuthPage from '../pages/AuthPage'

export default function AppRoutes() {
    return (
        <Routes>
            {/* Ruta --> página de inicio */}
            <Route path="/" element={<Home />} />

            {/* Ruta de autenticación (login y registro) */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Rutas públicas */}
            {/* <Route path="/sobrenosotros" element={<SobreNosotros />} />

            {/* Rutas protegidas --> de usuario (por ahora públicas) */}
            {/* <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/favoritos" element={<Favoritos />} /> */}

            {/* Ruta error 404 not found */}
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    )
}
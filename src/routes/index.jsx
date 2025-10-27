import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Registro from '../pages/Registro'

export default function AppRoutes() {
    return (
        <Routes>
            {/* Ruta --> página de inicio */}
            <Route path="/" element={<Home />} />

            {/* Rutas públicas */}
            {/* <Route path="/sobrenosotros" element={<SobreNosotros />} />

            {/* Rutas protegidasº */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rutas protegidas --> de usuario (por ahora públicas) */}
            {/* <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/favoritos" element={<Favoritos />} /> */}

            {/* Ruta error 404 not found */}
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    )
}
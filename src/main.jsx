import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './modules/auth/AuthProvider'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se ha encontrado el elemento root')

const mantenimientoActivo = import.meta.env.VITE_MAINTENANCE === "true"

if (mantenimientoActivo) {
  // MODO MANTENIMIENTO 👷‍♂️👷‍♂️👷‍♂️
  // cambiar la variable de entorno en VERCEL cuando se quiera el MODO NORMAL
  createRoot(rootElement).render(
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-3xl font-bold">
          KickRadar en mantenimiento 👷‍♂️
        </h1>
        <p className="text-gray-300">
          Ahora mismo se están realizando cambios en el proyecto.
        </p>
        <p className="text-gray-400 text-sm">
          Vuelve a intentarlo más tarde, por favor.
        </p>
      </div>
    </div>
  )
} else {
  createRoot(rootElement).render(
    // MODO NORMAL
    // cambiar la variable de entorno en VERCEL cuando se quiera el MODO MANTENIMIENTO
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './modules/auth/AuthProvider'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se ha encontrado el elemento root')

const mantenimientoActivo = import.meta.env.VITE_MAINTENANCE === "true"

if (mantenimientoActivo) {
  // MODO MANTENIMIENTO
  // cambiar la variable de entorno en VERCEL cuando se quiera el MODO NORMAL
  createRoot(rootElement).render(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-emerald-900 text-white px-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-center gap-3 text-emerald-300 uppercase tracking-[0.3em] text-xs">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-400/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 9v4m0 3.5h.01M10.29 3.86 2.82 16a1.5 1.5 0 0 0 1.28 2.25h15.8A1.5 1.5 0 0 0 21.18 16l-7.47-12.14a1.5 1.5 0 0 0-2.52 0Z" />
            </svg>
          </span>
          <span>mantenimiento activo</span>
        </div>
        <h1 className="mt-5 text-center text-3xl font-semibold">
          Estamos preparando una versión mejorada
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-bounce" />
            <span>Aplicando ajustes</span>
          </div>
        </div>
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

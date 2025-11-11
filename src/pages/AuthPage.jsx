import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useAuth } from '../modules/auth/AuthProvider'
import KickHeaderAuth from '../components/KickHeaderAuth'

export default function AuthPage() {
    const { session } = useAuth()
    const navigate = useNavigate()

    const [modo, setModo] = useState('login') // 'login' o 'registro'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nombreCompleto, setNombreCompleto] = useState('')
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState('info') // 'info' o 'error'
    const [animando, setAnimando] = useState(false) // efecto animación al cambiar modo

    // Si ya hay sesión, se redirije a la pag principal
    useEffect(() => {
        if (session) {
            navigate('/')
        }
    }, [session, navigate])

    // Errores coumunes de Supabase
    const getErrorMessage = (error) => {
        const erroresComunes = {
            'Invalid login credentials': 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
            'User already registered': 'El usuario ya está registrado. Por favor, inicia sesión.',
            'Email not confirmed': 'El email no ha sido confirmado. Por favor, revisa tu bandeja de entrada.',
            'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.'
        }

        return erroresComunes[error.message] || error.message
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMensaje(null)

        try {
            // Validaciones para registro
            if (modo === 'registro') {
                if (!nombreCompleto.trim()) {
                    setTipoMensaje('error')
                    setMensaje('El nombre completo es obligatorio.')
                    setLoading(false)
                    return
                }
                
                if (!nombreCompleto.includes(' ')) {
                    setTipoMensaje('error')
                    setMensaje('Por favor, ingresa tu nombre y apellido.')
                    setLoading(false)
                    return
                }
                
                if (/\d/.test(nombreCompleto)) {
                    setTipoMensaje('error')
                    setMensaje('El nombre no puede contener números.')
                    setLoading(false)
                    return
                }
            }
            
            if (modo === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password })

                if (error) throw error

                setTipoMensaje('exito')
                setMensaje('¡Bienvenido de nuevo!')
                // useEffect redirige automáticamente al detectar la sesion
            } else {
                // Registro - Enviar nombre completo en metadata para que el trigger lo use
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password, 
                    options: { 
                        emailRedirectTo: window.location.origin,
                        data: {
                            full_name: nombreCompleto // El trigger extraerá esto
                        }
                    } 
                })

                if (error) throw error

                if (!data.session) {
                    setTipoMensaje('info')
                    setMensaje('Registro exitoso. Por favor, revisa tu email para confirmar tu cuenta.')
                } else {
                    setTipoMensaje('exito')
                    setMensaje('¡Registro exitoso! Bienvenido.')
                }
            }
        } catch (err) {
            console.error('Error completo:', err) // Ver error completo en consola
            console.error('Mensaje:', err.message) // Ver solo el mensaje
            console.error('Código:', err.code) // Ver código de error si existe
            setTipoMensaje('error')
            setMensaje(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const toggleModo = () => {
        setAnimando(true)
        
        // Esperar a que termine la animación de salida antes de cambiar el modo
        setTimeout(() => {
            setModo(modo === 'login' ? 'registro' : 'login')
            setMensaje(null)
            setTipoMensaje('info')
            setNombreCompleto('') // Limpiar nombre al cambiar modo
            
            // Resetear animación para la entrada
            setTimeout(() => {
                setAnimando(false)
            }, 50)
        }, 300) // Duración de la animación de salida
    }

    // Si ya hay sesión NO RENDERIZAR NADA
    if (session) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
            <KickHeaderAuth /> {/* Header específico para esta página */}
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md mx-auto">
                {/* Card principal form */}
                <div className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.25)] border border-green-500/20 p-8
                backdrop-blur-sm hover:shadow-[0_0_80px_rgba(34,197,94,0.35)] transition-all duration-300 
                ${animando ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} transition-all duration-300`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                    
                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl
                        flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] transform hover:scale-110 transition-all duration-300 
                        ${animando ? 'scale-90 rotate-180' : 'scale-100 rotate-0'}`}>
                            {modo === 'login' ? (
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            )}
                        </div>
                    </div>
                    
                    {/* Título */}
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 text-center mb-2">
                        {modo === 'login' ? '¡Bienvenido de nuevo!' : 'Únete a kickRadar'}
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta en segundos'}
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        {/* Campo Email */}
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors duration-200">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                </div>
                            </label>
                            <input
                                id="email"type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                                autoComplete="email" disabled={loading}
                                className="w-full px-4 py-3.5 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white 
                                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 
                                focus:border-green-400 transition-all duration-300 disabled:opacity-50 
                                disabled:cursor-not-allowed hover:border-gray-600 backdrop-blur-sm"
                            />
                        </div>

                        {/* Campo nombre completo (solo si es registro) */}
                        {modo === 'registro' && (
                            <div className="group animate-[fadeIn_0.3s_ease-in-out]">
                                <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors duration-200">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Nombre completo
                                    </div>
                                </label>
                                <input id="nombreCompleto" type="text" required minLength={3} 
                                    value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}
                                    placeholder="James Harden" autoComplete="name" disabled={loading}
                                    className="w-full px-4 py-3.5 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white 
                                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 
                                    focus:border-green-400 transition-all duration-300 disabled:opacity-50 
                                    disabled:cursor-not-allowed hover:border-gray-600 backdrop-blur-sm"
                                />
                            </div>
                        )}

                        {/* Campo Contraseña */}
                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors duration-200">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Contraseña
                                </div>
                            </label>
                            <div className="relative">
                                <input id="password" type={mostrarPassword ? 'text' : 'password'} required
                                    minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" autoComplete={modo === 'login' ? 'current-password' : 'new-password'} disabled={loading}
                                    className="w-full px-4 py-3.5 pr-12 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white 
                                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 
                                    focus:border-green-400 transition-all duration-300 disabled:opacity-50 
                                    disabled:cursor-not-allowed hover:border-gray-600 backdrop-blur-sm"
                                />
                                <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 
                                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    p-1 rounded-lg hover:bg-gray-700/50"
                                >
                                    {mostrarPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <button type="submit" disabled={loading}
                            className="relative w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl overflow-hidden
                            transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.4)] 
                            hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-[1.02] active:scale-[0.98]
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                        >
                            {/* Efecto de brillo animado */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Mensaje de feedback */}
                    {mensaje && (
                        <div 
                            className={`mt-6 p-4 rounded-xl text-sm font-medium backdrop-blur-sm border-2 animate-[slideDown_0.3s_ease-out] ${
                                tipoMensaje === 'error'
                                    ? 'bg-red-900/30 border-red-500/50 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]' // si es true --> rojo
                                    : tipoMensaje === 'exito'
                                    ? 'bg-green-900/30 border-green-500/50 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.3)]' // si es exito --> verde
                                    : 'bg-blue-900/30 border-blue-500/50 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.3)]' // info --> azul
                            }`}
                            role="alert"
                        >
                            <div className="flex items-start gap-3">
                                {tipoMensaje === 'error' ? (
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : tipoMensaje === 'exito' ? (
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span>{mensaje}</span>
                            </div>
                        </div>
                    )}

                    {/* Divisor */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900 text-gray-400">o</span>
                        </div>
                    </div>

                    {/* Botón cambiar modo */}
                    <button onClick={toggleModo} disabled={loading}
                        className="w-full text-gray-300 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                                hover:bg-gray-800/50 border-2 border-transparent hover:border-gray-700 group"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {modo === 'login' 
                                ? '¿No tienes cuenta? Regístrate' 
                                : '¿Ya tienes cuenta? Inicia sesión'}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}
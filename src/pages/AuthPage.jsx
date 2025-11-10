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
    const [nombreCompleto, setNombreCompleto] = useState('') // FALTABA DECLARAR ESTE ESTADO
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState('info') // 'info' o 'error'

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
        setModo(modo === 'login' ? 'registro' : 'login')
        setMensaje(null)
        setTipoMensaje('info')
        setNombreCompleto('') // Limpiar nombre al cambiar modo
    }

    // Si ya hay sesión NO RENDERIZAR NADA
    if (session) return null

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <KickHeaderAuth />
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md mx-auto">
                <div className="bg-gray-900 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] border border-gray-800 p-8">
                    {/* Título */}
                    <h1 className="text-3xl font-bold text-white text-center mb-8">
                        {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                    </h1>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                autoComplete="email"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white 
                                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 
                                         focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Campo nombre completo (solo si es registro) */}
                        {modo === 'registro' && (
                            <div>
                                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    id="nombreCompleto"
                                    type="text"
                                    required
                                    minLength={3}
                                    value={nombreCompleto}
                                    onChange={(e) => setNombreCompleto(e.target.value)}
                                    placeholder="Tu nombre completo"
                                    autoComplete="name"
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white 
                                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 
                                             focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        )}

                        {/* Campo Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={mostrarPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white 
                                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 
                                             focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 
                                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg 
                                     transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] 
                                     hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.98]
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? 'Procesando…' : (modo === 'login' ? 'Entrar' : 'Registrarme')}
                        </button>
                    </form>

                    {/* Mensaje de feedback */}
                    {mensaje && (
                        <div 
                            className={`mt-6 p-4 rounded-lg text-sm font-medium ${
                                tipoMensaje === 'error' 
                                    ? 'bg-red-900/50 border border-red-700 text-red-200' 
                                    : tipoMensaje === 'exito'
                                    ? 'bg-green-900/50 border border-green-700 text-green-200'
                                    : 'bg-blue-900/50 border border-blue-700 text-blue-200'
                            }`}
                            role="alert"
                        >
                            {mensaje}
                        </div>
                    )}

                    {/* Divisor */}
                    <hr className="my-8 border-gray-700" />

                    {/* Botón cambiar modo */}
                    <button
                        onClick={toggleModo}
                        disabled={loading}
                        className="w-full text-gray-300 hover:text-white font-medium py-2 transition-colors 
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {modo === 'login' 
                            ? '¿No tienes cuenta? Regístrate' 
                            : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}
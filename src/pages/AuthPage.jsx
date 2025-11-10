import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useAuth } from '../modules/auth/AuthProvider'

export default function AuthPage() {
    const { session } = useAuth()
    const navigate = useNavigate()

    const [modo, setModo] = useState('login') // 'login' o 'registro'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
            if (modo === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password })

                if (error) throw error

                setTipoMensaje('exito')
                setMensaje('¡Bienvenido de nuevo!')
                // useEffect redirige automáticamente al detectar la sesion
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } }) // redirigir al confirmar email

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
    }

    // Si ya hay sesión NO RENDERIZAR NADA
    if (session) return null

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
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
                                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xl"
                                >
                                    {mostrarPassword ? '👁️' : '👁️‍🗨️'}
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
    )
}
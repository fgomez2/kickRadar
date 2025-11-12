import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useAuth } from '../modules/auth/AuthProvider'
import KickHeader from "../components/KickHeader"
import KickFooter from "../components/KickFooter"

export default function MiPerfil() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    const [perfil, setPerfil] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [editando, setEditando] = useState(false)
    const [guardando, setGuardando] = useState(false)
    
    // Estados del formulario
    const [nombreCompleto, setNombreCompleto] = useState('')
    const [mensaje, setMensaje] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState('info')
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [eliminando, setEliminando] = useState(false)

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth')
        }
    }, [isAuthenticated, navigate])

    // Cargar datos del perfil
    useEffect(() => {
        const cargarPerfil = async () => {
            if (!user) return

            try {
                setCargando(true)
                const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

                if (error) throw error

                setPerfil(data)
                setNombreCompleto(data.full_name || '')
            } catch (error) {
                console.error('Error al cargar perfil:', error)
                setTipoMensaje('error')
                setMensaje('Error al cargar tu perfil')
            } finally {
                setCargando(false)
            }
        }

        cargarPerfil()
    }, [user])

    const handleGuardar = async (e) => {
        e.preventDefault()
        setGuardando(true)
        setMensaje(null)

        try {
            // Validaciones (nombre no vacío, no solo espacios,no números y longitud)
            if (!nombreCompleto.trim()) {
                setTipoMensaje('error')
                setMensaje('El nombre completo es obligatorio.')
                setGuardando(false)
                return
            }
            
            if (!nombreCompleto.includes(' ')) {
                setTipoMensaje('error')
                setMensaje('Por favor, ingresa tu nombre y apellido.')
                setGuardando(false)
                return
            }
            
            if (/\d/.test(nombreCompleto)) {
                setTipoMensaje('error')
                setMensaje('El nombre no puede contener números.')
                setGuardando(false)
                return
            }

            if (nombreCompleto.length < 3 || nombreCompleto.length > 35) {
                setTipoMensaje('error')
                setMensaje('El nombre debe tener entre 3 y 35 caracteres.')
                setGuardando(false)
                return
            }

            const { error } = await supabase.from('profiles').update({ full_name: nombreCompleto }).eq('id', user.id)

            if (error) throw error

            setPerfil({ ...perfil, full_name: nombreCompleto })
            setEditando(false)
            setTipoMensaje('exito')
            setMensaje('¡Perfil actualizado correctamente!')
        } catch (error) {
            console.error('Error al actualizar perfil:', error)
            setTipoMensaje('error')
            setMensaje('Error al actualizar el perfil')
        } finally {
            setGuardando(false)
        }
    }

    const handleCancelar = () => {
        setNombreCompleto(perfil?.full_name || '')
        setEditando(false)
        setMensaje(null)
    }

    const handleEliminarCuenta = async () => {
        try {
            setEliminando(true)
            
            // Primero eliminar el perfil de la tabla profiles
            const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id)

            if (profileError) throw profileError

            // Luego eliminar el usuario de auth (requiere privilegios admin o función RPC)
            // Como alternativa, cerramos sesión y mostramos mensaje
            await supabase.auth.signOut()
            
            navigate('/auth')
        } catch (error) {
            console.error('Error al eliminar cuenta:', error)
            setTipoMensaje('error')
            setMensaje('Error al eliminar la cuenta. Por favor, vuelve a intentarlo más tarde.')
            setEliminando(false)
        }
    }

    if (!isAuthenticated) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
            <KickHeader />
            
            <div className="flex-grow container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
                            Mi perfil
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Administra tu información personal
                        </p>
                    </div>

                    {cargando ? (
                        // Skeleton loader
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl border border-green-500/20 p-6 sm:p-8 md:p-10 animate-pulse">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-full"></div>
                                <div className="flex-1 w-full space-y-3">
                                    <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.2)] sm:shadow-[0_0_60px_rgba(34,197,94,0.25)]
                            border border-green-500/20 p-6 sm:p-8 md:p-10 backdrop-blur-sm 
                            hover:shadow-[0_0_80px_rgba(34,197,94,0.35)] transition-all duration-300 relative overflow-hidden">
                            
                            <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-green-400/10 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10">
                                {/* Header perfil */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-700">
                                    {/* Avatar */}
                                    <div className="relative group">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center 
                                            shadow-[0_0_30px_rgba(34,197,94,0.4)] group-hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-300 group-hover:scale-105">
                                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        {/* Boton de edición de AVATAR */}
                                        <button className="absolute -bottom-2 -right-2 bg-gray-800 border-2 border-green-400/50 rounded-full p-2 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Info básica */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                            {perfil?.full_name || 'Usuario'}
                                        </h2>
                                        <p className="text-gray-400 text-sm sm:text-base mb-3 break-all">
                                            {user?.email}
                                        </p>
                                    </div>

                                    {/* Botones de acción */}
                                    {!editando && (
                                        <div className="flex flex-col gap-3">
                                            {/* Botón editar */}
                                            <button onClick={() => setEditando(true)}
                                                className="group px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/50 hover:bg-gray-700 text-white font-semibold rounded-xl border-2 border-green-400/50 
                                                hover:border-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]
                                                hover:scale-105 active:scale-95 text-sm sm:text-base"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Editar perfil
                                                </span>
                                            </button>

                                            {/* Botón eliminar cuenta */}
                                            <button onClick={() => setMostrarConfirmacion(true)}
                                                className="group px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/50 hover:bg-red-900/50 text-white font-semibold rounded-xl border-2 border-red-500/30 
                                                hover:border-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
                                                hover:scale-105 active:scale-95 text-sm sm:text-base"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Eliminar cuenta
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Mostrar formulario de edición o información */}
                                {editando ? (
                                    <form onSubmit={handleGuardar} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Nombre completo */}
                                            <div className="group md:col-span-2">
                                                <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-300 mb-2 
                                                    group-focus-within:text-green-400 transition-colors duration-200">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        Nombre completo
                                                    </div>
                                                </label>
                                                <input id="nombreCompleto" type="text" required minLength={3} value={nombreCompleto}
                                                    onChange={(e) => setNombreCompleto(e.target.value)} placeholder="Tu nombre completo" disabled={guardando}
                                                    className="w-full px-4 py-3.5 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white 
                                                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 
                                                    focus:border-green-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-600 backdrop-blur-sm"
                                                />
                                            </div>

                                            {/* Email (solo lectura, no se podrá cambiar) */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        Email
                                                        <span className="text-xs text-gray-500">(no editable)</span>
                                                    </div>
                                                </label>
                                                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3.5 bg-gray-800/30 border-2 border-gray-700/50 rounded-xl text-gray-500 cursor-not-allowed backdrop-blur-sm" />
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <button type="submit" disabled={guardando}
                                                className="group relative flex-1 px-6 py-3.5 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-xl
                                                transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95
                                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                <span className="relative flex items-center justify-center gap-2">
                                                    {guardando ? (
                                                        <>
                                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Guardando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Guardar cambios
                                                        </>
                                                    )}
                                                </span>
                                            </button>

                                            <button
                                                type="button" onClick={handleCancelar}disabled={guardando}
                                                className="flex-1 px-6 py-3.5 bg-gray-800/50 hover:bg-gray-700 text-white font-semibold rounded-xl border-2 border-gray-600 hover:border-gray-500
                                                transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Información del perfil */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-400/10 rounded-lg">
                                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Nombre completo</p>
                                                        <p className="text-white font-medium">{perfil?.full_name || 'No especificado'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-400/10 rounded-lg">
                                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500">Correo electrónico</p>
                                                        <p className="text-white font-medium truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-400/10 rounded-lg">
                                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Miembro desde</p>
                                                        <p className="text-white font-medium">
                                                            {perfil?.created_at ? new Date(perfil.created_at).toLocaleDateString('es-ES', { 
                                                                year: 'numeric', 
                                                                month: 'long', 
                                                                day: 'numeric' 
                                                            }) : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-400/10 rounded-lg">
                                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Rol</p>
                                                        <p className="text-white font-medium capitalize">{perfil?.role || 'Usuario'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Info acción */}
                                {mensaje && (
                                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium backdrop-blur-sm border-2 animate-[slideDown_0.3s_ease-out] 
                                            ${tipoMensaje === 'error' 
                                                ? 'bg-red-900/30 border-red-500/50 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                                : 'bg-green-900/30 border-green-500/50 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                        }`} role="alert"
                                    >
                                        <div className="flex items-start gap-3">
                                            {tipoMensaje === 'error' ? (
                                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span>{mensaje}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Modal de confirmación de eliminación */}
                    {mostrarConfirmacion && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-red-500/50 
                                shadow-[0_0_60px_rgba(239,68,68,0.4)] p-6 sm:p-8 max-w-md w-full animate-[slideDown_0.3s_ease-out]">
                                {/* Icono de advertencia */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white text-center mb-3">
                                    ¿Eliminar cuenta?
                                </h3>

                                <p className="text-gray-300 text-center mb-6">
                                    Esta acción es <span className="text-red-500 font-semibold">irreversible</span>. 
                                    Se eliminarán todos tus datos y no podrás recuperar tu cuenta.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={() => setMostrarConfirmacion(false)} disabled={eliminando}
                                        className="flex-1 px-6 py-3 bg-gray-800/50 hover:bg-gray-700 text-white font-semibold rounded-xl border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 
                                        hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancelar
                                    </button>
                                    <button onClick={handleEliminarCuenta} disabled={eliminando}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 
                                        shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {eliminando ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Eliminando...
                                            </span>
                                        ) : (
                                            'Sí, eliminar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <KickFooter />
        </div>
    )
}
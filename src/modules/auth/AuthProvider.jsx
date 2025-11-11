import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { supabase } from '../../supabase-client'

const AuthContext = createContext({ 
    session: null, 
    user: null, 
    loading: true
})

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [cerrandoSesion, setCerrandoSesion] = useState(false) // estado loader cierre de sesión

    useEffect(() => {
        // Cargar la sesión actual al montar el componente
        supabase.auth.getSession()
            .then(({ data, error }) => {
                if (error) {
                    console.error('Error al obtener la sesión:', error)
                    setError(error)
                }
                setSession(data.session ?? null)
            })
            .catch((err) => {
                console.error('Error inesperado:', err)
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })

        // Suscribirse a los cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            console.log('Evento de autenticación:', event)
            setSession(newSession ?? null)
            setError(null) // Limpio errores en cada cambio de auth
        })

        return () => subscription.unsubscribe()
    }, [])

    const value = useMemo(() => ({
        session,
        user: session?.user ?? null,
        loading,
        error,
        isAuthenticated: !!session,
        cerrandoSesion,
        signOut: async () => {
            setCerrandoSesion(true)
            
            // Esperar 1.5 segundos para mostrar el loader
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error al cerrar sesión:', error)
                setError(error)
                setCerrandoSesion(false)
            } else {
                // Redirigir al home después de cerrar sesión
                window.location.href = '/'
            }
        },
        signIn: async (email, password) => {
            const { data, error} = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setError(error)
            }
            return { data, error }
        },
        signUp: async (email, password) => {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) {
                setError(error)
            }
            return { data, error }
        }
    }), [session, loading, error, cerrandoSesion])

    return (
        <AuthContext.Provider value={value}>
            {children}
            
            {/* Modal cierre de sesión */}
            {cerrandoSesion && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)] border border-green-500/30 p-8 md:p-12
                        backdrop-blur-sm animate-[slideUp_0.3s_ease-out]">
                        {/* Spinner animado */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-20 h-20">
                                {/* Círculo exterior */}
                                <div className="absolute inset-0 border-4 border-green-400/30 rounded-full"></div>
                                {/* Círculo animado */}
                                <div className="absolute inset-0 border-4 border-transparent border-t-green-400 rounded-full animate-spin"></div> {/* animate-spin para que gire */}
                                {/* Icono central */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Texto del modal */}
                            <div className="text-center">
                                <p className="text-white text-xl md:text-2xl font-bold mb-2">
                                    Cerrando sesión...
                                </p>
                                <p className="text-gray-400 text-sm md:text-base">
                                    Por favor, espera un momento
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}

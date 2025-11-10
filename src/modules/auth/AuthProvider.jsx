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
        signOut: async () => {
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error al cerrar sesión:', error)
                setError(error)
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
    }), [session, loading, error])

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}

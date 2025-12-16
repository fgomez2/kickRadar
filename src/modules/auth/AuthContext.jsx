import { createContext, useContext } from "react"

export const AuthContext = createContext({
    sesion: null,
    usuario: null,
    cargando: true,
})

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}
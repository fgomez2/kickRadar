import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase-client"
import { consumirStateStockx } from "../utils/stockxAuth"

export default function Callback() {
    const navigate = useNavigate()
    const [estado, setEstado] = useState('procesando') // 'procesando', 'exito', 'error'
    const [mensajeError, setMensajeError] = useState('')
    const yaProcesado = useRef(false) // el código de StockX solo sirve una vez (StrictMode ejecuta el efecto dos veces)

    useEffect(() => {
        if (yaProcesado.current) return
        yaProcesado.current = true

        const fallar = (mensaje) => {
            setEstado('error')
            setMensajeError(mensaje)
            setTimeout(() => navigate('/'), 3000)
        }

        const paramsURL = new URLSearchParams(window.location.search)
        const codigo = paramsURL.get('code')
        const stateRecibido = paramsURL.get('state')
        const stateEsperado = consumirStateStockx()

        // Quitar el código de la barra de direcciones y del historial
        window.history.replaceState({}, '', window.location.pathname)

        if (!codigo) {
            fallar('Código de autorización no encontrado')
            return
        }

        // El state tiene que ser el que se generó en esta misma pestaña al iniciar la conexión
        if (!stateEsperado || stateRecibido !== stateEsperado) {
            fallar('La respuesta de StockX no corresponde a una conexión iniciada desde esta pestaña')
            return
        }

        const codigoIntercambio = async () => {
            try {
                // La Edge Function solo acepta a un usuario administrador con sesión iniciada
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    fallar('Inicia sesión con la cuenta de administrador antes de conectar StockX')
                    return
                }

                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exchange-stockx-code`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                            Authorization: `Bearer ${session.access_token}`
                        },
                        body: JSON.stringify({
                            codigo,
                            redirect_uri: import.meta.env.VITE_STOCKX_REDIRECT_URI,
                        }),
                    }
                )

                // La función guarda los tokens en la base de datos y no los devuelve
                const data = await response.json().catch(() => null)

                if (!response.ok || !data?.ok) {
                    const mensajesPorEstado = {
                        401: 'Tu sesión no es válida. Vuelve a iniciar sesión e inténtalo de nuevo',
                        403: 'Tu cuenta no tiene permiso para conectar StockX',
                    }
                    console.error('Error al conectar StockX:', response.status, data?.error)
                    fallar(mensajesPorEstado[response.status] || data?.error || 'Error al procesar la autenticación')
                    return
                }

                setEstado('exito')
                setTimeout(() => navigate('/'), 1500)
            } catch (error) {
                console.error('Error durante el intercambio del código:', error)
                fallar('Error al procesar la autenticación')
            }
        }

        codigoIntercambio()
    }, [navigate])

    // Renderizar UI según el estado
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)] border border-green-500/30 p-8 md:p-12 max-w-md w-full">
                {estado === 'procesando' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-green-400/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-green-400 rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-white text-2xl font-bold mb-2">Procesando autenticación...</h2>
                            <p className="text-gray-400">Por favor, espera un momento</p>
                        </div>
                    </div>
                )}

                {estado === 'exito' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h2 className="text-white text-2xl font-bold mb-2">¡Autenticación exitosa!</h2>
                            <p className="text-gray-400">Redirigiendo...</p>
                        </div>
                    </div>
                )}
                {estado === 'error' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h2 className="text-white text-2xl font-bold mb-2">Error de autenticación</h2>
                            <p className="text-red-400 mb-4">{mensajeError}</p>
                            <p className="text-gray-400 text-sm">Redirigiendo al inicio...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
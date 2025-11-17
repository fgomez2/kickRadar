import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Callback() {
    const navigate = useNavigate()
    const [estado, setEstado] = useState('procesando') // 'procesando', 'exito', 'error'
    const [mensajeError, setMensajeError] = useState('')


    useEffect(() => {
        const paramsURL = new URLSearchParams(window.location.search)
        const codigo = paramsURL.get('code')

        if (!codigo) {
            console.error('Código de autorización no encontrado en la URL')
            setEstado('error')
            setMensajeError('Código de autorización no encontrado')
            setTimeout(() => navigate('/'), 3000)
            return
        }

        const codigoIntercambio = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exchange-stockx-code`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                        },
                        body: JSON.stringify({
                            codigo,
                            redirect_uri: import.meta.env.VITE_STOCKX_REDIRECT_URI,
                        }),
                    }
                )

                if (!response.ok) {
                    throw new Error(`Error en el intercambio del código: ${response.statusText}`)
                }

                const data = await response.json()
                console.log('Token de acceso recibido:', data)

                // Guardar el access_token en localStorage
                if (data.access_token) {
                    localStorage.setItem('stockx_access_token', data.access_token)
                    
                    // Opcional: guardar también la fecha de expiración si la API la proporciona
                    if (data.expires_in) {
                        const expiracion = Date.now() + (data.expires_in * 1000)
                        localStorage.setItem('stockx_token_expiration', expiracion.toString())
                    }
                }

                setEstado('exito')
                setTimeout(() => navigate('/'), 1500)
            } catch (error) {
                console.error('Error durante el intercambio del código:', error)
                setEstado('error')
                setMensajeError(error.message || 'Error al procesar la autenticación')
                setTimeout(() => navigate('/'), 3000)
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
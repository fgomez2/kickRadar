import { useState, useEffect } from "react"

export default function useGoatPrices(sku) {
    const [precios, setPrecios] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Si no hay sku, no se hace nada
        if (!sku) {
            setPrecios([])
            setCargando(false)
            return
        }

        const controller = new AbortController()

        const fetchGoatPrecios = async () => {
            setCargando(true)
            setError(null)

            try {
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
                
                const url = `${supabaseUrl}/functions/v1/get-goat-prices`

                const response = await fetch(url, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: {
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sku: sku }) 
                })

                const textoData = await response.text()

                if (!response.ok) {
                    throw new Error(`Error servidor (${response.status}): ${textoData}`)
                }

                const data = JSON.parse(textoData)
                setPrecios(data)

            } catch (err) {
                if (err.name === 'AbortError') return
                console.error('Error con los precios:', err)
                setError(err.message)
                setPrecios([])

            } finally {
                if (!controller.signal.aborted) {
                    setCargando(false)
                }
            }
        }

        fetchGoatPrecios()

        return () => controller.abort()
    }, [sku])

    return { precios, cargando, error }
}
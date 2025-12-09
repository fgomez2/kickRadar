import { useState, useEffect } from 'react'

export default function useStockxPrices(urlKey) {
    const [precios, setPrecios] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!urlKey || urlKey === 'undefined') {
            setPrecios([]);
            setCargando(false);
            return;
        }

        const controller = new AbortController()

        const fetchPrecios = async () => {
            setCargando(true)
            setError(null)

            try {
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
                
                const url = `${supabaseUrl}/functions/v1/get-stockx-prices`

                const response = await fetch(url, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: {
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ urlKey: urlKey }) 
                })

                const textData = await response.text()
                
                if (!response.ok) {
                    throw new Error(`Error servidor (${response.status}): ${textData}`)
                }

                const data = JSON.parse(textData)
                setPrecios(data)

            } catch (err) {
                if (err.name === 'AbortError') return
                console.error('Error con los precios:', err)
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }

        fetchPrecios()

        return () => {
            controller.abort()
        }
    }, [urlKey])

    return { precios, cargando, error }
}
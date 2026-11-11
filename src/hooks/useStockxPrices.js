import { useState, useEffect } from 'react'

export default function useStockxPrices(urlKey) {
    const [precios, setPrecios] = useState([])
    const [sku, setSku] = useState(null)
    const [imagen, setImagen] = useState({ urlKey: null, url: null }) // imagen real del producto (viene de KicksDB)
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!urlKey || urlKey === 'undefined') {
            setPrecios([])
            setSku(null)
            setCargando(false)
            return
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

                if (data.variants) {
                    setPrecios(data.variants)
                    setSku(data.sku) // guardamos sku para que lo pueda usar la API de KICKSDB para GOAT
                    // KicksDB manda una miniatura (w=140): sin los parámetros el CDN devuelve la imagen a tamaño completo
                    setImagen({ urlKey, url: data.image ? data.image.split('?')[0] : null })
                } else {
                    setPrecios(data)
                }

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

    // La imagen solo vale para el producto con el que se pidió
    return { precios, sku, imagen: imagen.urlKey === urlKey ? imagen.url : null, cargando, error }
}
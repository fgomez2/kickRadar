import { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'

export default function useStockxSearch(busqueda) {
    const [sneakers, setSneakers] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!busqueda) {
            setSneakers([])
            return
        }

        const controller = new AbortController()

        const fetchData = async () => {
            setCargando(true)
            setError(null)

            try {
                // AQUÍ IRA LA LÓGICA DE BÚSQUEDA EN STOCKX
                // 1. Obtener el access token y x-api-key de Supabase
                // 2. llamar a la api de stockx con la búsqueda
                // 3. guardar los resultados en el estado sneakers
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

                if (!supabaseUrl || !supabaseAnonKey) {
                    throw new Error('No se pudo obtener la URL de Supabase de las variables de entorno')
                }

                const url = `${supabaseUrl}/functions/v1/stockx-search?query=${encodeURIComponent(busqueda)}`

                const response = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: {
                        apiKey: supabaseAnonKey,
                        Authorization: `Bearer ${supabaseAnonKey}`,
                    },
                })

                if (!response.ok) {
                    const mensajeError = `Error en la búsqueda: ${response.status} ${response.statusText}`
                    throw new Error(mensajeError)
                }

                const data = await response.json()

                // Validar estructura de respuesta (puede ser "products" o "Products")
                const productos = data?.products || data?.Products || []
                
                if (!Array.isArray(productos) || productos.length === 0) {
                    setSneakers([])
                    return
                } else {
                    // Filtro adicional por si la API no respeta el parámetro productCategory
                    const soloSneakers = productos.filter((p) =>
                        (p.productType && p.productType.toLowerCase() === 'sneakers') ||
                        (p.category && p.category.toLowerCase() === 'sneakers')
                    )

                    // Normalizar datos
                    const normalizados = soloSneakers.map((p) => ({
                        id: p.productId,
                        titulo: p.title,
                        marca: p.brand,
                        tipo: p.productType,
                        styleId: p.styleId,
                        urlKey: p.urlKey,
                        precioRetail: p.productAttributes?.retailPrice ?? null,
                        colores: p.productAttributes?.colorway ?? null,
                        genero: p.productAttributes?.gender ?? null,
                        fechaDeSalida: p.productAttributes?.releaseDate ?? null,
                    }))

                    setSneakers(normalizados)
                }
            } catch (err) {
                if (err.name === 'AbortError') return // La solicitud fue abortada
                console.error('Error al buscar sneakers en StockX:', err)
                setError('Error al buscar sneakers. Por favor, inténtalo de nuevo más tarde.')
            } finally {
                setCargando(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [busqueda])

    return { sneakers, cargando, error }

}
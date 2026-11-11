import { useState, useEffect } from 'react'
import { generarUrlsImagen } from '../utils/stockxImagenes'

const SIN_PAGINACION = { total: null, totalPaginas: null, hayMas: false }

export default function useStockxSearch(busqueda, pagina = 1) {
    const [sneakers, setSneakers] = useState([])
    const [paginacion, setPaginacion] = useState(SIN_PAGINACION)
    const [cargando, setCargando] = useState(!!busqueda)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!busqueda) {
            setSneakers([])
            setPaginacion(SIN_PAGINACION)
            setCargando(false)
            setError(null)
            return
        }

        const controller = new AbortController()

        const fetchData = async () => {
            setCargando(true)
            setError(null)

            try {
                // La búsqueda pasa por la Edge Function stockx-search, que llama a la API de StockX
                // con el access token y la x-api-key guardados en Supabase
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

                if (!supabaseUrl || !supabaseAnonKey) {
                    throw new Error('No se pudo obtener la URL de Supabase de las variables de entorno')
                }

                const url = `${supabaseUrl}/functions/v1/stockx-search?query=${encodeURIComponent(busqueda)}&page=${pagina}`

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

                // Datos de paginación que devuelve StockX junto a los productos.
                // count cuenta todo lo que coincide (también lo que no son sneakers), así que es orientativo
                const total = Number.isFinite(data?.count) ? data.count : null
                const tamanoPagina = data?.pageSize > 0 ? data.pageSize : 15

                setPaginacion({
                    total,
                    totalPaginas: total !== null ? Math.max(1, Math.ceil(total / tamanoPagina)) : null,
                    hayMas: Boolean(data?.hasNextPage),
                })

                // Validar estructura de respuesta (puede ser "products" o "Products")
                const productos = data?.products || data?.Products || []

                if (!Array.isArray(productos) || productos.length === 0) {
                    setSneakers([])
                    return
                }

                // Filtro adicional por si la API no respeta el parámetro productCategory
                const soloSneakers = productos.filter((p) =>
                    (p.productType && p.productType.toLowerCase() === 'sneakers') ||
                    (p.category && p.category.toLowerCase() === 'sneakers')
                )

                // Normalizar datos
                const normalizados = soloSneakers.map((p) => {
                    const imagenesCandidatas = generarUrlsImagen({ urlKey: p.urlKey, titulo: p.title })

                    return {
                        id: p.productId,
                        titulo: p.title,
                        marca: p.brand,
                        tipo: p.productType,
                        styleId: p.styleId,
                        urlKey: p.urlKey,
                        imagenUrl: imagenesCandidatas[0] ?? null,
                        imagenesCandidatas,
                        precioRetail: p.productAttributes?.retailPrice ?? null,
                        colores: p.productAttributes?.colorway ?? null,
                        genero: p.productAttributes?.gender ?? null,
                        fechaDeSalida: p.productAttributes?.releaseDate ?? null,
                    }
                })

                setSneakers(normalizados)
            } catch (err) {
                if (err.name === 'AbortError') return // La solicitud fue abortada
                console.error('Error al buscar sneakers en StockX:', err)
                setError('Error al buscar sneakers. Por favor, inténtalo de nuevo más tarde.')
                setSneakers([])
                setPaginacion(SIN_PAGINACION)
            } finally {
                // Si se abortó es porque ya hay otra búsqueda en marcha: no se toca su estado de carga
                if (!controller.signal.aborted) {
                    setCargando(false)
                }
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [busqueda, pagina])

    return { sneakers, cargando, error, ...paginacion }

}

import { useState, useEffect } from 'react'
import { generarUrlsImagen } from '../utils/stockxImagenes'

export default function useStockxProduct(productId) {
    const [sneaker, setSneaker] = useState(null)
    // forzar que productId sea booleano
    const [cargando, setCargando] = useState(!!productId) // si hay un productId el loader es activo, si no hay productId no mostraremos ningún loader
    const [error, setError] = useState(null)
    const [cargaCompleta, setCargaCompleta] = useState(false) // para forzar ver la carga

    useEffect(() => {
        if (!productId) {
            setSneaker(null)
            setCargando(false)
            setError(null)
            setCargaCompleta(false)
            return
        }

        const controller = new AbortController()

        const fetchData = async () => {
            setCargando(true)
            setError(null)
            setCargaCompleta(false)

            // para forzar que salga "cargando detalles..." de la sneaker
            const inicio = Date.now()

            try {
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

                if (!supabaseUrl || !supabaseAnonKey) {
                    throw new Error('No se pudo obtener la URL de Supabase de las variables de entorno')
                }

                const url = `${supabaseUrl}/functions/v1/stockx-product?id=${encodeURIComponent(productId)}`

                const response = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: {
                        apiKey: supabaseAnonKey,
                        Authorization: `Bearer ${supabaseAnonKey}`,
                    },
                })

                if (!response.ok) {
                    const mensajeError = `Error al obtener el producto: ${response.status} ${response.statusText}`
                    throw new Error(mensajeError)
                }

                const data = await response.json()
                
                console.log('Respuesta completa de la API:', data)

                const producto = data?.product || data?.Product || data
                
                if (!producto || !producto.productId) {
                    console.error('Estructura de respuesta inesperada:', data)
                    throw new Error('Producto no encontrado')
                }

                const imagenesCandidatas = generarUrlsImagen({ urlKey: producto.urlKey, titulo: producto.title })

                // Normalizar datos
                const sneakerNormalizada = {
                    id: producto.productId,
                    titulo: producto.title,
                    marca: producto.brand,
                    tipo: producto.productType,
                    styleId: producto.styleId,
                    urlKey: producto.urlKey,
                    imagenUrl: imagenesCandidatas[0] ?? null,
                    imagenesCandidatas,
                    precioRetail: producto.productAttributes?.retailPrice ?? null,
                    colores: producto.productAttributes?.colorway ?? null,
                    genero: producto.productAttributes?.gender ?? null,
                    fechaDeSalida: producto.productAttributes?.releaseDate ?? null,
                    descripcion: producto.description ?? null,
                }

                setSneaker(sneakerNormalizada)
            } catch (err) {
                if (err.name === 'AbortError') return // La solicitud fue abortada
                console.error('Error al obtener detalles del producto:', err)
                setError('Error al cargar los detalles del producto. Por favor, inténtalo de nuevo más tarde.')
            } finally {
                const tiempoTranscurrido = Date.now() - inicio
                const tiempoMinimo = 600

                if (tiempoTranscurrido < tiempoMinimo) {
                    await new Promise(res => setTimeout(res, tiempoMinimo - tiempoTranscurrido))
                }

                setCargando(false)
                setCargaCompleta(true)
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [productId])

    return { sneaker, cargando, error, cargaCompleta }
}
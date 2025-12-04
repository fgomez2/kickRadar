import { useState, useEffect } from 'react'

export default function useStockxProduct(productId) {
    const [sneaker, setSneaker] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!productId) {
            setSneaker(null)
            return
        }

        const controller = new AbortController()

        const fetchData = async () => {
            setCargando(true)
            setError(null)

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

                const formatearUrlKey = (urlKey) => {
                    if (!urlKey) return null
                    
                    // Division por guiones
                    const palabras = urlKey.split('-')
                    
                    // Lista de siglas comunes mayus
                    const siglas = ['og', 'ps', 'gs', 'td', 'bp', 'se', 'lx', 'sp', 'af', 'qs', 'pe', 'rnr', 'mx']
                    
                    // Poner primera letra de cada palabra en mayus
                    const palabrasMayus = palabras.map((palabra, index) => {
                        if (!palabra) return ''
                        
                        const palabraLower = palabra.toLowerCase()
                        
                        // Si es 'adidas' en la primera posición, mantenerla en minúsculas
                        if (index === 0 && palabraLower === 'adidas') {
                            return 'adidas'
                        }
                        
                        // Si la palabra está en la lista de siglas, ponerla en mayúsculas
                        if (siglas.includes(palabraLower)) {
                            return palabraLower.toUpperCase()
                        }
                        
                        if (/^\d+$/.test(palabra)) {
                            return palabra
                        }
                        
                        // Casos especiales de mezcla (ej V2)
                        if (/^v\d+$/i.test(palabra)) {
                            return palabra.toUpperCase()
                        }
                        
                        // Mayus primera letra y el resto minusculas
                        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
                    })
                    
                    return palabrasMayus.join('-')
                }

                const urlKeyFormateado = formatearUrlKey(producto.urlKey)

                // Normalizar datos
                const sneakerNormalizada = {
                    id: producto.productId,
                    titulo: producto.title,
                    marca: producto.brand,
                    tipo: producto.productType,
                    styleId: producto.styleId,
                    urlKey: producto.urlKey,
                    imagenUrl: urlKeyFormateado ? `https://images.stockx.com/images/${urlKeyFormateado}-Product.jpg` : null,
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
                setCargando(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [productId])

    return { sneaker, cargando, error }
}

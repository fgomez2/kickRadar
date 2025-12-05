import { useState, useEffect } from 'react'

export default function useStockxSearch(busqueda) {
    const [sneakers, setSneakers] = useState([])
    const [cargando, setCargando] = useState(!!busqueda)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!busqueda) {
            setSneakers([])
            setCargando(false)
            setError(null)
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

                    // Normalizar datos
                    const normalizados = soloSneakers.map((p) => {
                        const urlKeyFormateado = formatearUrlKey(p.urlKey)
                        
                        return {
                            id: p.productId,
                            titulo: p.title,
                            marca: p.brand,
                            tipo: p.productType,
                            styleId: p.styleId,
                            urlKey: p.urlKey,
                            imagenUrl: urlKeyFormateado ? `https://images.stockx.com/images/${urlKeyFormateado}-Product.jpg` : null,
                            precioRetail: p.productAttributes?.retailPrice ?? null,
                            colores: p.productAttributes?.colorway ?? null,
                            genero: p.productAttributes?.gender ?? null,
                            fechaDeSalida: p.productAttributes?.releaseDate ?? null,
                        }
                    })

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
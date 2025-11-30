import { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'

export default function useStockxSearch(busqueda) {
    const [sneakers, setSneakers] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!busqueda) return

        const fetchData = async () => {
            setCargando(true)
            setError(null)

            try {
                // AQUÍ IRA LA LÓGICA DE BÚSQUEDA EN STOCKX
                // 1. Obtener el access token y x-api-key de Supabase
                // 2. llamar a la api de stockx con la búsqueda
                // 3. guardar los resultados en el estado sneakers
                const { data: credenciales, error: errorCreds } = await supabase
                    .from('stockx_credentials')
                    .select('access_token')
                    .limit(1)
                    .maybeSingle()

                if (errorCreds || !credenciales?.access_token) {
                    throw new Error('No se pudo obtener el token de acceso de las credenciales de StockX')
                }

                const apiKey = import.meta.env.VITE_STOCKX_API_KEY

                if (!apiKey) {
                    throw new Error('No se pudo obtener la x-api-key de las variables de entorno')
                }

                // Filtrar solo por sneakers en la URL
                const url = `https://api.stockx.com/v2/catalog/search?query=${encodeURIComponent(busqueda)}&productCategory=sneakers&pageNumber=1&pageSize=15`

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'x-api-key': apiKey,
                        Authorization: `Bearer ${credenciales.access_token}`
                    }
                })

                if (!response.ok) {
                    // Si el token expiró (401), intentar renovarlo
                    if (response.status === 401) {
                        throw new Error('Token de acceso expirado. Por favor, contacta al administrador.')
                    }
                    const mensajeError = `Error en la solicitud a StockX: ${response.status} ${response.statusText}`
                    throw new Error(mensajeError)
                }

                const data = await response.json()

                // Validar estructura de respuesta (puede ser "products" o "Products")
                const productos = data?.products || data?.Products || []
                
                if (!Array.isArray(productos) || productos.length === 0) {
                    setSneakers([])
                } else {
                    // Filtro adicional por si la API no respeta el parámetro productCategory
                    const sneakersFiltered = productos.filter(producto => 
                        !producto.productCategory || 
                        producto.productCategory.toLowerCase() === 'sneakers'
                    )
                    setSneakers(sneakersFiltered)
                }

            } catch (err) {
                console.error('Error al buscar sneakers en StockX:', err)
                setError('Error al buscar sneakers. Por favor, inténtalo de nuevo más tarde.')
            } finally {
                setCargando(false)
            }
        }

        fetchData()
    }, [busqueda])

    return { sneakers, cargando, error }

}
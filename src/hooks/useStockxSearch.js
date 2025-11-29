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
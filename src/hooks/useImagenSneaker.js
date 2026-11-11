import { useEffect, useState } from 'react'
import { supabase } from '../supabase-client'
import useImagenConFallback from './useImagenConFallback'

// Una sola petición por producto aunque lo pidan varias tarjetas o se vuelva a la misma página
const peticiones = new Map()

// Pide la imagen real a la Edge Function stockx-image (KicksDB con caché en base de datos)
const pedirImagenReal = (urlKey) => {
    if (!peticiones.has(urlKey)) {
        const peticion = (async () => {
            // La función solo responde a usuarios con sesión
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Sin sesión')

            const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stockx-image?urlKey=${encodeURIComponent(urlKey)}`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${session.access_token}`,
                },
            })

            if (!response.ok) throw new Error(`Error servidor (${response.status})`)

            const data = await response.json()
            return data?.image ?? null
        })().catch(() => {
            // Si no se pudo preguntar (sin sesión, fallo de red...) se permite reintentar más adelante
            peticiones.delete(urlKey)
            return null
        })

        peticiones.set(urlKey, peticion)
    }

    return peticiones.get(urlKey)
}

// Imagen de una sneaker: prueba las URLs deducidas y, si ninguna carga, pide la real al servidor.
// El <img> debe llevar key={src} (ver useImagenConFallback).
export default function useImagenSneaker({ urlKey, candidatas }) {
    const [real, setReal] = useState({ urlKey: null, url: null })
    const realResuelta = real.urlKey === urlKey

    const imagen = useImagenConFallback([...candidatas, realResuelta ? real.url : null])
    const agotadas = imagen.src === null

    useEffect(() => {
        if (!agotadas || !urlKey) return

        let cancelado = false

        pedirImagenReal(urlKey).then((url) => {
            if (!cancelado) setReal({ urlKey, url })
        })

        return () => {
            cancelado = true
        }
    }, [agotadas, urlKey])

    return {
        ...imagen,
        // true mientras se espera la respuesta del servidor (para mostrar el spinner y no el icono)
        buscando: agotadas && Boolean(urlKey) && !realResuelta,
    }
}

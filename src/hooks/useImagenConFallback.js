import { useState } from 'react'

// Va probando las URLs candidatas en orden: cuando una falla pasa a la siguiente.
// Si se añaden candidatas más tarde (ej. la imagen que llega con los precios) también se prueban.
// El <img> debe llevar key={src} para que cada candidata empiece de cero.
export default function useImagenConFallback(candidatas) {
    const [fallidas, setFallidas] = useState([])
    const [urlCargada, setUrlCargada] = useState(null)

    // Primera candidata que todavía no ha fallado (null = no queda ninguna)
    const src = candidatas.find((url) => url && !fallidas.includes(url)) ?? null

    return {
        src,
        cargada: src !== null && urlCargada === src,
        alCargar: () => setUrlCargada(src),
        alFallar: () => setFallidas((previas) => (previas.includes(src) ? previas : [...previas, src])),
    }
}

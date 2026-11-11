// La API oficial de StockX no devuelve imágenes, así que la URL se deduce del producto.
// El CDN distingue mayúsculas y minúsculas y el nombre del archivo no siempre coincide con el urlKey,
// por eso se generan varias candidatas y se prueban en orden (ver useImagenConFallback).

const BASE_IMAGENES = 'https://images.stockx.com/images/'

// Siglas que StockX escribe en mayúsculas
const SIGLAS = ['og', 'ps', 'gs', 'td', 'bp', 'se', 'lx', 'sp', 'af', 'qs', 'pe', 'rnr', 'mx']

// Capitaliza una palabra del urlKey cuando el título no dice cómo se escribe
const capitalizarPalabra = (palabra, index) => {
    if (!palabra) return ''

    const palabraLower = palabra.toLowerCase()

    // 'adidas' en la primera posición se mantiene en minúsculas
    if (index === 0 && palabraLower === 'adidas') return 'adidas'

    if (SIGLAS.includes(palabraLower)) return palabraLower.toUpperCase()

    if (/^\d+$/.test(palabra)) return palabra

    // Casos de mezcla (ej V2)
    if (/^v\d+$/i.test(palabra)) return palabra.toUpperCase()

    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
}

// Palabras del título indexadas en minúsculas, para copiar su capitalización real (ASICS, SB, 2002R, x...)
const palabrasDelTitulo = (titulo) => {
    const mapa = new Map()

    String(titulo ?? '')
        .replace(/[()'’.,/&+]/g, '')
        .split(/[\s-]+/)
        .filter(Boolean)
        .forEach((palabra) => {
            const clave = palabra.toLowerCase()
            if (!mapa.has(clave)) mapa.set(clave, palabra)
        })

    return mapa
}

/**
 * Devuelve las URLs candidatas de la imagen de un producto, de más a menos probable.
 */
export function generarUrlsImagen({ urlKey, titulo }) {
    if (!urlKey) return []

    const palabras = urlKey.split('-')
    const delTitulo = palabrasDelTitulo(titulo)

    // Palabras del urlKey escritas como en el título
    const nombreSegunTitulo = palabras
        .map((palabra, index) => delTitulo.get(palabra.toLowerCase()) ?? capitalizarPalabra(palabra, index))
        .join('-')

    // Solo con las reglas de capitalización
    const nombreCapitalizado = palabras.map(capitalizarPalabra).join('-')

    const candidatas = [
        `${BASE_IMAGENES}${nombreSegunTitulo}-Product.jpg`,
        `${BASE_IMAGENES}${nombreSegunTitulo}.jpg`, // lanzamientos recientes sin el sufijo -Product
        `${BASE_IMAGENES}${nombreCapitalizado}-Product.jpg`,
    ]

    // El título tal cual, por si el archivo usa el apodo y no el urlKey (ej. "Zebra")
    const nombreDelTitulo = [...delTitulo.values()].join('-')
    if (nombreDelTitulo) candidatas.push(`${BASE_IMAGENES}${nombreDelTitulo}-Product.jpg`)

    return [...new Set(candidatas)]
}

/**
 * Candidatas para un favorito guardado: primero la URL almacenada y después las deducidas,
 * para recuperar favoritos que se guardaron con una URL que no carga.
 */
export function generarUrlsImagenFavorito({ image_url, title }) {
    if (!image_url) return []

    const candidatas = [image_url]

    if (image_url.startsWith(BASE_IMAGENES)) {
        const nombre = image_url.slice(BASE_IMAGENES.length).split('?')[0].replace(/(-Product)?\.jpg$/i, '')
        candidatas.push(...generarUrlsImagen({ urlKey: nombre.toLowerCase(), titulo: title }))
    }

    return [...new Set(candidatas)]
}

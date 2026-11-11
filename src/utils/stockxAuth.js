const CLAVE_STATE = 'stockx_oauth_state'

export function redireccionStockxLogin() {
    const clientId = import.meta.env.VITE_STOCKX_CLIENT_ID
    const redirectUri = import.meta.env.VITE_STOCKX_REDIRECT_URI
    const audience = 'gateway.stockx.com'
    const scope = 'offline_access openid'

    // Valor aleatorio por intento: se guarda para comprobarlo cuando StockX redirija a /callback
    const state = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
    sessionStorage.setItem(CLAVE_STATE, state)

    const authUrl = `https://accounts.stockx.com/authorize?` +
        `response_type=code&client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&audience=${audience}` +
        `&state=${state}`

    // Redirigir al usuario a la URL de autenticación de StockX
    window.location.href = authUrl
}

// Devuelve el state guardado y lo borra (solo vale para un intento)
export function consumirStateStockx() {
    const state = sessionStorage.getItem(CLAVE_STATE)
    sessionStorage.removeItem(CLAVE_STATE)
    return state
}

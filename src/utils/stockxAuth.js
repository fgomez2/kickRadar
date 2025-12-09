export function redireccionStockxLogin() {
    const clientId = import.meta.env.VITE_STOCKX_CLIENT_ID
    const redirectUri = import.meta.env.VITE_STOCKX_REDIRECT_URI
    const audience = 'gateway.stockx.com'
    const scope = 'offline_access openid'
    const state = 'abcXYZ9876' // Valor fijo para ejemplo en producción usar un valor aleatorio y almacenarlo para verificar después

    const authUrl = `https://accounts.stockx.com/authorize?` +
        `response_type=code&client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&audience=${audience}` +
        `&state=${state}`
    
    // Redirigir al usuario a la URL de autenticación de StockX
    window.location.href = authUrl
}
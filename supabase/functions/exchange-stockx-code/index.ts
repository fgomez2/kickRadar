// Supabase Edge Function para intercambiar el código de autorización de StockX por un access token
// Documentación: https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Variables de entorno (configurar en Supabase Dashboard)
const STOCKX_CLIENT_ID = Deno.env.get('STOCKX_CLIENT_ID')
const STOCKX_CLIENT_SECRET = Deno.env.get('STOCKX_CLIENT_SECRET')

// URL correcta del endpoint de token de StockX
const STOCKX_TOKEN_URL = 'https://accounts.stockx.com/oauth/token'

// CORS headers - Permitir todas las origins (incluyendo ngrok)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Manejar solicitudes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validar que las variables de entorno estén configuradas
    if (!STOCKX_CLIENT_ID || !STOCKX_CLIENT_SECRET) {
      console.error('❌ Variables de entorno no configuradas')
      return new Response(
        JSON.stringify({ 
          error: 'Configuración del servidor incompleta',
          details: 'STOCKX_CLIENT_ID o STOCKX_CLIENT_SECRET no están definidos'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parsear el body de la petición
    const body = await req.json()
    const code = body.codigo || body.code // Aceptar ambos nombres por compatibilidad
    const redirect_uri = body.redirect_uri

    // Validar parámetros requeridos
    if (!code || !redirect_uri) {
      console.error('❌ Parámetros faltantes:', { code: !!code, redirect_uri: !!redirect_uri })
      return new Response(
        JSON.stringify({ 
          error: 'Parámetros requeridos faltantes',
          details: 'Se requieren: code (o codigo) y redirect_uri'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔄 Intercambiando código por token...')
    console.log('📍 Usando endpoint:', STOCKX_TOKEN_URL)

    // Preparar los parámetros para StockX OAuth (según especificación OAuth 2.0)
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: STOCKX_CLIENT_ID!,
      client_secret: STOCKX_CLIENT_SECRET!,
      code: code,
      redirect_uri: redirect_uri,
    })

    console.log("📤 Enviando a StockX:", {
      client_id: STOCKX_CLIENT_ID,
      client_secret: STOCKX_CLIENT_SECRET ? "[OCULTO]" : "❌ NO DEFINIDO",
      redirect_uri,
      code
    })


    // Hacer la petición a StockX
    const response = await fetch(STOCKX_TOKEN_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString(),
    })

    const data = await response.json()

    // Si StockX devuelve un error
    if (!response.ok) {
      console.error('❌ Error de StockX:', data)
      return new Response(
        JSON.stringify({ 
          error: 'Error al intercambiar código',
          details: data,
          status: response.status
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ Token obtenido exitosamente')

    // Devolver el token al cliente
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
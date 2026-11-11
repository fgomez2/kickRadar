// Supabase Edge Function: intercambia el código de autorización de StockX por los tokens
// y los guarda en stockx_credentials. Los tokens nunca salen de esta función.
// Solo puede llamarla un usuario administrador con sesión iniciada (secreto STOCKX_ADMIN_USER_IDS).
// Documentación: https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Variables de entorno (configurar en Supabase Dashboard)
const STOCKX_CLIENT_ID = Deno.env.get('STOCKX_CLIENT_ID')
const STOCKX_CLIENT_SECRET = Deno.env.get('STOCKX_CLIENT_SECRET')

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// IDs (auth.users.id) de los usuarios que pueden conectar la cuenta de StockX, separados por comas
const ADMIN_USER_IDS = (Deno.env.get('STOCKX_ADMIN_USER_IDS') ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

// URL correcta del endpoint de token de StockX
const STOCKX_TOKEN_URL = 'https://accounts.stockx.com/oauth/token'

// CORS headers - Permitir todas las origins (incluyendo ngrok)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const responder = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

serve(async (req) => {
  // Manejar solicitudes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return responder({ error: 'Método no permitido' }, 405)
  }

  try {
    // Validar que las variables de entorno estén configuradas
    if (!STOCKX_CLIENT_ID || !STOCKX_CLIENT_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Variables de entorno no configuradas')
      return responder({ error: 'Configuración del servidor incompleta' }, 500)
    }

    // Sin lista de administradores no se deja pasar a nadie
    if (ADMIN_USER_IDS.length === 0) {
      console.error('❌ STOCKX_ADMIN_USER_IDS no está definido')
      return responder({
        error: 'Configuración del servidor incompleta',
        details: 'Falta el secreto STOCKX_ADMIN_USER_IDS',
      }, 500)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })

    // Quien llama tiene que ser un usuario con sesión (no vale la anon key) y estar en la lista de administradores
    const jwt = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
    const { data: userData, error: userError } = jwt
      ? await supabase.auth.getUser(jwt)
      : { data: null, error: null }
    const usuario = userData?.user

    if (userError || !usuario) {
      return responder({ error: 'Sesión no válida' }, 401)
    }

    if (!ADMIN_USER_IDS.includes(usuario.id)) {
      console.warn('⚠️ Intento de conectar StockX sin permiso:', usuario.id)
      return responder({ error: 'No autorizado' }, 403)
    }

    // Parsear el body de la petición
    const body = await req.json().catch(() => null)
    const code = body?.codigo || body?.code // Aceptar ambos nombres por compatibilidad
    const redirect_uri = body?.redirect_uri

    // Validar parámetros requeridos
    if (typeof code !== 'string' || !code || typeof redirect_uri !== 'string' || !redirect_uri) {
      return responder({
        error: 'Parámetros requeridos faltantes',
        details: 'Se requieren: code (o codigo) y redirect_uri',
      }, 400)
    }

    // Preparar los parámetros para StockX OAuth (según especificación OAuth 2.0)
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: STOCKX_CLIENT_ID,
      client_secret: STOCKX_CLIENT_SECRET,
      code: code,
      redirect_uri: redirect_uri,
    })

    // Hacer la petición a StockX
    const response = await fetch(STOCKX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    })

    const data = await response.json().catch(() => null)

    // Si StockX devuelve un error
    if (!response.ok || !data?.access_token) {
      console.error('❌ Error de StockX al intercambiar el código:', response.status, data?.error)
      return responder({
        error: 'StockX rechazó el código de autorización',
        details: data?.error_description ?? data?.error ?? null,
      }, 502)
    }

    // Guardar los tokens en stockx_credentials (una sola fila)
    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000).toISOString()
      : null

    const credenciales: Record<string, string | null> = {
      access_token: data.access_token,
      token_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }

    // Si StockX no manda refresh_token se conserva el que ya hubiera
    if (data.refresh_token) {
      credenciales.refresh_token = data.refresh_token
    }

    // Misma fila que lee getStockxAccessToken (la más reciente)
    const { data: existente, error: selectError } = await supabase
      .from('stockx_credentials')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (selectError) {
      console.error('❌ Error al buscar las credenciales existentes:', selectError.message)
      return responder({ error: 'No se pudieron guardar los tokens' }, 500)
    }

    const { error: saveError } = existente
      ? await supabase.from('stockx_credentials').update(credenciales).eq('id', existente.id)
      : await supabase.from('stockx_credentials').insert(credenciales)

    if (saveError) {
      console.error('❌ Error al guardar los tokens:', saveError.message)
      return responder({ error: 'No se pudieron guardar los tokens' }, 500)
    }

    console.log('✅ Tokens de StockX guardados por', usuario.id)

    // NO DEVOLVEMOS LOS TOKENS
    return responder({ ok: true, token_expires_at: expiresAt }, 200)

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return responder({ error: 'Error interno del servidor' }, 500)
  }
})

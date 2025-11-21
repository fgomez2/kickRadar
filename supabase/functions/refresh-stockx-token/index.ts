import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Variables de entorno (ya configuradas en web desde Supabase)
const STOCKX_CLIENT_ID = Deno.env.get('STOCKX_CLIENT_ID')
const STOCKX_CLIENT_SECRET = Deno.env.get('STOCKX_CLIENT_SECRET')
const STOCKX_TOKEN_URL = 'https://accounts.stockx.com/oauth/token'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// CORS headers - Permitir todas las origins (incluyendo ngrok)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validaciones basicas
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!STOCKX_CLIENT_ID || !STOCKX_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: 'StockX no está configurado correctamente (CLIENT_ID o CLIENT_SECRET faltante)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Leer refresh_token desde la tabla stockx_credentials
    const { data: creds, error: credsError } = await supabase
      .from('stockx_credentials')
      .select('id, refresh_token')
      .limit(1)
      .maybeSingle()

    if (credsError || !creds) {
      return new Response(
        JSON.stringify({ error: 'No se pudieron cargar las credenciales de stockx', details: credsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const refreshToken = creds.refresh_token
    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: 'No hay refresh_token almacenado para StockX' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // LLAMADA A STOCKX PARA RENOVAR EL TOKEN con grant_type=refresh_token
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: STOCKX_CLIENT_ID,
      client_secret: STOCKX_CLIENT_SECRET,
      audience: 'gateway.stockx.com',
      refresh_token: refreshToken,
    })

    const response = await fetch(STOCKX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Error de StockX al renovar token', details: data }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const newAccessToken = data.access_token
    const expiresIn = data.expires_in // 43200 segundos (12 horas) segun la doc de Stockx
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // ACTUALIZAR LA TABLA stockx_credentials CON EL NUEVO access_token Y expires_at
    const { error: updateError } = await supabase
      .from('stockx_credentials')
      .update({
        access_token: newAccessToken,
        token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', creds.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Error al actualizar access_token en la base de datos', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({
        message: 'access_token renovado exitosamente',
        access_token: newAccessToken,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error inesperado en refresh-stockx-token', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

// Devuelve la imagen real de una sneaker a partir de su urlKey de StockX.
// La API oficial de StockX no da imágenes: se pide a KicksDB y se guarda en la tabla sneaker_images,
// así cada producto gasta como mucho una petición de la cuota de KicksDB.
// El frontend solo la llama cuando ninguna de las URLs deducidas carga.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
}

// Si KicksDB no tenía imagen, no se vuelve a preguntar hasta pasados estos días
const DIAS_REINTENTO_SIN_IMAGEN = 7

const responder = (body: unknown, status: number, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
  })

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { searchParams } = new URL(req.url)
  const urlKey = (searchParams.get("urlKey") ?? "").toLowerCase()

  // Un urlKey de StockX solo lleva letras, números y guiones
  if (!/^[a-z0-9][a-z0-9-]{0,199}$/.test(urlKey)) {
    return responder({ error: "Falta el parámetro 'urlKey' o no es válido." }, 400)
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  const KICKSDB_API_KEY = Deno.env.get("KICKSDB_API_KEY")

  if (!supabaseUrl || !serviceRoleKey || !KICKSDB_API_KEY) {
    console.error("--> [IMAGEN] Faltan variables de entorno")
    return responder({ error: "Configuración del servidor incompleta." }, 500)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  try {
    // Solo usuarios con sesión (no vale la anon key): cada imagen nueva gasta cuota de KicksDB
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "")
    const { data: userData, error: userError } = jwt
      ? await supabase.auth.getUser(jwt)
      : { data: null, error: null }

    if (userError || !userData?.user) {
      return responder({ error: "Sesión no válida." }, 401)
    }

    // 1. Mirar la caché
    const { data: guardada, error: cacheError } = await supabase
      .from("sneaker_images")
      .select("image_url, updated_at")
      .eq("url_key", urlKey)
      .maybeSingle()

    if (cacheError) {
      console.error("--> [IMAGEN] Error leyendo la caché:", cacheError.message)
    }

    if (guardada) {
      const diasGuardada = (Date.now() - new Date(guardada.updated_at).getTime()) / (24 * 60 * 60 * 1000)

      if (guardada.image_url) {
        return responder({ image: guardada.image_url }, 200, { "Cache-Control": "private, max-age=86400" })
      }

      if (diasGuardada < DIAS_REINTENTO_SIN_IMAGEN) {
        return responder({ image: null }, 200)
      }
    }

    // 2. Pedirla a KicksDB (mismo endpoint que usa get-stockx-prices)
    const kicksResponse = await fetch(`https://api.kicks.dev/v3/stockx/products/${encodeURIComponent(urlKey)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KICKSDB_API_KEY}`,
      },
    })

    // Si KicksDB falla por otra cosa que no sea "no existe" (límite de peticiones, caída...) no se guarda nada
    if (!kicksResponse.ok && kicksResponse.status !== 404) {
      console.error(`--> [IMAGEN] KicksDB Error: ${kicksResponse.status}`)
      return responder({ image: null }, 200)
    }

    let image: string | null = null

    if (kicksResponse.ok) {
      const json = await kicksResponse.json()
      const posibleImagen = json.data?.image ?? json.data?.gallery?.[0]

      // KicksDB manda una miniatura (w=140): sin los parámetros el CDN devuelve la imagen a tamaño completo
      if (typeof posibleImagen === "string" && posibleImagen.startsWith("https://")) {
        image = posibleImagen.split("?")[0]
      }
    }

    // 3. Guardar el resultado (también cuando no hay imagen, para no repetir la petición)
    const { error: saveError } = await supabase
      .from("sneaker_images")
      .upsert({ url_key: urlKey, image_url: image, updated_at: new Date().toISOString() })

    if (saveError) {
      console.error("--> [IMAGEN] Error guardando en la caché:", saveError.message)
    }

    return responder({ image }, 200, image ? { "Cache-Control": "private, max-age=86400" } : {})

  } catch (error) {
    console.error("--> [IMAGEN] Error CRÍTICO:", error)
    return responder({ error: "Error interno" }, 500)
  }
})

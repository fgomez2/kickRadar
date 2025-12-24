import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { getStockxAccessToken } from "../_shared/stockx.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Falta el parámetro 'id' del producto." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }

  const apiKey = Deno.env.get("STOCKX_API_KEY")
  
  // Obtener el token de acceso CON LA FUNCIÓN CREADA
  let accessToken: string

  try {
    accessToken = await getStockxAccessToken()
  } catch (e) {
    console.error(e)
    return new Response(
      JSON.stringify({ error: "No se pudo obtener el token de acceso de StockX." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, },
    )
  }

  if (!apiKey || !accessToken) {
    return new Response(
      JSON.stringify({ error: "Credenciales de StockX no configuradas." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, },
    )
  }

  const stockxUrl = `https://api.stockx.com/v2/catalog/products/${encodeURIComponent(id)}`

  try {
    const response = await fetch(stockxUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const body = await response.text()

    return new Response(body, {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error llamando a StockX:", error)
    return new Response(
      JSON.stringify({ error: "Error al comunicarse con la API de StockX." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, },
    )
  }
})
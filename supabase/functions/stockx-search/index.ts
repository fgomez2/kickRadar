import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

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
  const query = searchParams.get("query")

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Falta el parámetro de consulta 'query'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }

  const apiKey = Deno.env.get("STOCKX_API_KEY")
  const accessToken = Deno.env.get("STOCKX_ACCESS_TOKEN")

  if (!apiKey || !accessToken) {
    return new Response(
      JSON.stringify({ error: "Credenciales de StockX no configuradas." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }, },
    )
  }

  const stockxUrl = `https://api.stockx.com/v2/catalog/search` + `?query=${encodeURIComponent(query)}` + `&productCategory=sneakers&pageNumber=1&pageSize=15`

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
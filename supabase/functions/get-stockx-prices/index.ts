import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS", // <--- CAMBIO IMPORTANTE: Aceptamos POST
}

// Comentario ARREGLAR GITHUB
serve(async (req: Request): Promise<Response> => {
  // 1. Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // 2. LEER DATOS (CAMBIO A POST/JSON)
    // En lugar de leer la URL, leemos el cuerpo del mensaje
    const { urlKey } = await req.json()

    // Log para depurar en el dashboard de Supabase
    console.log(`--> Petición recibida para: ${urlKey}`)

    if (!urlKey) {
      return new Response(
        JSON.stringify({ error: "Falta el parámetro 'urlKey' en el body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const KICKSDB_API_KEY = Deno.env.get("KICKSDB_API_KEY")
    const apiUrl = `https://api.kicks.dev/stockx/products/${encodeURIComponent(urlKey)}?currency=EUR`
    
    // Llamada a KicksDB
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KICKSDB_API_KEY ?? "",
      },
    })

    if (!response.ok) {
        console.error(`--> KicksDB Error: ${response.status}`)
        // Devolvemos array vacío si no se encuentra, para no romper el front
        return new Response(JSON.stringify([]), {
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }

    const data = await response.json()
    const variants = data.variants || [];

    const cleanPrices = variants.map((variant: any) => {
        const askPrice = variant.market?.lowestAsk || variant.market?.bidAskData?.lowestAsk || null;
        const sizeValue = variant.size || variant.traits?.size;
        return {
          id: variant.id,
          size: sizeValue,
          price: askPrice,
          formattedPrice: askPrice ? `${askPrice} €` : 'No Ask',
          link: `https://stockx.com/${urlKey}?size=${sizeValue}`
        }
    }).filter((i: any) => i.price !== null);

    // Ordenar tallas numéricamente
    cleanPrices.sort((a: any, b: any) => parseFloat(a.size) - parseFloat(b.size));

    return new Response(JSON.stringify(cleanPrices), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("--> Error CRÍTICO:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Error interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
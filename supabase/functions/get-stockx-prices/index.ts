import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req: Request): Promise<Response> => {
  // Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { urlKey } = await req.json()

    console.log(`--> Petición recibida para: ${urlKey}`)

    if (!urlKey) {
      return new Response(
        JSON.stringify({ error: "Falta el parámetro 'urlKey' en el body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const KICKSDB_API_KEY = Deno.env.get("KICKSDB_API_KEY")

    // usamos el urlKey (slug) directo en la ruta
    const apiUrl = `https://api.kicks.dev/v3/stockx/products/${encodeURIComponent(urlKey)}?display[variants]=true`
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AUTH CORRECTA
        "Authorization": `Bearer ${KICKSDB_API_KEY ?? ""}`,
      },
    })

    if (!response.ok) {
        console.error(`--> KicksDB Error: ${response.status}`)
        return new Response(JSON.stringify([]), {
            status: 200, // Devolvemos 200 con array vacío para no romper el front (por si)
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }

    const jsonResponse = await response.json()
    
    // EXTRACCIÓN DE DATOS
    const variants = jsonResponse.data?.variants || [];

    const cleanPrices = variants.map((variant: any) => {
        const askPrice = variant.lowest_ask; 
        const euVariant = variant.sizes?.find((s: any) => s.type === 'eu')

        const displaySize = euVariant ? euVariant.size.replace('EU ', '') : variant.size


        return {
          id: variant.id,
          size: displaySize,
          price: askPrice,
          formattedPrice: askPrice ? `${askPrice} $` : 'No Ask', // Sale en dólares solo tengo la versión Free de KICKSDB
          // link directo a la talla en StockX
          link: `https://stockx.com/${urlKey}?size=${variant.size}`
        }
    })
    // filtramos los que no tienen precio (lowest_ask puede ser null o 0)
    .filter((i: any) => i.price !== null && i.price > 0);

    // ORDENAR TALLAS: 38, 39, ...
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
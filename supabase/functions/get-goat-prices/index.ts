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
    const { sku } = await req.json()
    const KICKSDB_API_KEY = Deno.env.get("KICKSDB_API_KEY")

    console.log(`--> [GOAT] Iniciando proceso para SKU: ${sku}`)

    if (!sku) {
      return new Response(
        JSON.stringify({ error: "Falta el parámetro 'sku' en el body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }


    // Buscar el producto por sku
    const searchUrl = `https://api.kicks.dev/v3/goat/products?query=${encodeURIComponent(sku)}`
    
    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AUTH CORRECTA
        "Authorization": `Bearer ${KICKSDB_API_KEY ?? ""}`,
      },
    })

    if (!searchResponse.ok) {
        console.error(`--> [GOAT KICKSDB] Error: ${searchResponse.status}`)
        return new Response(JSON.stringify([]), {
          status: 200, // Devolvemos 200 con array vacío para no romper el front (por si)
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }

    const searchData = await searchResponse.json()
    const goatProducts = searchData.data || []
    
    // EXTRACCIÓN DE DATOS
    const targetProduct = goatProducts.find((p: any) => p.sku && p.sku.toUpperCase() === sku.toUpperCase())

    if (!targetProduct || !targetProduct.slug) {
      console.log(`--> [GOAT KICKSDB] No se encontró ningún producto con SKU exacto: ${sku}`)
      return new Response(JSON.stringify([]), {
        status: 200, // Devolvemos 200 con array vacío para no romper el front (por si)
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const slug = targetProduct.slug
    console.log(`--> [GOAT KICKSDB] Producto exacto encontrado: ${slug} (SKU: ${targetProduct.sku})`)

    // Obtener precios (variants) usando el SLUG
    const detailUrl = `https://api.kicks.dev/v3/goat/products/${slug}`

    const detailRes = await fetch(detailUrl, {
      headers: {
        "Content-Type": "application/json",
        // AUTH CORRECTA
        "Authorization": `Bearer ${KICKSDB_API_KEY ?? ""}`,
      },
    })

    if (!detailRes.ok) {
      console.error(`--> [GOAT] Error detalle: ${detailRes.status}`)
      return new Response(JSON.stringify([]), {
        status: 200, // Devolvemos 200 con array vacío para no romper el front (por si)
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const detailResponse = await detailRes.json()

    const variants = detailResponse.data?.variants || []

    const cleanPrices = variants.map((v: any) => {
      const askPrice = v.lowest_ask
      const sizeValue = v.size

      return {
        id: `goat-${v.product_id}-${sizeValue}`,
        size: sizeValue,
        price: askPrice,
        formattedPrice: `${askPrice} $`,
        link: `https://www.goat.com/sneakers/${slug}`,
        market: 'GOAT'
      }
    })
    .filter((i: any) => i.price !== null && i.price > 0)

    // Ordenar tallas de menor a mayor
    cleanPrices.sort((a: any, b: any) => parseFloat(a.size) - parseFloat(b.size))

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
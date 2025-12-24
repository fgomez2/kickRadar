import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

type StockxCredentials = {
    access_token: string
    token_expires_at: string
}

export async function getStockxAccessToken(): Promise<string> {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("No hay credenciales de Supabase configuradas.")
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
    })

    const { data, error } = await supabase
        .from("stockx_credentials")
        .select("access_token, token_expires_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle<StockxCredentials>()

    if (error || !data?.access_token ) {
        throw new Error(`No se pudo obtener el token de acceso de StockX: ${error?.message ?? "sin datos"}`)
    }

    return data.access_token
}
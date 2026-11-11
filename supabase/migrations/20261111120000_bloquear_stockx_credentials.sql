-- stockx_credentials guarda los tokens OAuth de la cuenta de StockX de la app.
-- Solo deben leerla y escribirla las Edge Functions, que usan service_role.
-- Se quitan los permisos de anon y authenticated para que ningún cliente pueda leerla ni escribirla,
-- haya las políticas RLS que haya.

DO $$
BEGIN
    -- La tabla se creó desde el dashboard, así que puede no existir en una base de datos local nueva
    IF to_regclass('public.stockx_credentials') IS NOT NULL THEN
        ALTER TABLE public.stockx_credentials ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE public.stockx_credentials FROM anon, authenticated;
    END IF;
END
$$;

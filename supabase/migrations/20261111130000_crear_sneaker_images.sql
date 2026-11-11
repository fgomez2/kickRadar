-- Caché de la imagen real de cada sneaker (la da KicksDB), para pedirla una sola vez por producto
-- y no gastar cuota en cada visita. Solo la usan las Edge Functions (service_role).

CREATE TABLE IF NOT EXISTS public.sneaker_images (
    url_key text PRIMARY KEY,
    image_url text, -- null = KicksDB no tenía imagen; se vuelve a intentar pasados unos días
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sneaker_images ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.sneaker_images FROM anon, authenticated;

COMMENT ON TABLE public.sneaker_images IS 'Caché de imágenes de sneakers obtenidas de KicksDB. Acceso solo desde Edge Functions.';

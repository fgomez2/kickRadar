export default function TablaPrecios({ precios, cargando }) {
  
  // URL DEL LOGO DE STOCKX
  const LOGO_STOCKX = "https://wzpboxncvwarmgnjqyfm.supabase.co/storage/v1/object/public/logos/stockx_logo.svg"

  // URL DEL LOGO DE GOAT
  const LOGO_GOAT = "https://wzpboxncvwarmgnjqyfm.supabase.co/storage/v1/object/public/logos/goat_logo.png"

  if (cargando) {
    return <div className="text-green-400 animate-pulse">Cargando mejores precios...</div>;
  }

  if (!precios || precios.length === 0) {
    return <div className="text-gray-500">No hay información de precios disponible.</div>;
  }

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Mejores precios</h3>

      {/* Fila para StockX */}
      <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start min-w-[120px]">
            <img src={LOGO_STOCKX} alt="StockX Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Grid tallas */}
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 w-full custom-scrollbar">
          {precios.map((item) => (
            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center min-w-[85px] px-2 h-[60px] border border-gray-200 rounded hover:bg-green-50 hover:border-green-500 transition cursor-pointer text-black"
            >
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">EUR {item.size}</span>
              <span className="text-sm font-bold">{item.formattedPrice}</span>
            </a>
          ))}
        </div>

        {/* Botón de visitar página */}
        <a href={precios[0]?.link} target="_blank" rel="noreferrer" 
            className="px-6 py-2 rounded-full border border-gray-300 text-black font-semibold hover:bg-gray-100 transition whitespace-nowrap"
        >
          Visitar página
        </a>
      </div>

      {/* Fila para GOAT */}
    </div>
  );
}
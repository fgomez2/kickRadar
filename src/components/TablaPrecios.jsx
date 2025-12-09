export default function TablaPrecios({ precios, cargando }) {
  
  // URL DE LOS LOGOS
  const LOGO_STOCKX = "https://wzpboxncvwarmgnjqyfm.supabase.co/storage/v1/object/public/logos/stockx_logo.svg"
  const LOGO_GOAT = "https://wzpboxncvwarmgnjqyfm.supabase.co/storage/v1/object/public/logos/goat_logo.png"

  if (cargando) {
    return <div className="text-green-400 animate-pulse">Cargando mejores precios...</div>
  }

  // Extraer datos
  const stockxData = precios?.stockx || []
  const goatData = precios?.goat || []
  const hayDatos = stockxData.length > 0 || goatData.length > 0

  if (!precios && !cargando) return null

  if (!hayDatos) {
    return <div className="text-gray-500">No hay información de precios disponible.</div>
  }

  // Subcomponente
  const FilaMercado = ({ logo, data, esStockX }) => {
    const sinStock = data.length === 0

    return (
      <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-4 shadow-sm border border-transparent hover:border-gray-100 transition-all">
        
        {/* Columna Logo */}
        <div className="flex items-center justify-center md:justify-start min-w-[120px]">
            <img src={logo} alt="Market Logo" className={`h-8 w-auto object-contain ${!esStockX ? 'brightness-0 opacity-80' : ''}`} // Ajuste visual para unificar estilos
            />
        </div>

        {/* Scroll Horizontal de Tallas */}
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 w-full custom-scrollbar">
          {!sinStock ? (
            data.map((item) => (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center min-w-[85px] px-2 h-[60px]
                  border border-gray-200 rounded transition cursor-pointer text-black group hover:bg-gray-50
                  ${esStockX ? 'hover:border-green-500' : 'hover:border-black'} 
                `}
              >
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap group-hover:text-gray-700">
                  {esStockX ? 'EUR' : 'US'} {item.size}
                </span>
                <span className="text-sm font-bold">
                  {item.formattedPrice}
                </span>
              </a>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[60px] text-gray-400 text-sm italic border border-dashed border-gray-200 rounded bg-gray-50">
              Sin stock disponible
            </div>
          )}
        </div>

        {/* Botón de acción */}
        {!sinStock && (
          <a href={data[0]?.link} target="_blank" rel="noreferrer" className={`px-6 py-2 rounded-full border border-gray-300 text-black font-semibold transition whitespace-nowrap text-sm
              ${esStockX ? 'hover:bg-green-50 hover:text-green-700 hover:border-green-200' : 'hover:bg-gray-100 hover:text-black hover:border-gray-400'}`}
          >
            Ver Web
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Comparador de precios</h3>
      
      {/* Fila StockX */}
      <FilaMercado logo={LOGO_STOCKX} data={stockxData} esStockX={true} />
      
      {/* Fila GOAT */}
      <FilaMercado logo={LOGO_GOAT} data={goatData} esStockX={false} />
    </div>
  )
}
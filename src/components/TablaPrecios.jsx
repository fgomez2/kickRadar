export default function TablaPrecios({ precios, cargando }) {
  
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
        
        {/* Logo / Nombre */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="font-bold text-green-600 text-lg">StockX</span>
        </div>

        {/* Grid de Tallas */}
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 w-full custom-scrollbar">
          {precios.map((item) => (
            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center min-w-[60px] h-[60px] border border-gray-200 rounded hover:bg-green-50 hover:border-green-500 transition cursor-pointer text-black"
            >
              <span className="text-xs text-gray-500 font-medium">US {item.size}</span>
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
    </div>
  );
}
// LÓGICA DE CONVERSIÓN ZAPATILLAS
const convertirUsAEur = (usSize, brand) => {
  const b = brand?.toLowerCase() || ''
  const esAdidas = b.includes('adidas') || b.includes('yeezy')

  // Tabla de conversión APROXIMADAAA!
  // La clave sera: TALLA US
  // El valor sera: [Talla Nike/Jordan, Adidas]
  const tablaConversion = {
    '3.5': ['35.5', '36'],
    '4':   ['36', '36 2/3'],
    '4.5': ['36.5', '37 1/3'],
    '5':   ['37.5', '38'],
    '5.5': ['38', '38 2/3'],
    '6':   ['38.5', '39 1/3'],
    '6.5': ['39', '40'],
    '7':   ['40', '40 2/3'],
    '7.5': ['40.5', '41 1/3'],
    '8':   ['41', '42'],
    '8.5': ['42', '42 2/3'],
    '9':   ['42.5', '43 1/3'],
    '9.5': ['43', '44'],
    '10':  ['44', '44 2/3'],
    '10.5':['44.5', '45 1/3'],
    '11':  ['45', '46'],
    '11.5':['45.5', '46 2/3'],
    '12':  ['46', '47 1/3'],
    '12.5':['47', '48'],
    '13':  ['47.5', '48 2/3'],
    '13.5':['48', '49 1/3'],
    '14':  ['48.5', '50'],
    '15':  ['49.5', '51 1/3'],
    '16':  ['50.5', '52 2/3'],
    '17':  ['51.5', '53 1/3'],
  }

  if (tablaConversion[usSize]) {
    // Si es Adidas devuelve el segundo valor, si no el primero
    return esAdidas ? tablaConversion[usSize][1] : tablaConversion[usSize][0]
  }

  return usSize
}

// Subcomponente
const FilaMercado = ({ logo, data, esStockX, marca, convertirUsAEur }) => {
  const sinStock = data.length === 0

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-4 shadow-sm border border-transparent hover:border-gray-100 transition-all">
      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start min-w-[120px]">
          <img src={logo} alt="Market Logo" className={`h-8 w-auto object-contain ${!esStockX ? 'brightness-0 opacity-80' : ''}`} // Ajuste visual para unificar estilos
          />
      </div>

      {/* Grid de tallas */}
      <div className="flex-1 flex gap-2 overflow-x-auto pb-2 w-full custom-scrollbar">
        {!sinStock ? (
          data.map((item) => {

            const tallaMostrar = esStockX ? item.size : convertirUsAEur(item.size, marca)

            return(
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center min-w-[85px] px-2 h-[60px]
                  border border-gray-200 rounded transition cursor-pointer text-black group hover:bg-gray-50
                  ${esStockX ? 'hover:border-green-500' : 'hover:border-black'} 
                `}
              >
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap group-hover:text-gray-700">
                  EUR {tallaMostrar} {/* SIEMPRE VA A SER LA TALLA EN EUR */}
                </span>
                <span className="text-sm font-bold">
                  {item.formattedPrice}
                </span>
              </a>
            )
          })
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
          Ver página
        </a>
      )}
    </div>
  )
}

export default function TablaPrecios({ precios, cargando, marca }) {
  
  // URL DE LOS LOGOS
  const LOGO_STOCKX = "https://wzpboxncvwarmgnjqyfm.supabase.co/storage/v1/object/public/logos/stockx_logo.svg"
  const LOGO_GOAT = "https://wzpboxncvwarmgnjqyfm.supabase.co/storage/v1/object/public/logos/goat_logo.svg"


  
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

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Encuentra el mejor precio aquí:</h3>
      
      {/* Fila StockX */}
      <FilaMercado logo={LOGO_STOCKX} data={stockxData} esStockX={true} marca={marca} convertirUsAEur={convertirUsAEur} />
      
      {/* Fila GOAT */}
      <FilaMercado logo={LOGO_GOAT} data={goatData} esStockX={false} marca={marca} convertirUsAEur={convertirUsAEur} />
    </div>
  )
}
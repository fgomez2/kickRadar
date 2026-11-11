// Páginas que se muestran: la primera, la última y las cercanas a la actual. null marca un salto (…)
const paginasVisibles = (actual, total) => {
    const paginas = [...new Set([1, actual - 1, actual, actual + 1, total])]
        .filter((p) => p >= 1 && p <= total)
        .sort((a, b) => a - b)

    return paginas.flatMap((p, i) => (i > 0 && p - paginas[i - 1] > 1 ? [null, p] : [p]))
}

export default function Paginacion({ pagina, totalPaginas, hayMas, onCambiar }) {
    const hayAnterior = pagina > 1
    const haySiguiente = hayMas || (totalPaginas !== null && pagina < totalPaginas)

    if (!hayAnterior && !haySiguiente) return null

    const estiloBase = 'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-full border text-sm font-semibold transition-all duration-300'
    const estiloBoton = `${estiloBase} border-gray-700 text-gray-300 cursor-pointer hover:border-green-400 hover:text-green-400
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:text-gray-300`
    const estiloActual = `${estiloBase} border-green-400 bg-green-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]`

    return (
        <nav aria-label="Páginas de resultados" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button type="button" disabled={!hayAnterior} className={estiloBoton}
                // Si la página pedida no existe, "Anterior" lleva a la última que sí
                onClick={() => onCambiar(Math.min(pagina - 1, totalPaginas ?? pagina - 1))}
            >
                Anterior
            </button>

            {totalPaginas !== null && paginasVisibles(pagina, totalPaginas).map((p, i) => {
                if (p === null) {
                    return <span key={`salto-${i}`} className="px-1 text-gray-500 select-none">…</span>
                }

                if (p === pagina) {
                    return <span key={p} aria-current="page" className={estiloActual}>{p}</span>
                }

                return (
                    <button key={p} type="button" aria-label={`Página ${p}`} onClick={() => onCambiar(p)} className={estiloBoton}>
                        {p}
                    </button>
                )
            })}

            <button type="button" disabled={!haySiguiente} onClick={() => onCambiar(pagina + 1)} className={estiloBoton}>
                Siguiente
            </button>
        </nav>
    )
}

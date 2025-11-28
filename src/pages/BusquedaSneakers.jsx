import KickHeader from "../components/KickHeader"
import { useParams } from "react-router-dom"

export default function BusquedaSneakers() {

    const { busqueda } = useParams()

    return (
        <>
            <KickHeader />
            <main className="min-h-screen bg-black text-white pt-6 px-4">
                <h1 className="text-2xl font-bold mb-4">Resultados para: <span className="text-green-400">"{busqueda}"</span></h1>

                {/* AQUÍ IRA EL GRID DE RESULTADOS MÁS ADELANTE */}
            </main>
        </>
    )
}
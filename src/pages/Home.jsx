import KickHeader from "../components/KickHeader"
import KickMain from "../components/KickMain"
import KickFooter from "../components/KickFooter"

export default function Home() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <KickHeader />
                <KickMain />
                <KickFooter />
            </div>
        </>
    )
}

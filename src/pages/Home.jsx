import { useRef } from 'react'
import KickHeader from "../components/KickHeader"
import KickMain from "../components/KickMain"
import KickFooter from "../components/KickFooter"

export default function Home() {
    const searchInputRef = useRef(null)

    const handleEmpiezaYaClick = () => {
        if (searchInputRef.current) {
            // Hacer scroll suave hacia el header
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            
            // Esperar a que termine el scroll y luego hacer focus
            setTimeout(() => {
                searchInputRef.current.focus()
            }, 500)
        }
    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <KickHeader ref={searchInputRef} />
                <KickMain onEmpiezaYaClick={handleEmpiezaYaClick} />
                <KickFooter />
            </div>
        </>
    )
}

import { useEffect, useRef } from 'react'
import KickHeader from '../components/KickHeader'
import KickFooter from '../components/KickFooter'

export default function QuienesSomos() {
    const headerRef = useRef(null)

    useEffect(() => {
        document.title = 'Quiénes somos - KickRadar'
        headerRef.current?.focus()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-gray-900 flex flex-col">
            <KickHeader ref={headerRef} />

            <main className="flex-grow">
                <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-10">
                    <div className="text-center space-y-4">
                        <p className="text-xl uppercase tracking-[0.3em] text-emerald-300">Quiénes somos</p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                            Hola, soy Fernando Gómez
                        </h1>
                        <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg">
                            Desarrollador web junior. Esta app web es mi proyecto final del grado superior de Desarrollo de Aplicaciones Web y reúne lo que he
                            aprendido siguiendo tutoriales, construyendo proyectos y probando ideas. Mi siguiente paso es aprender Next.js y llevar kickRadar mas lejos.
                        </p>
                    </div>

                    <div className="grid gap-6 md:gap-8 md:grid-cols-2 justify-items-center">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Próximo paso</p>
                            <h2 className="mt-3 text-xl font-semibold text-white">Next.js</h2>
                            <p className="mt-3 text-sm text-gray-300">
                                Quiero aprender SSR, rutas estáticas y optimización con Next.js para llevar mis
                                proyectos a otro nivel con mejores prácticas.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Sobre KickRadar</p>
                            <h2 className="mt-3 text-xl font-semibold text-white">TFG</h2>
                            <p className="mt-3 text-sm text-gray-300">
                                KickRadar nació como mi proyecto de fin de grado: una web  que actúa de comparador/rastreador de sneakers donde aplico lo
                                aprendido, pruebo integraciones y cuido la experiencia de usuario.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent p-8 text-center">
                        <h3 className="text-2xl font-semibold text-white">Hablemos</h3>
                        <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
                            Si quieres colaborar conmigo o compartir recursos para seguir mejorando, escríbeme.
                            Me encanta aprender de la comunidad.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <a href="mailto:fergg424@gmail.com" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                Escríbeme
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <KickFooter />
        </div>
    )
}

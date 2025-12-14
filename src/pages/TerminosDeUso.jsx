import { useEffect, useRef } from 'react'
import KickHeader from '../components/KickHeader'
import KickFooter from '../components/KickFooter'

export default function TerminosDeUso() {
    const headerRef = useRef(null)

    useEffect(() => {
        document.title = 'Términos de Uso - KickRadar'
        headerRef.current?.focus()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
            <KickHeader ref={headerRef} />

            <main className="flex-grow">
                <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-10">
                    <div className="text-center space-y-4">
                        <p className="text-xl uppercase tracking-[0.3em] text-emerald-300">Legal</p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                            Términos de Uso
                        </h1>
                        <p className="text-gray-400 max-w-3xl mx-auto text-base sm:text-lg">
                            Última actualización: 12 de diciembre de 2025
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Introducción */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Introducción</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Bienvenido a kickRadar. Al acceder y utilizar este sitio web, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. 
                                Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestro servicio. Estos términos son esenciales para 
                                proteger tanto tus derechos como los nuestros mientras utilizas kickRadar.
                            </p>
                        </div>

                        {/* Acceso y uso del sitio */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Acceso y uso del sitio</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>
                                    kickRadar te proporciona acceso a una plataforma para buscar, comparar y rastrear precios de sneakers. Al utilizar nuestro servicio:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Debes tener al menos 13 años de edad para crear una cuenta</li>
                                    <li>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña</li>
                                    <li>No debes usar el sitio para actividades ilegales o no autorizadas</li>
                                    <li>No debes intentar acceder a áreas no autorizadas del sistema</li>
                                    <li>Te reservamos el derecho de suspender o cancelar tu acceso en caso de incumplimiento</li>
                                </ul>
                            </div>
                        </div>

                        {/* Derechos de propiedad intelectual */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">3. Derechos de Propiedad Intelectual</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Todo el contenido presente en kickRadar, incluyendo pero no limitado a textos, gráficos, logos, iconos, imágenes, clips de audio, 
                                descargas digitales y compilaciones de datos, es propiedad de kickRadar o de sus proveedores de contenido y está protegido por las leyes 
                                de propiedad intelectual españolas e internacionales. El diseño, estructura y organización del sitio también están protegidos. 
                                No está permitida la reproducción, distribución o modificación del contenido sin autorización expresa por escrito.
                            </p>
                        </div>

                        {/* Responsabilidad del usuario */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Responsabilidad del usuario</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>Como usuario de kickRadar, te comprometes a:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Proporcionar información veraz y actualizada al crear tu cuenta</li>
                                    <li>No infringir los derechos de propiedad intelectual de terceros</li>
                                    <li>No utilizar la plataforma para transmitir virus, malware o cualquier código malicioso</li>
                                    <li>No realizar scraping automatizado o recopilación masiva de datos sin autorización</li>
                                    <li>No hacerse pasar por otra persona o entidad</li>
                                    <li>No interferir con el correcto funcionamiento del sitio</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contenido generado por el usuario */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Contenido generado por el usuario</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Actualmente, kickRadar permite a los usuarios crear listas de favoritos. Al guardar contenido en tu cuenta:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-gray-300">
                                <li>Mantienes la propiedad de tus listas personales</li>
                                <li>Nos otorgas una licencia para almacenar y mostrar este contenido en tu cuenta</li>
                                <li>Eres responsable del contenido que guardes</li>
                                <li>No debes guardar contenido ofensivo, ilegal o que infrinja derechos de terceros</li>
                            </ul>
                        </div>

                        {/* Exclusión de responsabilidad */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Exclusión de Responsabilidad</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>
                                    kickRadar se proporciona "tal cual" y "según disponibilidad". No garantizamos que:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>El servicio será ininterrumpido, seguro o libre de errores</li>
                                    <li>Los precios mostrados sean siempre precisos o estén actualizados en tiempo real</li>
                                    <li>Los enlaces a sitios externos funcionen correctamente</li>
                                    <li>El sitio esté disponible en todo momento</li>
                                </ul>
                                <p className="mt-4">
                                    No somos responsables de ningún daño directo, indirecto, incidental o consecuente que resulte del uso o la imposibilidad de uso de nuestro servicio.
                                    kickRadar es un comparador de precios y no somos vendedores de los productos mostrados.
                                </p>
                            </div>
                        </div>

                        {/* Modificaciones de los Términos */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Modificaciones de los Términos</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Nos reservamos el derecho de modificar estos términos de uso en cualquier momento. Las modificaciones entrarán en vigor inmediatamente 
                                después de su publicación en el sitio web. Te notificaremos sobre cambios significativos mediante un aviso en la página principal o 
                                por correo electrónico. Tu uso continuado del sitio después de dichos cambios constituye tu aceptación de los nuevos términos. 
                                Te recomendamos revisar periódicamente esta página para estar al tanto de cualquier actualización.
                            </p>
                        </div>

                        {/* Ley aplicable y jurisdicción */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Ley Aplicable y Jurisdicción</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Estos términos de uso se rigen por las leyes de España. Cualquier disputa relacionada con estos términos o con el uso de kickRadar 
                                será sometida a la jurisdicción exclusiva de los tribunales de España. Al utilizar este sitio, aceptas someterte a la jurisdicción 
                                de estos tribunales.
                            </p>
                        </div>

                        {/* Contacto */}
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent p-8 text-center">
                            <h3 className="text-2xl font-semibold text-white">¿Preguntas sobre los Términos de Uso?</h3>
                            <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
                                Si tienes alguna pregunta sobre estos términos de uso, no dudes en contactarnos.
                            </p>
                            <div className="mt-6 flex justify-center">
                                <a href="mailto:fergg424@gmail.com" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-400 hover:bg-green-500 text-white text-lg font-semibold transition-all duration-300 
                                    shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_35px_rgba(34,197,94,0.9)] hover:scale-105 active:scale-95 transform hover:-translate-y-1">
                                    Contactar
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <KickFooter />
        </div>
    )
}

import { useEffect, useRef } from 'react'
import KickHeader from '../components/KickHeader'
import KickFooter from '../components/KickFooter'

export default function PoliticaDePrivacidad() {
    const headerRef = useRef(null)

    useEffect(() => {
        document.title = 'Política de Privacidad - KickRadar'
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
                            Política de Privacidad
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
                                En kickRadar, nos tomamos muy en serio tu privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, 
                                almacenamos y protegemos tu información personal cuando utilizas nuestro sitio web. Al usar kickRadar, aceptas las prácticas 
                                descritas en esta política. Nos comprometemos a ser transparentes sobre cómo manejamos tus datos y a cumplir con el Reglamento 
                                General de Protección de Datos (RGPD) de la Unión Europea y otras leyes de privacidad aplicables.
                            </p>
                        </div>

                        {/* Información que recogemos */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Información que recogemos</h2>
                            <div className="text-gray-300 leading-relaxed space-y-4">
                                <p>Recopilamos diferentes tipos de información cuando utilizas kickRadar:</p>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">Información de cuenta:</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Correo electrónico</li>
                                        <li>Nombre completo (opcional)</li>
                                        <li>Contraseña (almacenada de forma encriptada)</li>
                                        <li>Avatar personalizado (predeterminados)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">Información de uso:</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Sneakers guardadas en favoritos</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">Cookies y tecnologías similares:</h3>
                                    <p className="ml-4">
                                        Utilizamos cookies esenciales para el funcionamiento del sitio, como mantener tu sesión activa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Uso de la información */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">3. Uso de la información</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>Utilizamos tu información personal para:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Proporcionar y mantener nuestro servicio de comparación de precios</li>
                                    <li>Gestionar tu cuenta y autenticación</li>
                                    <li>Guardar y sincronizar tus sneakers favoritos</li>
                                    <li>Personalizar tu experiencia en la plataforma</li>
                                    <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                                    <li>Comunicarnos contigo sobre actualizaciones importantes del servicio</li>
                                    <li>Proteger contra fraude y uso indebido</li>
                                    <li>Cumplir con obligaciones legales</li>
                                </ul>
                                <p className="mt-4">
                                    No utilizamos tu información personal para publicidad de terceros ni vendemos tus datos a otras empresas.
                                </p>
                            </div>
                        </div>

                        {/* Protección de la información */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Protección de la información</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>Implementamos múltiples medidas de seguridad para proteger tu información:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Encriptación SSL/TLS para todas las comunicaciones</li>
                                    <li>Contraseñas hasheadas con algoritmos seguros</li>
                                    <li>Bases de datos protegidas con autenticación y autorización</li>
                                    <li>Almacenamiento en servidores seguros con Supabase</li>
                                    <li>Acceso limitado a datos personales solo para personal autorizado</li>
                                    <li>Monitoreo regular de vulnerabilidades de seguridad</li>
                                </ul>
                                <p className="mt-4">
                                    Aunque tomamos todas las precauciones razonables, ningún método de transmisión por Internet es 100% seguro. 
                                    No podemos garantizar la seguridad absoluta de tu información.
                                </p>
                            </div>
                        </div>

                        {/* Compartir información con terceros */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Compartir información con terceros</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>Compartimos información limitada con los siguientes servicios esenciales:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Supabase:</strong> Proveedor de backend y base de datos (almacenamiento de cuentas y favoritos)</li>
                                    <li><strong>StockX y GOAT:</strong> APIs para obtener información de precios de sneakers</li>
                                </ul>
                                <p className="mt-4">
                                    Estos proveedores están obligados contractualmente a proteger tu información y solo pueden utilizarla para prestarnos servicios.
                                    No compartimos tu información personal con fines de marketing o publicidad de terceros.
                                </p>
                                <p className="mt-3">
                                    Podemos divulgar tu información si es requerido por ley, orden judicial o para proteger nuestros derechos legales.
                                </p>
                            </div>
                        </div>

                        {/* Derechos de los usuarios */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Derechos de los usuarios</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>Bajo el RGPD y otras leyes de privacidad, tienes los siguientes derechos:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Derecho de acceso:</strong> Puedes solicitar una copia de tus datos personales</li>
                                    <li><strong>Derecho de rectificación:</strong> Puedes actualizar tu información desde tu perfil</li>
                                    <li><strong>Derecho de supresión:</strong> Puedes eliminar tu cuenta en cualquier momento desde la configuración</li>
                                    <li><strong>Derecho de portabilidad:</strong> Puedes solicitar tus datos en un formato estructurado</li>
                                    <li><strong>Derecho de oposición:</strong> Puedes oponerte al procesamiento de tus datos</li>
                                    <li><strong>Derecho de limitación:</strong> Puedes solicitar la limitación del procesamiento</li>
                                </ul>
                                <p className="mt-4">
                                    Para ejercer cualquiera de estos derechos, contáctanos en fergg424@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* Cookies */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                            <div className="text-gray-300 leading-relaxed space-y-3">
                                <p>kickRadar utiliza cookies para mejorar tu experiencia:</p>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">Cookies esenciales:</h3>
                                    <p className="ml-4">Necesarias para el funcionamiento del sitio (autenticación, sesión). No pueden ser desactivadas.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">Gestión de cookies:</h3>
                                    <p className="ml-4">
                                        Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio. 
                                        La mayoría de los navegadores permiten gestionar las preferencias de cookies en su configuración.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cambios en la política */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Cambios en la Política</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales. 
                                Te notificaremos sobre cambios significativos mediante un aviso destacado en el sitio web o por correo electrónico. 
                                La fecha de "Última actualización" al inicio de esta política indica cuándo fue modificada por última vez. 
                                Te recomendamos revisar periódicamente esta página para mantenerte informado sobre cómo protegemos tu información.
                            </p>
                        </div>

                        {/* Contacto */}
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent p-8 text-center">
                            <h3 className="text-2xl font-semibold text-white">¿Preguntas sobre la Política de Privacidad?</h3>
                            <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
                                Si tienes alguna pregunta sobre cómo manejamos tu información personal, no dudes en contactarnos.
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

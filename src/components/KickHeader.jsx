import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import estilosHeader from './KickHeader.module.css'
import { useAuth } from '../modules/auth/AuthProvider'
import { supabase } from '../supabase-client'

const KickHeader = forwardRef((props, parentRef) => {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const desktopInputRef = useRef(null)
    const movilInputRef = useRef(null)
    const {estaAutenticado, usuario, perfil, cerrarSesion} = useAuth()

    const navigate = useNavigate()

    const handleBusqueda = (e) => {
        e.preventDefault()
        const sneakerBuscada = e.target.query.value.trim()
        
        if (!sneakerBuscada) return // No buscar si está vacío

        if (!estaAutenticado) {
            // Se dispara el evento de no logueado para mostrar modal (NO SE PUEDE HACER BÚSQUEDA SI NO ESTÁ LOGUEADO)
            window.dispatchEvent(new CustomEvent('mostrarModalLogin', { 
                detail: { busqueda: sneakerBuscada } 
            }))
        } else {
            // LÓGICA CUANDO SE IMPLEMENTE
            console.log('Búsqueda:', sneakerBuscada)
            navigate(`/sneakers/search/${encodeURIComponent(sneakerBuscada)}`)
        }
    }

    // obtener la URL del avatar
    const getAvatarUrl = () => {
        if (!perfil?.avatar_key) return null
        
        const { data } = supabase.storage.from('avatars').getPublicUrl(perfil.avatar_key)
        return data.publicUrl
    }

    const avatarUrl = getAvatarUrl()

    // hacer focus en el input visible
    useImperativeHandle(parentRef, () => ({
        focus: () => {
            // focus en desktop primero, luego en móvil
            if (desktopInputRef.current && window.innerWidth >= 1024) {
                desktopInputRef.current.focus()
            } else if (movilInputRef.current) {
                movilInputRef.current.focus()
            }
        }
    }))

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto)
    }

    return (
        <header className={`${estilosHeader.header} bg-black/95 backdrop-blur-sm py-3 sm:py-4 md:py-5 lg:py-8`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {/* <h1 className={`${estilosHeader.titulo} text-white text-2xl sm:text-3xl md:text-4xl font-bold`}>kickRadar</h1> */}
                    <span className={`${estilosHeader.titulo} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white`}>
                        kick<span className="text-green-400">Radar</span>
                    </span>
                    <img src="/images/logo_radar.png" alt="KickRadar Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 w-auto ml-2 sm:ml-3" />
                </Link>

                {/* Barra de busqueda - desktop */}
                <div id='barra_busqueda' className="hidden lg:block">
                    <form onSubmit={handleBusqueda} className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input ref={desktopInputRef} type="text" name="query" placeholder="Buscar sneaker..."
                            className={`${estilosHeader.barraBusqueda} bg-gray-900 border-2 border-green-400 text-white pl-10 pr-4 py-2 rounded-full 
                            shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] hover:border-green-300
                            focus:shadow-[0_0_20px_rgba(34,197,94,0.8)] focus:border-green-300 focus:outline-none placeholder-white/70 transition-all duration-300 w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]`}
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-green-400 shadow-[inset_0_0_10px_rgba(34,197,94,0.3)] pointer-events-none">
                        </div>
                    </form>
                </div>
                
                {/* Botones de autenticación - desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    {estaAutenticado ? (
                        // Hay sesión - Mostrar iconos de perfil y cerrar sesión
                        <>
                            {/* Botón de perfil */}
                            <Link to="/miPerfil">
                                <button className="group relative p-0.5 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 rounded-full
                                    transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:scale-110 active:scale-95"
                                    aria-label="Mi perfil" title={usuario?.email}
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-11 h-11 rounded-full object-cover border-2 border-gray-900"
                                        />
                                    ) : null}
                                    <div className={`w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </button>
                            </Link>

                            {/* Botón favoritos */}
                            <Link to="/misFavoritos">
                                <button className="group relative p-3 bg-gray-900 hover:bg-gray-800 border-2 border-green-400 
                                    hover:border-red-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] 
                                    hover:scale-110 active:scale-95"
                                    aria-label="Mis favoritos" title="Mis favoritos"
                                >
                                    <svg className="w-6 h-6 text-green-400 group-hover:text-red-500 transition-all duration-300 group-hover:fill-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>
                            </Link>

                            {/* Botón de cerrar sesión */}
                            <button onClick={cerrarSesion}
                                className="group relative p-3 bg-gray-900 hover:bg-red-900/20 border-2 border-green-400 hover:border-red-400 rounded-full transition-all duration-300 
                                shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:scale-110 active:scale-95"
                                aria-label="Cerrar sesión" title="Cerrar sesión"
                            >
                                <svg className="w-6 h-6 text-green-400 group-hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        // No hay sesión
                        <>
                            <Link to="/auth">
                                <button className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 
                                        shadow-[0_0_8px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transform hover:-translate-y-0.5">
                                    Login
                                </button>
                            </Link>
                            <Link to="/auth">
                                <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 
                                        shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] hover:scale-105 active:scale-95 transform hover:-translate-y-0.5">
                                    Regístrate
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Botón hamburguesa - móvil y tablet */}
                <button onClick={toggleMenu} className="lg:hidden text-white p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /> {/* Cambia de las tres rayas a la x si esta abierto o cerrado */}
                    </svg>
                </button>
            </div>

            {/* Barra de busqueda - móvil y tablet */}
            <div className="lg:hidden mt-3 sm:mt-4 flex justify-center px-6">
                <form onSubmit={handleBusqueda} className="relative w-full max-w-md">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input ref={movilInputRef} type="text" name="query" placeholder="Buscar sneaker..."
                        className={`${estilosHeader.barraBusqueda} bg-gray-900 border-2 border-green-400 text-white pl-10 pr-4 py-2 rounded-full 
                        shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] hover:border-green-300
                        focus:shadow-[0_0_20px_rgba(34,197,94,0.8)] focus:border-green-300 focus:outline-none placeholder-white/70 transition-all duration-300 w-full`}
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 shadow-[inset_0_0_10px_rgba(34,197,94,0.3)] pointer-events-none">
                    </div>
                </form>
            </div>

            {/* Menú desplegable */}
            {menuAbierto && (
                <div className="lg:hidden mt-3 sm:mt-4 mx-3 sm:mx-4 md:mx-6 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden animate-[slideDown_0.3s_ease-out]">
                    <div className="flex flex-col space-y-2 p-3 sm:p-4">
                        {estaAutenticado ? (
                            // Hay sesión - Mostrar perfil y cerrar sesión
                            <>
                                {/* Info del usuario */}
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg border border-green-400/30">
                                    <div className="p-0.5 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                                        {avatarUrl ? (
                                            <Link to="/miPerfil">
                                                <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-gray-900"
                                                />
                                            </Link>
                                        ) : null}
                                        <div className={`w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-400">Sesión iniciada</p>
                                        <p className="text-sm text-green-400 font-medium truncate">{usuario?.email}</p>
                                    </div>
                                </div>

                                {/* TO DO - BOTÓN MIS FAVORITOS */}
                                {/*         PARA MÓVIL          */}

                                {/* Botón cerrar sesión */}
                                <button onClick={cerrarSesion}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-red-900/20 
                                    text-green-400 hover:text-red-400 px-4 py-3 rounded-full text-base font-medium 
                                    transition-all duration-300 border-2 border-green-400 hover:border-red-400
                                    shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            // No hay sesión
                            <>
                                <Link to="/auth">
                                    <button className="w-full bg-white hover:bg-gray-100 text-black px-4 py-3 rounded-full text-base font-medium transition-all duration-300 
                                            shadow-[0_0_8px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transform hover:-translate-y-0.5">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/auth">
                                    <button className="w-full bg-green-400 hover:bg-green-500 text-white px-4 py-3 rounded-full text-base font-medium transition-all duration-300 
                                            shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] hover:scale-105 active:scale-95 transform hover:-translate-y-0.5">
                                        Regístrate
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
})

KickHeader.displayName = 'KickHeader'

export default KickHeader
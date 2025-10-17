import '@fontsource/dm-serif-display';
import estilosCarrusel from './CarruselMarcas.module.css';

export default function CarruselMarcas() {
    const logos = [
        { src: '/images/brands/logo_nike.svg', alt: 'Nike' },
        { src: '/images/brands/logo_jordan.svg', alt: 'Jordan' },
        { src: '/images/brands/logo_adidas.svg', alt: 'Adidas' },
        { src: '/images/brands/logo_nb.svg', alt: 'New Balance' },
        { src: '/images/brands/logo_asics.svg', alt: 'Asics' }
    ];

    return (
        <div className="relative z-10 w-full py-4 mt-2 sm:py-6 sm:mt-4 lg:py-8 lg:mt-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                <h2 className={`${estilosCarrusel.fraseCarrusel} text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-14 lg:mb-16 text-white`}>
                    Las marcas que definen el juego
                </h2>
                
                <div className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
                    
                    {/* Carrusel infinito */}
                    <div className={estilosCarrusel.primerosLogos}>
                        <div className={estilosCarrusel.primerosLogosContenido}>
                            {/* Primera serie de logos */}
                            {logos.map((logo, index) => (
                                <div key={`original-${index}`} className={estilosCarrusel.logoI}>
                                    <img src={logo.src} alt={logo.alt}
                                        className="h-16 sm:h-20 lg:h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                                    />
                                </div>
                            ))}
                            {/* Segunda serie de logos, efecto contnuo */}
                            {logos.map((logo, index) => (
                                <div key={`duplicate-${index}`} className={estilosCarrusel.logoI}>
                                    <img src={logo.src} alt={logo.alt}
                                        className="h-16 sm:h-20 lg:h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

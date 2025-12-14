# 👟 kickRadar

<div align="center">

![kickRadar Logo](public/images/logo_radar.png)

**Encuentra tus sneakers favoritas al mejor precio**

Explora. Compara. Acierta.

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E.svg)](https://supabase.com/)

</div>

---

## 📋 Descripción

**kickRadar** es una aplicación web moderna diseñada para los amantes de las sneakers. Permite buscar, comparar precios y rastrear zapatillas de diferentes marcas en tiempo real, integrando datos de múltiples marketplaces como **StockX** y **GOAT**.

Este proyecto fue desarrollado como **Trabajo Final de Grado** del ciclo superior de **Desarrollo de Aplicaciones Web**, demostrando la aplicación práctica de tecnologías web modernas y buenas prácticas de desarrollo.

### ✨ Características principales

- 🔍 **Búsqueda de zapatillas** - Busca sneakers de cualquier marca (Nike, Adidas, Jordan, New Balance, etc.)
- 💰 **Comparador de precios** - Encuentra el mejor precio entre múltiples tiendas en tiempo real
- 📊 **Base de datos actualizada** - Acceso a miles de sneakers con información actualizada diariamente
- ❤️ **Lista de favoritos** - Guarda y gestiona tus sneakers preferidas
- 👤 **Perfil de usuario** - Autenticación segura con avatar personalizable
- 📱 **Responsive Design** - Experiencia optimizada para móviles, tablets y escritorio

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **React 19.1** - Librería de UI con hooks modernos
- **Vite 7.1** - Build tool ultrarrápido
- **React Router v7** - Enrutamiento declarativo
- **Tailwind CSS 4.1** - Framework CSS utility-first
- **Anime.js** - Animaciones fluidas

### Backend & Servicios
- **Supabase** - Backend as a Service (BaaS)
  - Autenticación de usuarios
  - Base de datos PostgreSQL
  - Storage para avatares
  - Edge Functions (Deno)
- **StockX API** - Datos de precios y productos
- **GOAT API** - Comparación de precios adicional

### Herramientas de desarrollo
- **ESLint** - Linting de código
- **date-fns** - Manipulación de fechas
- **@fontsource** - Tipografías custom (Anton, DM Serif Display, Inter Tight)

---

## 🚀 Instalación y configuración

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Supabase
- Credenciales de StockX API (opcional para desarrollo)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/fgomez2/kickRadar.git
cd kickRadar
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_STOCKX_API_KEY=tu_stockx_api_key
```

4. **Configurar Supabase**

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Iniciar Supabase localmente (opcional)
supabase start

# Aplicar migraciones
supabase db push
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
kickRadar/
├── public/
│   └── images/              # Imágenes y assets
│       ├── brands/          # Logos de marcas
│       └── logo_radar.png   # Logo de kickRadar
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── KickHeader.jsx
│   │   ├── KickMain.jsx
│   │   ├── KickFooter.jsx
│   │   ├── KickCaracteristicas.jsx
│   │   ├── KickCarruselMarcas.jsx
│   │   ├── TarjetaSneaker.jsx
│   │   └── TablaPrecios.jsx
│   ├── pages/               # Páginas/Vistas
│   │   ├── Home.jsx
│   │   ├── AuthPage.jsx
│   │   ├── BusquedaSneakers.jsx
│   │   ├── DetalleSneaker.jsx
│   │   ├── MiPerfil.jsx
│   │   ├── MisFavoritos.jsx
│   │   └── QuienesSomos.jsx
│   ├── hooks/               # Custom hooks
│   │   ├── useStockxSearch.js
│   │   ├── useStockxProduct.js
│   │   ├── useStockxPrices.js
│   │   └── useGoatPrices.js
│   ├── modules/             # Módulos de funcionalidad
│   │   └── auth/
│   │       └── AuthProvider.jsx
│   ├── routes/              # Configuración de rutas
│   │   └── index.jsx
│   ├── utils/               # Utilidades
│   │   └── stockxAuth.js
│   ├── supabase-client.js   # Cliente de Supabase
│   └── main.jsx             # Punto de entrada
├── supabase/
│   ├── functions/           # Edge Functions (Deno)
│   │   ├── exchange-stockx-code/
│   │   ├── refresh-stockx-token/
│   │   ├── stockx-search/
│   │   ├── stockx-product/
│   │   ├── get-stockx-prices/
│   │   └── get-goat-prices/
│   └── migrations/          # Migraciones de BD
└── package.json
```

---

## 🎯 Funcionalidades

### 🔐 Autenticación
- Registro e inicio de sesión con email/password
- Autenticación OAuth (Google, GitHub)
- Gestión de sesión persistente
- Avatar personalizable

### 🔍 Búsqueda de sneakers
- Búsqueda en tiempo real
- Filtrado por categoría (sneakers)
- Resultados paginados (15 por página)
- Integración con StockX API

### 💰 Comparación de precios
- Precios de StockX
- Precios de GOAT
- Comparación lado a lado
- Visualización en tabla

### ❤️ Favoritos
- Agregar/eliminar favoritos
- Vista personalizada de favoritos
- Sincronización con la base de datos

### 👤 Perfil de usuario
- Edición de información personal
- Subida de avatar
- Gestión de cuenta
- Eliminación de cuenta

---

## 🌐 Rutas de la aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/auth` | Autenticación (Login/Registro) |
| `/sneakers/search/:query` | Resultados de búsqueda |
| `/sneakers/:id` | Detalle de sneaker |
| `/miPerfil` | Perfil de usuario |
| `/misFavoritos` | Lista de favoritos |
| `/quienes-somos` | Información del proyecto |

---

## 📡 API Endpoints (Supabase Functions)

### StockX
- `POST /exchange-stockx-code` - Intercambiar código OAuth por token
- `POST /refresh-stockx-token` - Renovar token de acceso
- `GET /stockx-search` - Buscar productos
- `GET /stockx-product` - Obtener detalles de producto
- `GET /get-stockx-prices` - Obtener precios

### GOAT
- `GET /get-goat-prices` - Obtener precios de GOAT

---

## 🎨 Diseño

El proyecto utiliza una paleta de colores oscura con acentos en verde (#34D399 / green-400):

- **Fondo principal**: Negro / Gris oscuro
- **Color primario**: Verde (#34D399)
- **Color secundario**: Blanco
- **Efectos**: Sombras con brillo verde (glow effects)

### Tipografías
- **Títulos**: DM Serif Display
- **Encabezados**: Anton
- **Cuerpo**: Inter Tight Variable

### Iconos
- **Heroicons** - Iconos SVG de Tailwind Labs

---

## 🚧 Próximos pasos

- [ ] Implementar alertas de precio
- [ ] Historial de precios con gráficos
- [ ] Filtros avanzados de búsqueda
- [ ] Migración a Next.js para SSR
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Integración con más marketplaces

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Fernando Gómez García**

- GitHub: [@fgomez2](https://github.com/fgomez2)
- LinkedIn: [Fernando Gómez García](https://www.linkedin.com/in/fernando-g%C3%B3mez-garc%C3%ADa-50562735a/)
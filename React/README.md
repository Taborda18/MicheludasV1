# Micheludas Frontend

Aplicación web moderna para la gestión de un bar, construida con React 19, Vite, Socket.IO y diseño responsivo. Incluye actualizaciones en tiempo real y control de acceso por roles.

## 🚀 Tecnologías

- **React 19.2.0** - Biblioteca de UI
- **Vite 7.2.5** - Build tool y dev server
- **React Router DOM** - Navegación entre páginas
- **Axios** - Cliente HTTP para API REST
- **Socket.IO Client 4.x** - Actualizaciones en tiempo real
- **CSS3** - Estilos con gradientes y animaciones

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   └── images/
│       └── logo-micheludos.webp    # Logo de la aplicación
├── components/
│   ├── common/
│   │   ├── Modal.jsx               # Componente modal reutilizable
│   │   └── Modal.css
│   ├── cash/
│   │   ├── CashSessionOpenModal.jsx   # Modal apertura de caja
│   │   └── CashSessionCloseModal.jsx  # Modal cierre de caja
│   └── layout/                     # Componentes de layout
├── context/
│   └── AuthContext.jsx             # Context API para autenticación
├── hooks/
│   └── useAuth.js                  # Hook personalizado de autenticación
├── pages/
│   ├── Login/
│   │   ├── Login.jsx               # Página de inicio de sesión
│   │   └── Login.css
│   ├── Dashboard/
│   │   ├── Dashboard.jsx           # Dashboard con control por roles
│   │   └── Dashboard.css
│   ├── Inventory/                  # Gestión de inventario
│   ├── Orders/                     # Gestión de órdenes y mesas
│   ├── Products/                   # Gestión de productos
│   ├── Tables/                     # Gestión de mesas
│   └── Users/                      # Administración de usuarios
├── routes/
│   ├── AppRoutes.jsx               # Definición de todas las rutas
│   └── PrivateRoute.jsx            # Componente para rutas protegidas
├── services/
│   ├── api.js                      # Configuración de Axios
│   ├── socket.js                   # Cliente Socket.IO
│   ├── authService.js              # Servicios de autenticación
│   ├── productService.js           # Servicios de productos
│   ├── orderService.js             # Servicios de órdenes
│   ├── inventoryService.js         # Servicios de inventario
│   ├── cashSessionService.js       # Servicios de sesiones de caja
│   └── invoiceService.js           # Servicios de facturas
├── utils/
│   └── formatters.js               # Funciones de formateo (moneda, fecha)
├── App.jsx                         # Componente principal
├── App.css
├── main.jsx                        # Punto de entrada
└── index.css                       # Estilos globales
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto principal (no en la carpeta React) con:

```env
# API Backend URL
VITE_API_URL=http://localhost:5000/api
```

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

La aplicación estará disponible en: `http://localhost:5173`

## 🎨 Características

### Sistema de Autenticación
- Login con validación de credenciales
- Tokens JWT almacenados en localStorage
- Rutas protegidas con redirección automática
- Logout con limpieza de sesión

### Control de Acceso por Roles
El sistema implementa tres roles con permisos diferenciados:

#### ADMIN (role_id=1)
- Acceso completo a todas las secciones:
  - Mesas (Zonas + Pedidos)
  - Productos
  - Inventario
  - Reportes
  - Admin de usuarios
- No requiere sesión de caja

#### CAJA (role_id=2)
- Acceso a:
  - Mesas (Zonas + Pedidos)
  - Productos
  - Inventario
- Gestión de sesión de caja (apertura/cierre)
- Puede aprobar pedidos y generar facturas

#### MESERO (role_id=3)
- Acceso a:
  - Mesas (solo pestaña "Zonas")
- Puede crear pedidos para las mesas
- Requiere sesión de caja abierta para acceder

### Actualizaciones en Tiempo Real
La aplicación usa Socket.IO para sincronizar cambios automáticamente:

- **Sesiones de Mesa**: Creación, actualización y cierre de mesas se refleja en todos los clientes
- **Tickets/Pedidos**: Nuevos pedidos y cambios de estado (Pendiente → Aprobado) se actualizan instantáneamente
- **Facturas**: Generación de facturas cierra la mesa en tiempo real para todos
- **Sesión de Caja**: Apertura/cierre se refleja en todos los dashboards conectados

**Sin necesidad de refrescar manualmente la página.**

### Dashboard
- Sidebar con navegación filtrada por rol
- Diseño responsivo (sidebar se comprime en móviles)
- Tema oscuro con gradientes verde/negro
- Gating de sesión de caja para CAJA y MESERO
- Bloqueo de secciones no autorizadas

### Componentes Reutilizables
- **Modal**: Alertas con 4 tipos (success, error, warning, info)
- **PrivateRoute**: Protección de rutas por autenticación

### Servicios API
- Axios configurado con interceptores
- Adjunta automáticamente el token JWT a las peticiones
- Maneja errores 401 con redirección al login
- Excluye endpoint de login de redirecciones automáticas

## 🎯 Rutas Principales

- `/login` - Página de inicio de sesión (pública)
- `/dashboard` - Dashboard principal (protegida)
- `/` - Redirige automáticamente a `/login`
- `*` - Cualquier ruta no encontrada redirige a `/login`

## 🔒 Seguridad

- **Rutas Protegidas**: PrivateRoute verifica token antes de renderizar
- **Interceptores Axios**: Adjunta automáticamente Bearer token
- **Redirección Automática**: Si no hay token, redirige a login
- **Expiración de Sesión**: Maneja tokens expirados (401)

## 🎨 Diseño

- **Colores Principales**:
  - Negro: `#000000`, `#1a1a1a`
  - Verde: `#0a4d0a`, `#0d6b0d`
  - Gradientes dinámicos
- **Fuentes**: Sistema operativo nativo
- **Animaciones**: Transiciones suaves en botones y modales
- **Responsivo**: Adaptable a móviles, tablets y desktop

## 🧪 Uso

### Login
1. Accede a `http://localhost:5173`
2. Ingresa credenciales (usuario y contraseña)
3. Si es correcto, se muestra modal de éxito
4. Al cerrar el modal, redirige automáticamente al dashboard

### Dashboard
1. Menú lateral con opciones de navegación
2. Click en cualquier opción cambia el contenido principal
3. Botón "Cerrar Sesión" limpia la sesión y redirige al login

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.1.3",
  "axios": "^1.7.9",
  "vite": "^7.2.5"
}
```

## 🚀 Desarrollo

### Agregar una Nueva Página

1. Crea el componente en `src/pages/NombrePagina/`
2. Agrega la ruta en `src/routes/AppRoutes.jsx`
3. Si requiere autenticación, envuélvela con `<PrivateRoute>`

### Agregar un Nuevo Servicio

1. Crea el archivo en `src/services/nombreService.js`
2. Importa `api` desde `./api.js`
3. Exporta funciones que usen `api.get()`, `api.post()`, etc.

## 📝 Licencia

ISC License

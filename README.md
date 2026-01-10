# 🍺 Micheludas - Sistema de Gestión de Bar

Sistema completo de gestión para bares y restaurantes, desarrollado con tecnologías modernas. Incluye gestión de mesas, inventario, productos, ventas y reportes.

## 📋 Descripción

Micheludas es una aplicación full-stack diseñada para optimizar la operación de bares y restaurantes. Permite:

- ✅ Gestión de mesas y órdenes en tiempo real
- ✅ Control de inventario y productos
- ✅ Sistema de autenticación seguro con JWT
- ✅ Gestión de usuarios y roles
- ✅ Registro de ventas y tickets
- ✅ Reportes y estadísticas
- ✅ Interfaz moderna y responsiva

## 🏗️ Arquitectura del Proyecto

```
MICHELUDAS/PROYECTO/
├── backend/                        # API REST con Node.js y Express
│   ├── src/
│   │   ├── app.js                 # Servidor Express
│   │   ├── config/                # Configuración de BD
│   │   ├── controllers/           # Lógica de negocio
│   │   ├── models/                # Modelos de datos
│   │   ├── routes/                # Rutas de la API
│   │   ├── middleware/            # Autenticación y manejo de errores
│   │   └── utils/                 # Helpers (bcrypt, JWT)
│   ├── database/                  # Scripts SQL
│   ├── package.json
│   └── README.md
├── React/mi-app-react/            # Frontend con React y Vite
│   ├── src/
│   │   ├── assets/               # Imágenes y recursos
│   │   ├── components/           # Componentes reutilizables
│   │   ├── context/              # Context API
│   │   ├── hooks/                # Custom hooks
│   │   ├── pages/                # Páginas de la app
│   │   ├── routes/               # Configuración de rutas
│   │   ├── services/             # Servicios API
│   │   ├── utils/                # Utilidades
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
├── .env                           # Variables de entorno
└── README.md                      # Este archivo
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing
- **pg** - Driver de PostgreSQL
- **dotenv** - Variables de entorno

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS3** - Estilos con animaciones

## 📦 Instalación y Configuración

### Requisitos Previos

- Node.js v18 o superior
- PostgreSQL 16 o superior
- npm o yarn
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Taborda18/MicheludasV1.git
cd MicheludasV1
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Configurar Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos (si es necesario)
CREATE DATABASE micheludas;

# Ejecutar scripts de creación de tablas
# (ubicados en backend/database/)
```

### 4. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../React/mi-app-react
npm install
```

## ▶️ Ejecutar la Aplicación

### Opción 1: Ejecutar ambos servidores simultáneamente

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Servidor en http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd React/mi-app-react
npm run dev
# Aplicación en http://localhost:5173
```

### Opción 2: Modo Producción

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd React/mi-app-react
npm run build
npm run preview
```

## 📍 Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Login por defecto**: Crear usuario con Postman primero

## 🔐 Primer Uso

### 1. Crear un Usuario Administrador

Usar Postman o cualquier cliente HTTP:

```http
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@micheludas.com",
  "password": "123456",
  "role_id": 1
}
```

### 2. Iniciar Sesión

Accede a http://localhost:5173 e ingresa:
- **Usuario**: admin
- **Contraseña**: 123456

## 🎯 Funcionalidades Principales

### Sistema de Autenticación
- Login con JWT
- Contraseñas encriptadas con bcrypt
- Rutas protegidas
- Roles de usuario (Admin, Usuario)

### Dashboard
- Menú lateral con navegación
- Vista de mesas en tiempo real
- Acceso rápido a módulos principales

### Gestión de Mesas
- Visualización de estado de mesas
- Asignación de órdenes
- Control de ocupación

### Gestión de Inventario
- Control de stock
- Alertas de bajo inventario
- Registro de proveedores

### Gestión de Productos
- Catálogo de productos
- Precios y categorías
- Activación/desactivación

### Ventas y Tickets
- Generación de tickets
- Registro de ventas
- Historial de transacciones

### Reportes
- Estadísticas de ventas
- Productos más vendidos
- Análisis de inventario

## 📚 Documentación API

Para más información sobre los endpoints disponibles, consulta:
- [Backend README](./backend/README.md)

Endpoints principales:
- `POST /api/users/login` - Autenticación
- `GET /api/products` - Listar productos
- `GET /api/inventory` - Consultar inventario
- `POST /api/tickets` - Crear ticket de venta
- Y más...

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd React/mi-app-react
npm test
```

## 🐛 Resolución de Problemas Comunes

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
pg_isready

# Verificar credenciales en .env
# Asegurarse que DB_PASSWORD no tenga comillas
```

### Error CORS en el frontend
```bash
# Verificar que VITE_API_URL en .env sea correcta
# Verificar que el backend tenga CORS habilitado
```

### Token expirado o inválido
```bash
# Cerrar sesión y volver a iniciar sesión
# Verificar que JWT_SECRET sea el mismo en todas las instancias
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

ISC License

## 👥 Autores

- **Taborda18** - Desarrollo inicial - [GitHub](https://github.com/Taborda18)

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor abre un issue en GitHub.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Taborda18/MicheludasV1.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd MicheludasV1/backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd MicheludasV1/backend
   node src/app.js
   ```

2. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

### Features
- Manage orders, products, and tables through a user-friendly interface.
- Real-time updates and interactions between the frontend and backend.

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License
This project is licensed under the ISC License.
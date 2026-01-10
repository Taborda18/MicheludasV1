# Micheludas Backend API

API REST para el sistema de gestión de bar Micheludas. Construido con Node.js, Express y PostgreSQL.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── app.js                 # Punto de entrada de la aplicación
│   ├── config/
│   │   └── database.js        # Configuración de PostgreSQL
│   ├── controllers/           # Lógica de negocio
│   │   ├── userController.js
│   │   ├── roleController.js
│   │   ├── productController.js
│   │   ├── inventoryController.js
│   │   ├── supplierController.js
│   │   ├── orderSessionController.js
│   │   ├── ticketController.js
│   │   ├── ticketDetailController.js
│   │   └── invoiceController.js
│   ├── models/                # Modelos de datos
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Product.js
│   │   ├── Inventory.js
│   │   ├── Supplier.js
│   │   ├── OrderSession.js
│   │   ├── Ticket.js
│   │   ├── TicketDetail.js
│   │   └── Invoice.js
│   ├── routes/                # Definición de rutas
│   │   ├── userRoutes.js
│   │   ├── roleRoutes.js
│   │   ├── productRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── orderSessionRoutes.js
│   │   ├── tableRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── ticketDetailRoutes.js
│   │   └── invoiceRoutes.js
│   ├── middleware/            # Middlewares
│   │   ├── authMiddleware.js  # Verificación de tokens y roles
│   │   └── errorHandler.js    # Manejo de errores
│   └── utils/                 # Utilidades
│       ├── hashHelper.js      # Encriptación bcrypt
│       └── jwtHelper.js       # Generación y verificación JWT
├── database/                  # Scripts de base de datos
├── package.json
└── README.md
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (no en la carpeta backend) con:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
```

### 2. Base de Datos

Asegúrate de tener PostgreSQL instalado y corriendo:

```bash
# Verificar que PostgreSQL está corriendo
psql --version

# Conectar a PostgreSQL
psql -U postgres
```

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 📡 API Endpoints

### Autenticación
- `POST /api/users/login` - Iniciar sesión
- Retorna: `{ token, user }`

### Usuarios
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener un usuario
- `POST /api/users` - Crear usuario (contraseña encriptada automáticamente)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Roles
- `GET /api/roles` - Listar roles
- `GET /api/roles/:id` - Obtener rol
- `POST /api/roles` - Crear rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/active` - Productos activos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `PUT /api/products/:id/toggle` - Activar/desactivar producto
- `DELETE /api/products/:id` - Eliminar producto

### Inventario
- `GET /api/inventory` - Listar inventario
- `GET /api/inventory/:id` - Obtener item de inventario
- `POST /api/inventory` - Crear item
- `PUT /api/inventory/:id` - Actualizar item
- `DELETE /api/inventory/:id` - Eliminar item

### Proveedores
- `GET /api/suppliers` - Listar proveedores
- `GET /api/suppliers/:id` - Obtener proveedor
- `POST /api/suppliers` - Crear proveedor
- `PUT /api/suppliers/:id` - Actualizar proveedor
- `DELETE /api/suppliers/:id` - Eliminar proveedor

### Sesiones de Orden (Mesas)
- `GET /api/order-sessions` - Listar sesiones
- `GET /api/order-sessions/:id` - Obtener sesión
- `POST /api/order-sessions` - Crear sesión
- `PUT /api/order-sessions/:id` - Actualizar sesión
- `DELETE /api/order-sessions/:id` - Eliminar sesión

### Tickets
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/:id` - Obtener ticket
- `POST /api/tickets` - Crear ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `DELETE /api/tickets/:id` - Eliminar ticket

### Detalles de Ticket
- `GET /api/ticket-details` - Listar detalles
- `GET /api/ticket-details/:id` - Obtener detalle
- `POST /api/ticket-details` - Crear detalle
- `PUT /api/ticket-details/:id` - Actualizar detalle
- `DELETE /api/ticket-details/:id` - Eliminar detalle

### Facturas
- `GET /api/invoices` - Listar facturas
- `GET /api/invoices/:id` - Obtener factura
- `POST /api/invoices` - Crear factura
- `PUT /api/invoices/:id` - Actualizar factura
- `DELETE /api/invoices/:id` - Eliminar factura

## 🔒 Seguridad

- **Contraseñas**: Encriptadas con bcrypt (10 salt rounds)
- **JWT**: Tokens con expiración configurable (default 24h)
- **Middleware de autenticación**: Protección de rutas sensibles
- **Roles**: Control de acceso basado en roles (Admin, Usuario)

## 🧪 Pruebas con Postman

1. Crear un usuario:
```json
POST http://localhost:5000/api/users
{
  "username": "admin",
  "email": "admin@micheludas.com",
  "password": "123456",
  "role_id": 1
}
```

2. Iniciar sesión:
```json
POST http://localhost:5000/api/users/login
{
  "username": "admin",
  "password": "123456"
}
```

3. Usar el token retornado en el header `Authorization: Bearer <token>`

## 📝 Licencia

ISC License
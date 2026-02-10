# 🚀 Guía de Despliegue y Migraciones - Micheludas

Esta guía te ayudará a ejecutar Micheludas en cualquier PC o con Docker.

---

## 📋 Requisitos Previos

- **Node.js 14+** (para desarrollo local)
- **PostgreSQL 12+** (para desarrollo local)
- **Docker y Docker Compose** (para Docker)

---

## 🔧 Instalación Local (Sin Docker)

### Paso 1: Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

Edita el `.env` con tus datos de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=micheludas_db
PORT=5000
```

### Paso 2: Instalar Dependencias

```bash
cd backend
npm install

cd ../React
npm install
```

### Paso 3: Las Migraciones se Ejecutarán Automáticamente

Al iniciar el servidor, **las migraciones se ejecutarán automáticamente**:

```bash
cd backend
npm start
```

✅ Verás en la consola:
```
🔄 Iniciando migraciones de base de datos...
✅ Migraciones completadas exitosamente
📊 Insertando roles por defecto...
✅ Roles insertados correctamente
📊 Insertando usuario admin por defecto...
✅ Usuario admin creado: admin / admin123
```

### Paso 4: Iniciar el Frontend

```bash
cd React
npm run dev
```

---

## 🐳 Instalación con Docker

### Paso 1: Clonar o Descargar el Proyecto

Asegúrate de estar en el directorio raíz del proyecto.

### Paso 2: Configurar Variables de Entorno (Opcional)

Las variables ya vienen configuradas en el `docker-compose.yml`, pero si quieres personalizarlas:

```bash
cp .env.example .env
```

### Paso 3: Levantar los Contenedores

```bash
docker-compose up -d
```

✅ Esto:
- Crea un contenedor PostgreSQL
- Crea un contenedor con el Backend
- Crea un contenedor con el Frontend
- **Ejecuta automáticamente las migraciones**

### Paso 4: Verificar que Todo Esté Corriendo

```bash
docker-compose ps
```

Deberías ver 3 contenedores corriendo:
- `micheludas_db`
- `micheludas_backend`
- `micheludas_frontend`

### Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432

---

## 📛 Usuario Admin Predeterminado

La primera vez que se ejecutan las migraciones, se crea automáticamente un usuario admin:

```
Usuario: admin
Contraseña: admin123
```

⚠️ **IMPORTANTE**: Cambia esta contraseña en la primera oportunidad.

---

## 🔄 Ejecutar Migraciones Manualmente

Si por alguna razón necesitas ejecutar las migraciones manualmente:

### Local:
```bash
cd backend
npm run migrate
```

### Docker (si el contenedor ya está corriendo):
```bash
docker-compose exec backend npm run migrate
```

---

## 📊 Estructura de la Base de Datos

Las migraciones crean automáticamente estas tablas:

| Tabla | Descripción |
|-------|-------------|
| `roles` | Roles de usuarios (Admin, Cajero, Mesero, Cocinero) |
| `users` | Usuarios del sistema |
| `suppliers` | Proveedores |
| `inventory` | Inventario de ingredientes |
| `products` | Productos a la venta |
| `product_ingredients` | Relación entre productos e ingredientes |
| `order_sessions` | Sesiones de pedidos (por mesa) |
| `tickets` | Tickets/Comandas |
| `ticket_details` | Detalles de los tickets |
| `invoices` | Facturas |
| `cash_sessions` | Sesiones de caja |

---

## 🚨 Solución de Problemas

### Error: "connection refused"
- Verifica que PostgreSQL esté ejecutándose
- Verifica las credenciales en `.env`
- En Docker: espera a que el contenedor de PostgreSQL esté completamente inicializado

### Error: "database does not exist"
- Las migraciones la crearán automáticamente en el primer init
- Si no funciona, ejecuta manualmente: `npm run migrate`

### Ver logs de Docker
```bash
docker-compose logs backend
docker-compose logs postgres
```

### Detener los contenedores
```bash
docker-compose down
```

### Eliminar datos y empezar de 0
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📝 Archivos de Migración

- `backend/database/migrations.sql` - Script SQL con el esquema
- `backend/database/migrations.js` - Ejecutor de migraciones (Node.js)
- `backend/database/runMigrations.js` - Script para ejecutar migraciones manualmente

---

## 🎯 Checklist para Nuevo PC

- [ ] Clonar/descargar el proyecto
- [ ] Copiar `.env.example` a `.env` y ajustar valores
- [ ] Instalar Node.js (si es desarrollo local)
- [ ] Instalar PostgreSQL (si es desarrollo local)
- [ ] Ejecutar `npm install` en backend y React
- [ ] Ejecutar `npm start` en backend
- [ ] Las migraciones se ejecutarán automáticamente ✅
- [ ] Ejecutar `npm run dev` en React
- [ ] Acceder a http://localhost:3000
- [ ] Cambiar contraseña de admin

---

## 🐳 Checklist para Docker

- [ ] Clonar/descargar el proyecto
- [ ] Instalar Docker y Docker Compose
- [ ] Ejecutar `docker-compose up -d` desde el directorio raíz
- [ ] Esperar a que los contenedores se levanten (~30-60 segundos)
- [ ] Las migraciones se ejecutarán automáticamente ✅
- [ ] Acceder a http://localhost:3000
- [ ] Cambiar contraseña de admin

---

## 💡 Tips

- Las migraciones son idempotentes (puedes ejecutarlas múltiples veces sin problemas)
- Si agregas nuevas tablas, añádelas a `migrations.sql` y reinicia
- Los roles por defecto son: Admin, Cajero, Mesero, Cocinero
- Todos los timestamps usan UTC

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si la BD ya existe?**
R: Las migraciones verificarán si las tablas ya existen y no las recrearán.

**P: ¿Se pierden los datos si reinicio Docker?**
R: Los datos se guardan en un volumen de Docker llamado `postgres_data`, así que NO se pierden.

**P: ¿Puedo cambiar las credenciales de DB en Docker?**
R: Sí, edita los valores en `docker-compose.yml` o en el `.env` antes de ejecutar `docker-compose up`.

**P: ¿Cómo me conecto a PostgreSQL desde afuera?**
R: 
- Host: localhost (o la IP del servidor Docker)
- Puerto: 5432
- Usuario: micheludas
- Contraseña: micheludas123
- Base de datos: micheludas_db

---

¡Listo! 🎉 Tu aplicación Micheludas debería estar lista para usar.

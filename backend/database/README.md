# 📊 Sistema de Migraciones de Base de Datos

Este directorio contiene el sistema automático de migraciones de base de datos para Micheludas.

## 📁 Archivos

- **`migrations.sql`** - Script SQL con el esquema completo de la BD
- **`migrations.js`** - Lógica de ejecución de migraciones (Node.js)
- **`runMigrations.js`** - Script ejecutable para correr migraciones manualmente

## 🔄 Cómo Funcionan las Migraciones

### Automático (Recomendado)

Las migraciones **se ejecutan automáticamente** cada vez que inicia el servidor:

```bash
cd backend
npm start
```

Verás en la consola:
```
✅ PostgreSQL connected successfully
🔄 Iniciando migraciones de base de datos...
✅ Migraciones completadas exitosamente
```

### Manual

Si necesitas ejecutar las migraciones manualmente:

```bash
cd backend
npm run migrate
```

O directamente:

```bash
node database/runMigrations.js
```

## 📋 Qué Crean las Migraciones

Las migraciones crean automáticamente:

1. **Tablas principales**:
   - `roles` - Roles de usuario
   - `users` - Usuarios
   - `suppliers` - Proveedores
   - `inventory` - Inventario
   - `products` - Productos
   - `product_ingredients` - Relación producto-ingrediente

2. **Tablas de pedidos**:
   - `order_sessions` - Sesiones de pedido (por mesa)
   - `tickets` - Tickets/Comandas
   - `ticket_details` - Detalles de tickets

3. **Tablas de facturación**:
   - `invoices` - Facturas
   - `cash_sessions` - Sesiones de caja

4. **Índices** - Para optimizar búsquedas

5. **Datos por defecto**:
   - Roles: Admin, Cajero, Mesero, Cocinero
   - Usuario Admin: admin / admin123

## ⚙️ Características

✅ **Idempotentes** - Puedes ejecutarlas múltiples veces sin problemas
✅ **Automáticas** - Se ejecutan al iniciar el servidor
✅ **Seguras** - Utilizan `IF NOT EXISTS` para evitar errores
✅ **Completas** - Incluyen índices y restricciones
✅ **Con datos iniciales** - Crea roles y usuario admin automáticamente

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt
- Se crean índices para optimizar performance
- Se definen restricciones de integridad referencial
- El usuario admin tiene contraseña temporal que debe cambiar

## 🚨 Troubleshooting

### Las migraciones no se ejecutan
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Ejecuta manualmente: `npm run migrate`

### Error: "permission denied"
- Aumenta los permisos del usuario PostgreSQL
- O ejecuta con un usuario que tenga permisos suficientes

### Necesito agregar una nueva tabla
1. Edita `migrations.sql`
2. Agrega el comando `CREATE TABLE IF NOT EXISTS...`
3. Reinicia el servidor

### Necesito modificar una tabla existente
1. Este sistema crea tablas, no las modifica
2. Para cambios en estructura, consulta la documentación de PostgreSQL ALTER TABLE
3. Ten cuidado de no perder datos

## 📝 Ejemplo de Uso

**Primera vez:**
```bash
npm install
npm start
# ✅ Crea la BD, tablas e inserta datos iniciales automáticamente
```

**Nuevo PC sin BD:**
```bash
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm start
# ✅ Las migraciones se ejecutan automáticamente
```

**Con Docker:**
```bash
docker-compose up -d
# ✅ Las migraciones se ejecutan automáticamente en el contenedor
```

## 🐳 Migraciones con Docker

Los contenedores incluyen todo lo necesario. Las migraciones se ejecutan automáticamente cuando inicia el backend.

```bash
docker-compose up -d
# Espera ~30 segundos a que se inicialice
docker-compose logs backend | grep "Migraciones"
# ✅ Deberías ver: "Migraciones completadas exitosamente"
```

---

Para más información, consulta [DEPLOYMENT.md](../DEPLOYMENT.md) en el directorio raíz.

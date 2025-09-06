# 🛠️ API REST Profesional con NestJS - Gestión de Productos

Este proyecto implementa un **backend robusto** en [NestJS](https://nestjs.com/) para la **gestión de productos**, aplicando arquitectura por capas, validaciones de datos, reglas de negocio y una base de datos **PostgreSQL con Docker**.

---

## 🚀 Características principales

- **CRUD de Productos** con NestJS + TypeORM.
- **Validaciones de entrada** con `class-validator` y `class-transformer`.
- **Reglas de negocio:**
  - El `sku` debe ser único al crear productos.
  - El `stock` no puede ser negativo al actualizar.
  - No se puede eliminar un producto si tiene `stock` mayor a 0.
- **Endpoint de búsqueda avanzada** con paginación, filtros y ordenamiento (`POST /productos/search`).
- Base de datos **PostgreSQL 16** en contenedor Docker.

---

## 📦 Requisitos previos

- Node.js v22+
- npm v10+
- Docker Desktop
- Git

---

## ⚙️ Instalación y configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ImAnderrrr/nestjs-products-api.git
   cd nestjs-products-api
   ```

2. **Levantar la base de datos con Docker**
   ```bash
   docker compose up -d
   ```

   Esto inicia un contenedor con PostgreSQL en el puerto **5433**.

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Configurar variables de entorno**

   Crea un archivo `.env` en la raíz con:

   ```env
   DB_HOST=127.0.0.1
   DB_PORT=5433
   DB_USER=postgres
   DB_PASS=postgres
   DB_NAME=products_db
   ```

5. **Iniciar el servidor NestJS**
   ```bash
   npm run start:dev
   ```

   La API quedará disponible en:  
   👉 [http://localhost:3000](http://localhost:3000)

---

## 📚 Endpoints principales

### Crear producto
```http
POST /productos
Content-Type: application/json
```

```json
{
  "nombre": "Guitarra Eléctrica",
  "descripcion": "Cuerpo de aliso, pastillas single coil",
  "precio": 3999.99,
  "stock": 5,
  "sku": "GT-STRAT-001"
}
```

---

### Buscar productos
```http
POST /productos/search
Content-Type: application/json
```

```json
{
  "page": 1,
  "limit": 10,
  "sortBy": "precio",
  "order": "DESC",
  "filters": {
    "nombre": "guitarra"
  }
}
```

Ejemplo de respuesta:

```json
{
  "data": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 45
}
```

---

## 🎥 Demo (pendiente de video)

---

## 📜 Licencia
Este proyecto es de uso académico y educativo.  
Desarrollado por **Anthony Anderson Herrera Aguirre (ImAnderrrr)**.

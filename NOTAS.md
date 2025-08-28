# Resumen Técnico y Endpoints - Student-Teacher Management MS

## Descripción General
API RESTful para la gestión de usuarios y cursos, autenticación JWT, roles y relaciones ManyToMany, desarrollada en NestJS + PostgreSQL.

---

## Autenticación
- **Login**
  - `POST /auth/login`
  - **Body:** `{ "email": string, "password": string }`
  - **Response:** `{ access_token, user }`

- **Headers protegidos:**
  - `Authorization: Bearer <token>`

---

## Usuarios
- **Listar usuarios (admin)**
  - `GET /users`
  - **Headers:** JWT admin

- **Ver perfil propio**
  - `GET /users/me`
  - **Headers:** JWT

- **Ver cursos propios**
  - `GET /users/me/courses`
  - **Headers:** JWT

- **Ver detalle de curso propio**
  - `GET /users/me/courses/:courseId`
  - **Headers:** JWT

- **Ver usuario por id (admin)**
  - `GET /users/:id`
  - **Headers:** JWT admin

- **Crear usuario (admin)**
  - `POST /users`
  - **Body:** `{ email, password, name, role? }`
  - **Headers:** JWT admin

- **Actualizar usuario (admin)**
  - `PUT /users/:id`
  - **Body:** `{ name?, password?, role? }`
  - **Headers:** JWT admin

- **Eliminar usuario (admin)**
  - `DELETE /users/:id`
  - **Headers:** JWT admin

- **Cambiar contraseña**
  - `PUT /users/:id/password`
  - **Body:** `{ password }`
  - **Headers:** JWT

- **Inscribir usuario a curso**
  - `POST /users/:id/courses/:courseId`
  - **Headers:** JWT admin

---

## Cursos
- **Listar cursos (admin)**
  - `GET /courses`
  - **Headers:** JWT admin

- **Ver curso por id (admin)**
  - `GET /courses/:id`
  - **Headers:** JWT admin

- **Crear curso (admin)**
  - `POST /courses`
  - **Body:** `{ name, description? }`
  - **Headers:** JWT admin

- **Actualizar curso (admin)**
  - `PUT /courses/:id`
  - **Body:** `{ name?, description? }`
  - **Headers:** JWT admin

- **Eliminar curso (admin)**
  - `DELETE /courses/:id`
  - **Headers:** JWT admin

---

## Healthcheck
- **Estado del sistema y base de datos**
  - `GET /healthcheck`
  - **Response:** `{ status: 'ok'|'error', db: 'online'|'offline' }`

---

## Consideraciones para el Frontend
- **Autenticación:**
  - Login para obtener JWT.
  - Guardar el token y enviarlo en el header `Authorization` en cada request protegido.
- **Roles:**
  - El backend valida roles (`admin`, `alumno`) en endpoints sensibles.
- **Validaciones:**
  - Todos los endpoints usan DTOs y validación de datos.
- **Errores:**
  - Respuestas de error estándar: `{ statusCode, message, error }`.
- **Swagger:**
  - Documentación interactiva disponible en `/api`.

---

## Ejemplo de Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## Ejemplo de Body para crear usuario
```json
{
  "email": "alumno@mail.com",
  "password": "1234",
  "name": "Alumno Ejemplo",
  "role": "alumno"
}
```

## Ejemplo de Body para crear curso
```json
{
  "name": "Matemáticas",
  "description": "Curso básico de matemáticas"
}
```

---

## Contacto y soporte
- Si tienes dudas sobre algún endpoint, revisa `/api` (Swagger) o consulta este archivo.

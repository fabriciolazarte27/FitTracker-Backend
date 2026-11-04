# Fit Tracker – Backend

## Integrantes

- Facundo Martín Morán
- Santiago Benjamin Avila Puntano
- Leandro Joel López
- Fabricio Sergio Lazarte

## Descripción breve

API REST de Fit Tracker desarrollada con NestJS y PostgreSQL. Recibe las peticiones del [frontend](https://github.com/santiagobnj-avila-pun/FitTracker-Frontend) para gestionar usuarios, autenticación, ejercicios, rutinas y el calendario de entrenamientos.

El proyecto está organizado en módulos dentro de `src/modules`: `app` es el módulo raíz y `users`, `auth`, `ejercicios`, `rutinas` y `calendario` se generaron con Nest CLI (`nest g resource`). Cada uno tiene su controlador, su servicio, sus DTO y sus entidades, y ofrece las operaciones CRUD: crear (POST), listar y obtener por id (GET), actualizar (PATCH) y eliminar (DELETE). En esta etapa los servicios devuelven las respuestas de ejemplo de Nest CLI; la conexión con la base de datos y la lógica de cada módulo se incorporarán en las próximas entregas.

### Base de datos

La base `fittracker` tiene seis tablas: `usuarios`, `grupos_musculares`, `ejercicios`, `rutinas`, `rutina_ejercicios` y `calendario`. Cada tabla tiene clave primaria y se relaciona con las demás mediante claves foráneas: los ejercicios pertenecen a un grupo muscular, las rutinas a un usuario (o son plantillas de ejemplo), `rutina_ejercicios` une rutinas y ejercicios con sus series y repeticiones o segundos, y el calendario agenda una rutina por usuario y por día. Las restricciones `UNIQUE` y `CHECK` evitan datos duplicados o inválidos. Los scripts de la carpeta `database/` crean la base, las tablas y al menos cinco registros de ejemplo por tabla.

### Postman

La colección `postman/FitTracker.postman_collection.json` documenta los endpoints de cada módulo con cuerpos JSON de ejemplo y un test que verifica el código de estado. Se importa en Postman (Import → archivo) y se pueden ejecutar todas las pruebas con Run collection. La variable `baseUrl` indica la dirección de la API.

## Tecnologías utilizadas

- Node.js y NestJS 12 con TypeScript.
- `@nestjs/config` para las variables de entorno.
- PostgreSQL 18 y pgAdmin.
- Postman para documentar y probar la API.
- Git y GitHub para el control de versiones.

## Instalación y ejecución

Se requiere Node.js 22 o superior, npm y PostgreSQL.

Desde la carpeta del proyecto:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto, junto a `package.json`, copiando `.env.example` y completando la contraseña del usuario `postgres`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/fittracker
API_BASE_URL=http://localhost:4000/
```

`.env` está ignorado por Git y no se sube al repositorio. Cada integrante debe crearlo localmente.

Crear la base de datos ejecutando los scripts en orden, con psql o desde el Query Tool de pgAdmin:

```bash
psql -U postgres -d postgres -f database/01-crear-base.sql
psql -U postgres -d fittracker -f database/02-tablas.sql
psql -U postgres -d fittracker -f database/03-datos.sql
psql -U postgres -d fittracker -f database/04-verificacion.sql
```

Iniciar la API:

```bash
npm run start:dev
```

Queda disponible en la dirección de `API_BASE_URL`, por ejemplo http://localhost:4000/ejercicios.

## Organización del código

```
src/
  main.ts              Arranque de la aplicación y puerto
  modules/
    app/               Módulo raíz: ConfigModule y los demás módulos
    users/             Usuarios
    auth/              Autenticación
    ejercicios/        Ejercicios y grupos musculares
    rutinas/           Rutinas y sus ejercicios
    calendario/        Entrenamientos agendados
database/              Scripts SQL de la base de datos
postman/               Colección de Postman
```

## Organización del trabajo en GitHub

- `main`: versión estable del proyecto.
- `dev`: integración del desarrollo.
- `feature/`, `fix/`, `refactor/` y `docs/`: nuevas funcionalidades, correcciones, reorganización del código y documentación.

Cada cambio se desarrolla en su rama a partir de `dev` y se integra mediante un Pull Request. Cuando `dev` está estable, se integra en `main`.

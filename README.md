# Fit Tracker – Backend

## Integrantes

- Facundo Martín Morán
- Santiago Benjamin Avila Puntano
- Leandro Joel López
- Fabricio Sergio Lazarte

## Descripción breve

API REST de Fit Tracker desarrollada con NestJS y PostgreSQL. Recibe las peticiones del [frontend](https://github.com/santiagobnj-avila-pun/FitTracker-Frontend) para gestionar usuarios, autenticación, ejercicios, rutinas y el calendario de entrenamientos.

El proyecto está organizado en módulos dentro de `src/modules`: `app` es el módulo raíz y `users`, `auth`, `ejercicios`, `rutinas` y `calendario` se generaron con Nest CLI (`nest g resource`). Cada uno tiene su controlador, su servicio, sus DTO y sus entidades, y ofrece las operaciones CRUD: crear (POST), listar y obtener por id (GET), actualizar (PATCH) y eliminar (DELETE). Los servicios trabajan con la base de datos mediante Prisma Client.

### Autenticación

`auth` permite registrarse (`POST /auth/register`), iniciar sesión (`POST /auth/login`) y consultar el perfil (`GET /auth/perfil`). Registrarse e iniciar sesión devuelven un JWT en `accessToken` junto con los datos del usuario. Las contraseñas se guardan hasheadas con bcrypt y nunca se devuelven en las respuestas. Los usuarios se crean solo con el registro: `users` no tiene ruta para crearlos y permite listarlos, consultarlos, actualizarlos y eliminarlos. Las rutas de `users` y el perfil requieren el header `Authorization: Bearer <token>`; sin un token válido responden 401.

El recorrido de una solicitud es: el DTO valida los datos recibidos, el controlador recibe la solicitud y llama al servicio, el servicio usa Prisma Client para consultar o modificar la base y la API devuelve el resultado. Si el registro no existe responde 404, si está duplicado o lo usa otro registro responde 409 y si los datos no son válidos responde 400.

### Base de datos

La base `fittracker` tiene seis tablas: `usuarios`, `grupos_musculares`, `ejercicios`, `rutinas`, `rutina_ejercicios` y `calendario`. Cada tabla tiene clave primaria y se relaciona con las demás mediante claves foráneas: los ejercicios pertenecen a un grupo muscular, las rutinas a un usuario (o son plantillas de ejemplo), `rutina_ejercicios` une rutinas y ejercicios con sus series y repeticiones o segundos, y el calendario agenda una rutina por usuario y por día. Las restricciones `UNIQUE` y `CHECK` evitan datos duplicados o inválidos. La base está normalizada hasta la tercera forma normal.

Las tablas se definen en `prisma/schema.prisma` y se crean con las migraciones de `prisma/migrations`. La migración inicial `init` incluye también la extensión `pgcrypto` y las restricciones `CHECK`, que Prisma no expresa en el esquema. Los scripts de la carpeta `database/` crean la base vacía y cargan al menos cinco registros de ejemplo por tabla.

### Postman

La colección `postman/FitTracker.postman_collection.json` documenta los endpoints de cada módulo con cuerpos JSON de ejemplo y un test que verifica el código de estado. Se importa en Postman (Import → archivo) y se pueden ejecutar todas las pruebas con Run collection. La variable `baseUrl` indica la dirección de la API. La carpeta Auth se ejecuta antes que Users: Iniciar sesión guarda el token en la variable `token`, que usan las rutas protegidas.

## Tecnologías utilizadas

- Node.js y NestJS 12 con TypeScript.
- `@nestjs/config` para las variables de entorno.
- PostgreSQL 18 y pgAdmin.
- Prisma 7 (Prisma CLI, Prisma Client y el adaptador `@prisma/adapter-pg`) para acceder a la base.
- `@nestjs/jwt` para generar y verificar los JWT, y bcrypt para hashear las contraseñas.
- Postman para documentar y probar la API.
- Git y GitHub para el control de versiones.

## Instalación y ejecución

Se requiere Node.js 22 o superior, npm y PostgreSQL.

Desde la carpeta del proyecto:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto, junto a `package.json`, copiando `.env.example` y completando la contraseña del usuario `postgres` y un secreto propio para firmar los JWT:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/fittracker?schema=public"
API_BASE_URL=http://localhost:4000/
JWT_SECRET=CAMBIAR_POR_UN_SECRETO_LARGO
```

Para generar un secreto aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env` está ignorado por Git y no se sube al repositorio. Cada integrante debe crearlo localmente.

Crear la base vacía, con psql o desde el Query Tool de pgAdmin:

```bash
psql -U postgres -d postgres -f database/01-crear-base.sql
```

Crear las tablas aplicando las migraciones y generar Prisma Client en `src/generated/prisma` (esa carpeta no se sube al repositorio):

```bash
npx prisma migrate dev
npx prisma generate
```

Cargar los datos de ejemplo y verificarlos:

```bash
psql -U postgres -d fittracker -f database/03-datos.sql
psql -U postgres -d fittracker -f database/04-verificacion.sql
```

`npx prisma studio` abre en el navegador una vista de las tablas para revisar los datos.

Los usuarios de ejemplo (por ejemplo `demo@fittracker.test`) tienen la contraseña `Fit12345` para probar el inicio de sesión.

Iniciar la API:

```bash
npm run start:dev
```

Queda disponible en la dirección de `API_BASE_URL`, por ejemplo http://localhost:4000/ejercicios.

## Organización del código

```
src/
  main.ts              Arranque de la aplicación, validación y manejo de errores
  generated/prisma/    Prisma Client generado (no se sube al repositorio)
  modules/
    app/               Módulo raíz: ConfigModule y los demás módulos
    prisma/            PrismaService y filtro de errores de la base
    users/             Usuarios (rutas protegidas con JWT)
    auth/              Registro, inicio de sesión, perfil y JwtAuthGuard
    ejercicios/        Ejercicios y grupos musculares
    rutinas/           Rutinas y sus ejercicios
    calendario/        Entrenamientos agendados
prisma/
  schema.prisma        Modelos de la base de datos
  migrations/          Historial de migraciones
prisma.config.ts       Configuración de Prisma (esquema, migraciones y DATABASE_URL)
database/              Scripts SQL para crear la base y cargar datos de ejemplo
postman/               Colección de Postman
```

## Organización del trabajo en GitHub

- `main`: versión estable del proyecto.
- `dev`: integración del desarrollo.
- `feature/`, `fix/`, `refactor/` y `docs/`: nuevas funcionalidades, correcciones, reorganización del código y documentación.

Cada cambio se desarrolla en su rama a partir de `dev` y se integra mediante un Pull Request. Cuando `dev` está estable, se integra en `main`.
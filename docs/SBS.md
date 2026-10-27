# Guía paso a paso: tu plantilla Next.js fullstack

Oct 26, 2026 · @Mau

Esta noche dejas lista una base con base de datos, autenticación y manejo de errores, para que mañana solo escribas lo que pide el enunciado. El orden va de lo que no depende de nada a lo que depende de todo.

## Por qué este orden

Cada etapa necesita a la anterior, como al construir una casa: primero el terreno, luego las tuberías, luego la cerradura. Las habitaciones (las pantallas) van al final.

| Etapa | Qué es | Necesita | Por qué va aquí |
| --- | --- | --- | --- |
| 1. Proyecto Next.js | El terreno: carpetas, layouts y rutas | Nada | Sin él no hay dónde poner el resto |
| 2. Base de datos | Las tuberías: Supabase y Prisma | El proyecto | Todo lo demás guarda o lee datos aquí |
| 3. Autenticación | La cerradura: registro, login y cookies | La base de datos | Guarda usuarios y tokens, y casi toda prueba la pide |
| 4. Errores y validación | Un formato único de respuesta | La autenticación | Los handlers de auth ya lo usan |
| 5. CRUD de ejemplo | La receta que copias por cada recurso | Las etapas 2 a 4 | Reutiliza sesión, validación y errores |
| 6. Extras | i18n, Docker, README y docs/ | Todo lo anterior | Son útiles, pero se pueden dejar para mañana |

Si esta noche solo terminas las etapas 1 a 3, ya llevas ventaja.

## Antes de empezar

Marca lo que ya tienes. Con esto listo no deberías perder tiempo en instalaciones.

- [x] Node 24, npm 11 y Docker 29 instalados (se comprueban con `node -v`, `npm -v` y `docker -v`)
- [x] VS Code y una cuenta de GitHub
- [ ] Un proyecto en Supabase con su contraseña guardada (se crea en el paso 2)
- [ ] Una cuenta de Vercel (se crea al final, solo para desplegar)
- [x] Confirmar con el profesor si puedes llevar una plantilla con la configuración hecha

La última casilla importa: algunas pruebas exigen empezar de cero o revisan el historial de commits. Pregúntalo hoy, no mañana.

## Paso 1 · Crear el proyecto Next.js

Aquí se crea el terreno: un proyecto vacío con TypeScript, estilos y carpetas ordenadas. Va primero porque nada más puede existir sin él.

**1.1 Crear la app.** En la carpeta donde guardas tus proyectos:

```bash
npx create-next-app@latest next-template
```

Cuando pregunte si usar los valores recomendados, elige **No, customize settings** y responde así:

| Pregunta | Respuesta | Por qué |
| --- | --- | --- |
| TypeScript | Yes | La prueba exige TypeScript |
| ESLint | Yes | Avisa de errores de código |
| React Compiler | No | No lo necesitas |
| Tailwind CSS | Yes | Estilos rápidos sin escribir CSS a mano |
| `src/` directory | **Yes** | Deja `app` dentro de `src` y evita tener dos carpetas `app` |
| App Router | Yes | Es la forma actual de Next.js |
| Cache Components | **No** | Complica SSG y SSR, que la prueba pide de forma clásica |
| AGENTS.md | No | No lo necesitas |
| Import alias | Enter | Deja `@/*`, que apunta a `src/` |

**1.2 Probarla.**

```bash
cd next-template
npm run dev
```

Abre `http://localhost:3000` y debe verse la página de ejemplo. Para parar el servidor usa `Ctrl + C`.

**1.3 Crear los route groups.** Un route group es una carpeta con nombre entre paréntesis. No aparece en la URL: solo agrupa páginas que comparten un layout (el marco que las envuelve). Primero borra `src/app/page.tsx`, porque la Home vivirá dentro de `(public)`. Luego crea:

```text
src/app/
├── layout.tsx             (ya existe, es el root layout)
├── (public)/
│   ├── layout.tsx         navbar y footer
│   ├── page.tsx           Home
│   └── auctions/
│       ├── page.tsx       catálogo
│       └── [id]/page.tsx  detalle
├── (auth)/
│   ├── layout.tsx         diseño centrado
│   ├── login/page.tsx
│   └── register/page.tsx
├── (private)/
│   ├── layout.tsx         navbar con menú de usuario
│   ├── dashboard/page.tsx
│   └── auctions/new/page.tsx
└── (admin)/
    ├── layout.tsx         layout del panel
    └── admin/page.tsx
```

Dentro de `src/` crea también las carpetas vacías `components` y `lib`. Los nombres de las páginas de dominio (`auctions`) cambiarán según el enunciado de mañana; lo que se queda es la forma: cuatro grupos, cada uno con su layout.

**1.4 Contenido mínimo.** Cada `page.tsx` devuelve un título y cada `layout.tsx` recibe `children`, que es la página que envuelve. Todos los archivos deben tener `export default`; si uno queda vacío, Next.js da el error "The default export is not a React Component".

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}
```

La página con `[id]` es una ruta dinámica: una sola carpeta atiende `/auctions/5` y `/auctions/abc`. En Next.js 16, `params` es una promesa y se lee con `await`:

```tsx
export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Detalle de la subasta {id}</h1>;
}
```

**1.5 Comprobar.** Con `npm run dev`, entra a `/`, `/auctions`, `/auctions/5`, `/login`, `/dashboard` y `/admin`. Cada una debe mostrar su título dentro del layout de su grupo.

**1.6 Subirlo a GitHub.** Crea un repositorio vacío y, desde la carpeta del proyecto:

```bash
git add .
git commit -m "chore: estructura inicial con route groups"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/next-template.git
git push -u origin main
```

## Paso 2 · Base de datos: Supabase y Prisma 7

Supabase te da una base PostgreSQL en la nube sin instalar nada. Prisma es el ORM: describes las tablas en un archivo y las consultas con código TypeScript, en lugar de escribir SQL. Va después del proyecto porque vive dentro de él, y antes de la autenticación porque esta guarda usuarios y tokens aquí.

**2.1 Crear el proyecto en Supabase.** Entra a supabase.com, pulsa **New project** y llámalo como quieras. Genera la contraseña de la base y **cópiala a un archivo temporal**, porque no podrás verla otra vez. Si tiene símbolos como `@`, `#` o `/`, la conexión falla: genera otra sin símbolos en *Project Settings > Database*. Elige la región más cercana (por ejemplo, São Paulo).

**2.2 Copiar las dos conexiones.** Cuando el proyecto termine de crearse, pulsa **Connect** y copia estas dos cadenas, cambiando `[YOUR-PASSWORD]` por tu contraseña:

| Variable | Cadena de Supabase | Puerto | Quién la usa |
| --- | --- | --- | --- |
| `DATABASE_URL` | Transaction pooler | 6543 | Tu app cuando está corriendo |
| `DIRECT_URL` | Session pooler | 5432 | Prisma al crear o cambiar tablas (migraciones) |

Se usa el *Session pooler* y no *Direct connection* porque esta última solo funciona con IPv6, y muchas redes no lo tienen.

**2.3 Instalar Prisma fijando la versión 7.** Esto es importante: si ejecutas `npx prisma init` sin instalar antes, npm baja la versión 8, que trabaja distinto (usa `definePrismaConfig` y un archivo "contract") y casi no tiene guías.

```bash
npm install -D prisma@7
npm install @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
npx prisma -v
```

El último comando debe decir `7.x.x`. Luego:

```bash
npx prisma init --output ../src/generated/prisma
```

**2.4 Guardar las conexiones en `.env`.** El comando `npx prisma init` crea este archivo con una `DATABASE_URL` de ejemplo. Si no existe, créalo tú en la raíz del proyecto, junto a `package.json`, con el nombre exacto `.env`. Déjalo con tus dos cadenas reales, sin espacios alrededor del `=`:

```text
DATABASE_URL="postgresql://postgres.xxxx:TU_CLAVE@aws-0-REGION.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.xxxx:TU_CLAVE@aws-0-REGION.pooler.supabase.com:5432/postgres"
```

El `.env` contiene secretos y no se sube a GitHub (el `.gitignore` de Next.js ya lo excluye). Nunca pegues estas cadenas en un chat.

**2.5 Configurar Prisma.** Abre `prisma.config.ts` y déjalo así. Apunta a `DIRECT_URL` porque las migraciones necesitan la conexión directa:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

La línea `seed` usa `tsx`, así que instálalo con `npm install -D tsx`. El archivo `prisma/seed.ts` lo escribiremos más adelante.

**2.6 Definir las tablas base.** En `prisma/schema.prisma`, deja arriba el `generator` y el `datasource` como están y añade estas dos tablas, que casi cualquier prueba necesita. Las tablas del dominio (subastas, productos, eventos) se añaden mañana.

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  passwordHash  String
  role          Role           @default(USER)
  createdAt     DateTime       @default(now())
  refreshTokens RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime  @default(now())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("refresh_tokens")
}
```

Cómo leerlo: cada `model` es una tabla y cada línea una columna. `?` significa que puede quedar vacío. `@relation` crea la clave foránea, y `onDelete: Cascade` borra los tokens de un usuario cuando se borra el usuario. Del refresh token solo guardamos el hash (`tokenHash`), nunca el token en claro.

**2.7 Crear las tablas.**

```bash
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```

`validate` revisa el archivo, `migrate dev` crea las tablas en Supabase y deja el historial en `prisma/migrations`, y `generate` crea el cliente de TypeScript. Después abre **Table Editor** en Supabase, con el esquema `public` seleccionado, y comprueba que aparecen `users` y `refresh_tokens`.

**2.8 Conectar la app con la base.** Crea `src/lib/prisma.ts`. Reutiliza un solo cliente en desarrollo para no abrir conexiones nuevas en cada recarga:

```ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**2.9 Scripts y `.gitignore`.** En `package.json`, dentro de `scripts`, añade:

```json
"postinstall": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:seed": "prisma db seed"
```

El `postinstall` es clave: el cliente generado no se sube a GitHub, y sin este script Vercel y Docker fallan con "Cannot find module". Añade también `/src/generated/prisma` al `.gitignore`.

## Paso 3 · Autenticación

Es la cerradura de la app: registro, login y sesión. Es lo más largo de montar y lo que más tiempo te ahorra mañana, porque casi toda prueba fullstack la pide con los mismos requisitos. Este paso es el mapa; cada archivo lo construimos juntas en el chat.

**Las piezas y para qué sirve cada una**

| Pieza | Qué hace | Dónde vive |
| --- | --- | --- |
| Contraseña | Se guarda hasheada con bcrypt, nunca en claro | `users.passwordHash` |
| Access token | JWT corto (15 min) con el id y el rol del usuario, firmado con `JWT_ACCESS_SECRET` | Cookie httpOnly |
| Refresh token | Texto aleatorio largo (7 días). En la base solo se guarda su hash | Cookie httpOnly y `refresh_tokens` |
| Cookies | `httpOnly` (JavaScript no puede leerlas), `secure` en producción y `sameSite` | El navegador |
| `proxy.ts` | Primera barrera: sin sesión redirige a `/login` y bloquea `/admin` a quien no sea ADMIN | `src/proxy.ts` |
| Route handlers | Segunda barrera: cada uno valida sesión y rol por su cuenta, sin fiarse del proxy | `src/app/api/...` |

Nada de tokens en `localStorage` ni en el body de la respuesta: la prueba lo prohíbe.

**Cómo fluye una sesión**

1. En el registro se valida el cuerpo, se hashea la contraseña y se crea el usuario con rol USER. El rol ADMIN solo se crea con el seed.
2. En el login se comprueba la contraseña, se crean los dos tokens, se guarda el hash del refresh y se envían ambos en cookies.
3. En cada petición el handler lee la cookie del access token y la verifica.
4. Cuando el access token vence, el cliente llama a `/api/auth/refresh`. El servidor comprueba que el refresh existe, no está revocado ni vencido, lo revoca y emite un par nuevo. El usuario no tiene que volver a iniciar sesión.
5. En el logout se marca `revokedAt` en el refresh token y se borran las cookies.

**Instalar lo que hace falta**

```bash
npm install bcryptjs jose zod
```

`bcryptjs` hashea contraseñas, `jose` firma y verifica JWT, y `zod` valida datos (se usa en el paso 4). Si TypeScript se queja de los tipos de bcryptjs, añade `npm install -D @types/bcryptjs`.

**Variables de entorno nuevas.** Añade al `.env` (y a `.env.example`, sin valores):

```text
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Genera cada secreto con este comando y pégalo en el `.env`. Usa uno distinto para cada variable:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Archivos que vamos a crear**

| Archivo | Responsabilidad |
| --- | --- |
| `src/lib/auth/password.ts` | Hashear y comparar contraseñas |
| `src/lib/auth/tokens.ts` | Crear y verificar el access token; generar y hashear el refresh token |
| `src/lib/auth/cookies.ts` | Poner y borrar las dos cookies |
| `src/lib/auth/session.ts` | `getSession`, `requireUser` y `requireRole` para los handlers |
| `src/app/api/auth/register/route.ts` | Registro |
| `src/app/api/auth/login/route.ts` | Login |
| `src/app/api/auth/refresh/route.ts` | Renovar el par de tokens |
| `src/app/api/auth/logout/route.ts` | Revocar el refresh y borrar cookies |
| `src/app/api/auth/me/route.ts` | Devolver el usuario de la sesión |
| `src/proxy.ts` | Proteger rutas privadas y de administrador |

Cada archivo hace una sola cosa, como pide la prueba en calidad de código.

**Lado del cliente.** Reutiliza de tu proyecto PlanCity el `AuthContext` y los formularios `LoginForm` y `RegisterForm`, con dos cambios: quita todo uso de `localStorage` y, al cargar, llama a `GET /api/auth/me` para saber si hay sesión. En los formularios cambia `useNavigate` por `useRouter` de `next/navigation` y añade `"use client"` arriba.

## Paso 4 · Errores y validación

La prueba pide que todos los route handlers validen la entrada y respondan los errores con el mismo formato y el código HTTP correcto. Si lo resuelves una vez, cada handler nuevo solo lo reutiliza. Va después de la autenticación porque los handlers de auth son los primeros en usarlo.

**Un formato único de error.** Todo error responde con esta forma, sin importar qué handler lo lance:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": ["email: formato inválido"]
  }
}
```

**Los códigos HTTP y cuándo usarlos**

| Código | Nombre | Cuándo | Ejemplo |
| --- | --- | --- | --- |
| 400 | Datos inválidos | El cuerpo o los parámetros no pasan la validación | Precio menor o igual a cero |
| 401 | Sin sesión | No hay sesión válida | Token vencido o ausente |
| 403 | Sin permiso | Hay sesión, pero no tienes derecho a hacerlo | Un usuario normal entra a una ruta de admin |
| 404 | No existe | El recurso no existe | Id de subasta inexistente |
| 409 | Conflicto | Choca con el estado actual | Email repetido, o borrar una categoría con subastas |

**Las piezas**

1. **Clases de error.** Reutiliza `ApiError`, `ValidationError`, `AuthError`, `NotFoundError` y `ConflictError` de tu proyecto PlanCity. Allá se usaban para leer errores de una API externa; aquí el servidor las lanza. Así ya tienes cubiertos 400, 401, 403, 404 y 409.
2. **Validación con zod.** Cada handler define un esquema (por ejemplo, email válido y contraseña de mínimo 8 caracteres) y lo aplica al cuerpo. Si falla, lanza `ValidationError` con los detalles.
3. **Un envoltorio para los handlers.** Una función que ejecuta el handler dentro de un `try/catch` y convierte cualquier error en la respuesta de arriba. También traduce dos errores de Prisma: `P2002` (valor único repetido) pasa a 409 y `P2025` (registro no encontrado) pasa a 404.

Archivos: `src/lib/errors.ts` (las clases), `src/lib/api.ts` (el envoltorio y el formato de respuesta) y un `schemas.ts` junto a cada recurso.

**Regla de oro:** las reglas de negocio se comprueban en el backend, no solo en la interfaz. Lo que valida un formulario en pantalla debe validarse otra vez en el handler, porque cualquiera puede llamar a la API sin pasar por tu interfaz.

## Paso 5 · Un CRUD de ejemplo

CRUD significa crear, leer, editar y borrar (*create, read, update, delete*). Mañana tendrás varios: la prueba pide route handlers para cada recurso. La idea es dejar uno completo en la plantilla, con un recurso genérico como `Category`, para copiarlo y cambiar solo los nombres y los campos.

**Los dos archivos de cada recurso**

| Archivo | Métodos | Para qué |
| --- | --- | --- |
| `src/app/api/categories/route.ts` | `GET`, `POST` | Listar todas y crear una |
| `src/app/api/categories/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Ver una, editarla y borrarla |

**La receta que sigue cada método**

1. Comprobar la sesión y el rol si hace falta (por ejemplo, solo el administrador crea categorías).
2. Validar lo que llega con zod.
3. Consultar o modificar la base con Prisma.
4. Responder con el código correcto: 200 al leer o editar, 201 al crear, 204 al borrar, o un error del paso 4.

**Las reglas que se repiten en casi todas las pruebas**

- Un registro con relaciones no se borra: Prisma lo impide con `onDelete: Restrict` y el handler responde 409.
- Un usuario solo edita o borra lo suyo, aunque cambie el id en la URL: compara el dueño del registro con el id de la sesión y responde 403.
- Una regla que depende de otros datos (un máximo de elementos activos, por ejemplo) se comprueba dentro del handler, y la que debe ser atómica, dentro de una transacción de Prisma.

Va después de los pasos 1 a 4 porque usa la sesión, la validación y los errores. Si esta noche no llegas, mañana lo haces tú con la misma receta.

## Paso 6 · Extras si hay tiempo

Todo esto la prueba lo pide, pero no bloquea nada de lo anterior. Haz primero los pasos 1 a 5 y marca aquí lo que vayas terminando.

- [ ] **i18n con `next-intl`.** Es la librería más sencilla con App Router. Guardas los textos en `messages/es.json` y `messages/en.json`, los usas con `t("home.title")` y añades un selector de idioma visible en la navbar.
- [ ] **Docker.** Un `Dockerfile` en dos etapas (construir y ejecutar) y un `docker-compose.yml` que pase las variables del `.env`. Para que la imagen sea pequeña, pon `output: "standalone"` en `next.config.ts`. Prueba con `docker build -t next-template .` y `docker run --env-file .env -p 3000:3000 next-template`.
- [ ] **`.env.example`.** Todas las variables, sin valores reales: `DATABASE_URL`, `DIRECT_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES_IN` y `REFRESH_TOKEN_EXPIRES_IN`.
- [ ] **README con esqueleto.** Descripción, requisitos previos, explicación de cada variable (de dónde sale la cadena de Supabase y cómo generar los secretos), comandos de desarrollo en orden (instalar, `.env`, migraciones, seed, `npm run dev`), Docker, scripts y estructura de carpetas. La prueba lo evalúa: si alguien no puede ejecutar el proyecto siguiendo solo el README, penalizan.
- [ ] **`docs/` con tres plantillas vacías.** `SCHEMA.md` (tablas y relaciones), `REGLAS.md` (cada regla de negocio y si se resuelve en la base, el backend o la interfaz) y `API.md` (los endpoints). Mañana los rellenas con el enunciado en los primeros 20 minutos, antes de programar.
- [ ] **Componente con datos del cliente.** Una cuenta regresiva que calcula el tiempo restante solo después de montarse (`useEffect`), para que el servidor y el cliente muestren lo mismo al hidratar y no haya errores de hidratación.
- [ ] **`next/image`.** Las imágenes de los artículos con `<Image>`, autorizando el dominio de origen en `remotePatterns` de `next.config.ts`.
- [ ] **Prueba final de la plantilla.** Clónala en otra carpeta y haz instalación, migración, `npm run dev`, `docker build` y un despliegue de prueba en Vercel. Si algo falla mañana, que falle hoy.

## Si algo falla

Los errores que ya nos aparecieron, con su causa y su solución.

| Síntoma | Causa | Solución |
| --- | --- | --- |
| Tus páginas nuevas no aparecen, sigue la de ejemplo | Hay dos carpetas `app`: una en la raíz y otra en `src` | Deja solo `src/app`. Al crear el proyecto responde **Yes** a `src/` |
| `Can't resolve './globals.css'` | `globals.css` y `favicon.ico` quedaron en `src` y no dentro de `src/app` | Arrástralos a `src/app` |
| `The default export is not a React Component in "/layout"` | Un `layout.tsx` o `page.tsx` está vacío, sin guardar o sin `export default` | Guárdalo con `Ctrl + S` y revisa que tenga `export default function ...` |
| `definePrismaConfig is not a function` | Quedó un `prisma.config.ts` de Prisma 8 y estás con Prisma 7 | Borra ese archivo, instala `prisma@7` y vuelve a ejecutar `npx prisma init` |
| `npx prisma -v` dice 8.x | `npx` bajó la última versión | `npm install -D prisma@7` y `npm install @prisma/client@7 @prisma/adapter-pg@7` |
| No aparecen las tablas en Supabase | La migración no se ejecutó o falló, o miras otro esquema o proyecto | Ejecuta `npx prisma migrate dev --name init`, mira el esquema `public` y recarga |
| La migración falla al conectar | Contraseña con símbolos o cadena mal copiada | Genera una contraseña sin símbolos en Supabase y revisa las dos cadenas del `.env` |
| `Cannot find module '@/generated/prisma/client'` | No se generó el cliente de Prisma | Ejecuta `npx prisma generate` y añade el script `postinstall` |
| Subrayados rojos con "no suggestions" en el schema | Es el corrector ortográfico de VS Code, no un error de Prisma | Ignóralos o desactiva *Code Spell Checker* para archivos `prisma` |

Si aparece un error que no está aquí, copia el mensaje completo de la terminal, con la contraseña oculta, y dáselo a Claude.

## Mañana, antes de programar

Los primeros 30 minutos deciden el resto. No empieces a escribir código hasta tener esto.

- [ ] Lee el enunciado completo, dos veces, y subraya las reglas de negocio.
- [ ] Clona la plantilla (*Use this template* en GitHub) y comprueba que `npm install`, `npx prisma migrate dev` y `npm run dev` funcionan con tu Supabase.
- [ ] Rellena `docs/SCHEMA.md`: las tablas, sus columnas, las relaciones y qué pasa al borrar (`Restrict` o `Cascade`).
- [ ] Rellena `docs/REGLAS.md`: cada regla de negocio y dónde se garantiza (base de datos, backend o interfaz).
- [ ] Rellena `docs/API.md`: cada endpoint, quién puede llamarlo y qué errores devuelve.
- [ ] Añade las tablas del dominio a `schema.prisma` y ejecuta una migración.
- [ ] Haz el seed: el administrador, las categorías y los datos de ejemplo.
- [ ] Copia el CRUD de ejemplo una vez por recurso y añade las reglas de negocio.
- [ ] Construye las páginas, con la estrategia de renderizado que pida el enunciado (SSG, SSR o CSR).
- [ ] Deja 45 minutos para el README, el despliegue y una prueba final desde cero.

Si el tiempo se acaba, es mejor entregar menos funciones que funcionen y un README que permita ejecutarlas, que muchas a medias.

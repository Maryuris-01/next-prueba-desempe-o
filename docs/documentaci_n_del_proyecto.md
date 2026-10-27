# UT Next - E-Commerce Platform

## 1. Descripción breve del proyecto

**UT Next** es una plataforma web e-commerce moderna desarrollada con **Next.js (App Router)**, **TypeScript** y **Tailwind CSS**. La aplicación permite navegar por catálogos de productos, filtrarlos por categorías, ver detalles individualizados de cada artículo, gestionar la autenticación de usuarios (login y registro) e interactuar con una API centralizada para la administración de productos y usuarios.

---

## 2. Requisitos previos

Antes de comenzar, asegúrate de contar con los siguientes elementos instalados y configurados:

* **Node.js**: Versión `v18.x` o superior (se recomienda v20 LTS).
* **Gestor de paquetes**: `npm` (incluido con Node.js), `pnpm` o `yarn`.
* **Docker y Docker Compose**: Opcional, necesario únicamente para la ejecución mediante contenedores.
* **Cuenta y Proyecto en Supabase** (o base de datos PostgreSQL):
  * Un proyecto creado en [Supabase](https://supabase.com/).
  * Acceso a las claves de la API de Supabase y a la cadena de conexión de la base de datos (Database URL).

---

## 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto tomando como plantilla el archivo `.env.example`. A continuación se detalla cada variable:

| Variable | Descripción | Valor esperado / Ejemplo | ¿Cómo obtenerlo? |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. | `https://xxxx.supabase.co` | En Supabase: *Project Settings > API > Project URL*. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anónima de la API. | `eyJhbGciOiJIUzI1Ni...` | En Supabase: *Project Settings > API > Project API keys (anon/public)*. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave privada con permisos de administrador. | `eyJhbGciOiJIUzI1Ni...` | En Supabase: *Project Settings > API > Project API keys (service_role)*. |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. | `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres` | En Supabase: *Project Settings > Database > Connection string (URI)*. |
| `JWT_SECRET` | Secreto para firmar y verificar tokens de sesión. | Cadena aleatoria segura (ej. `super_secret_jwt_key_12345`) | Se genera manualmente mediante terminal con `openssl rand -base64 32` o escribiendo una clave robusta. |
| `NEXT_PUBLIC_API_URL` | URL base de las API Routes locales. | `http://localhost:3000` | Para desarrollo local usar `http://localhost:3000`. En producción, la URL del dominio desplegado. |

---

## 4. Ejecución en desarrollo

Sigue estos pasos en orden exacto para poner en marcha la aplicación localmente:

### a. Clonar el repositorio e instalar dependencias
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd Next-main
npm install
```

### b. Crear el `.env` a partir del `.env.example` y completarlo
```bash
cp .env.example .env
```
*Edita el archivo `.env` resultante e introduce tus valores reales de conexión y claves.*

### c. Ejecutar las migraciones
Para aplicar el esquema de la base de datos:
```bash
npx prisma migrate dev
# O en su defecto, si utilizas los scripts directos de Supabase o SQL:
npm run db:migrate
```

### d. Ejecutar el seed
Para poblar la base de datos con datos de prueba y crear el usuario administrador:
```bash
npm run db:seed
```

### e. Levantar el proyecto en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 5. Credenciales del administrador creado por el seed

Tras ejecutar el script de seed (`npm run db:seed`), se creará automáticamente un usuario administrador con el que podrás probar el sistema:

* **Email:** `admin@utnext.com`
* **Contraseña:** `Admin1234!`
* **Rol:** `ADMIN`

---

## 6. Ejecución con Docker

### Construcción de la imagen
Para construir la imagen Docker del proyecto, ejecuta:
```bash
docker build -t ut-next-app .
```

### Correr el contenedor pasando variables de entorno
Puedes pasar las variables directamente mediante la opción `-e` o usando tu archivo `.env`:

**Opción A: Usando el archivo `.env`**
```bash
docker run -d -p 3000:3000 --env-file .env --name ut-next-container ut-next-app
```

**Opción B: Pasando las variables explícitamente**
```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key" \
  -e JWT_SECRET="tu_jwt_secret" \
  --name ut-next-container ut-next-app
```

La aplicación quedará mapeada en `http://localhost:3000`.

---

## 7. Scripts disponibles en `package.json`

A continuación se listan los comandos definidos en el proyecto y sus funciones:

* `npm run dev`: Inicia el servidor de desarrollo en modo *Watch* con recarga rápida.
* `npm run build`: Compila y optimiza la aplicación para entorno de producción.
* `npm run start`: Inicia un servidor HTTP en producción tras haber construido el proyecto con `build`.
* `npm run lint`: Ejecuta ESLint para analizar y reportar problemas en el código fuente.
* `npm run db:migrate`: Aplica las migraciones pendientes en la base de datos.
* `npm run db:seed`: Ejecuta el script de poblamiento de datos inciales (*seeding*).

---

## 8. Estructura de carpetas del proyecto

```text
Next-main/
├── app/                      # Rutas, páginas y endpoints API de Next.js (App Router)
│   ├── api/                  # Endpoints de la API interna (ej. /api/login, /api/auth)
│   ├── categories/           # Vistas para listar y ver detalle de categorías
│   ├── products/             # Vistas para listar y ver detalle de productos
│   ├── globals.css           # Estilos globales y Tailwind CSS
│   ├── layout.tsx            # Contenedor/Diseño global del sitio
│   └── page.tsx              # Página de inicio (Landing Page / Home)
├── components/               # Componentes reutilizables de la UI
│   ├── layout/               # Componentes estructurales (Navbar, Footer, etc.)
│   └── products/             # Componentes específicos de productos (Filtros, Cards)
├── docs/                     # Documentación adicional del proyecto
├── lib/                      # Funciones de ayuda, cliente HTTP y configuraciones globales
├── types/                    # Definiciones de tipos e interfaces de TypeScript
├── public/                   # Recursos estáticos (imágenes, favicons, etc.)
├── .env.example              # Plantilla de variables de entorno
├── dockerfile                # Configuración para contenedor Docker
├── next.config.ts            # Configuración general de Next.js
├── package.json              # Módulos y scripts del proyecto
└── tsconfig.json             # Configuración del compilador TypeScript
```

---

## 9. URL de la aplicación desplegada

La aplicación se encuentra desplegada y pública en el siguiente enlace:

* **URL:** [https://ut-next.vercel.app](https://ut-next.vercel.app) *(Sustituir por la URL real de tu despliegue)*
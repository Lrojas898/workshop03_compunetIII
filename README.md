# Gym Manager - Frontend

Sistema de gestión de gimnasio construido con Next.js 16, React 19 y TypeScript.

## Descripción

Gym Manager es una aplicación web completa para administrar un gimnasio, con funcionalidades para:
- Gestión de usuarios (Admin, Recepcionista, Entrenador, Cliente)
- Tipos de membresías y suscripciones
- Control de asistencias (check-in/check-out)
- Analíticas y reportes
- Dashboard específicos por rol

## Requisitos Previos

- Node.js 18+ (se recomienda la versión LTS actual)
- npm, yarn, pnpm o bun como gestor de paquetes
- El backend de Gym Manager ejecutándose (por defecto en http://localhost:3000)

## Instalación

### 1. Clonar el repositorio (si aún no lo has hecho)

```bash
git clone <url-del-repositorio>
cd gym-frontend
```

### 2. Instalar dependencias

```bash
npm install
# o con yarn
yarn install
# o con pnpm
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Nota:** La variable utiliza el prefijo `NEXT_PUBLIC_` para que sea accesible tanto en servidor como en cliente.

Si tu backend está en otro puerto o host, ajusta la URL correspondiente:
```bash
NEXT_PUBLIC_API_URL=http://tu-backend:puerto
```

## Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

Luego abre tu navegador en [http://localhost:3000](http://localhost:3000)

El servidor incluye hot-reload, por lo que los cambios se reflejan automáticamente.

### Compilación para Producción

```bash
npm run build
npm start
```

### Linting y Validación

```bash
npm run lint
```

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── (authentication)/   # Rutas de login y registro
│   │   ├── login/         # Página de inicio de sesión
│   │   └── register/      # Página de registro
│   ├── (dashboard)/       # Dashboard protegido
│   │   ├── admin/         # Panel de administrador
│   │   ├── receptionist/  # Panel de recepcionista
│   │   ├── coach/         # Panel de entrenador
│   │   └── client/        # Panel de cliente
│   ├── components/        # Componentes React
│   │   ├── shared/        # Componentes genéricos reutilizables
│   │   └── features/      # Componentes específicos por funcionalidad
│   ├── services/          # Servicios HTTP para comunicarse con el backend
│   ├── interfaces/        # Interfaces y tipos TypeScript
│   ├── config/            # Configuraciones de la aplicación
│   ├── providers/         # Providers React (Context, etc.)
│   └── stores/            # Gestión de estado global (Zustand)
├── lib/                   # Utilidades y helpers
│   └── api.ts            # Configuración de Axios
└── public/               # Archivos estáticos
```

## Flujo de Autenticación

1. **Registro/Login:** El usuario se registra o inicia sesión en `/login` o `/register`
2. **Obtención de Token:** El backend devuelve un token JWT
3. **Almacenamiento:** El token se guarda en `localStorage` como `authToken`
4. **Redirección:** Se redirige al usuario al dashboard según su rol:
   - **admin** → `/admin`
   - **receptionist** → `/receptionist`
   - **coach** → `/coach`
   - **client** → `/client`
5. **Interceptor:** Todas las peticiones HTTP incluyen el token en el header `Authorization`

## Endpoints Esperados del Backend

La aplicación espera los siguientes endpoints (configurables en `src/lib/configuration/api-endpoints.ts`):

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth` - Obtener todos los usuarios (admin)
- `GET /auth/:id` - Obtener usuario por ID
- `PATCH /auth/:id` - Actualizar usuario
- `DELETE /auth/:id` - Eliminar usuario (admin)

### Membresías
- `GET /memberships` - Listar membresías
- `POST /memberships` - Crear membresía
- `GET /memberships/:id` - Obtener membresía
- `PATCH /memberships/:id` - Actualizar membresía
- `DELETE /memberships/:id` - Eliminar membresía

### Suscripciones
- `GET /subscriptions` - Listar suscripciones
- `POST /subscriptions` - Crear suscripción
- `GET /subscriptions/:id` - Obtener suscripción
- `POST /subscriptions/:id/memberships` - Agregar membresía
- `DELETE /subscriptions/:id/memberships` - Remover membresía

### Asistencias
- `POST /attendances/check-in` - Registrar entrada
- `POST /attendances/check-out` - Registrar salida
- `GET /attendances/status/:userId` - Estado actual del usuario
- `GET /attendances/history/:userId` - Historial de asistencias
- `GET /attendances/stats/:userId` - Estadísticas de asistencias
- `GET /attendances/active` - Usuarios actualmente en el gym

## Credenciales de Prueba

Para probar la aplicación, usa las siguientes credenciales (después de ejecutar el seed del backend):

- **Admin:** `admin@example.com` / `admin123`
- **Receptionist:** `receptionist@example.com` / `recep123`
- **Coach:** `coach@example.com` / `coach123`
- **Client:** `client@example.com` / `client123`

## Tecnologías Utilizadas

- **Next.js 16** - Framework React con SSR
- **React 19** - Biblioteca de UI
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Estilos
- **Axios** - Cliente HTTP
- **React Query** (configurado pero en desarrollo)
- **Zustand** (configurado pero en desarrollo)
- **NextAuth.js** (configurado pero en desarrollo)

## Variables de Entorno

| Variable | Descripción | Por Defecto |
|----------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend | `http://localhost:3000` |

## Solución de Problemas

### Error: "Cannot connect to API"
- Verifica que el backend esté ejecutándose en la URL especificada en `NEXT_PUBLIC_API_URL`
- Comprueba la consola del navegador (F12) para ver mensajes de error más detallados

### Error: "Token inválido" o redirige a login constantemente
- Asegúrate de que el backend está devolviendo el token correctamente
- Verifica que el formato del token en el header `Authorization` sea: `Bearer <token>`

### Cambios no se reflejan en el navegador
- Limpia el caché del navegador (Ctrl+Shift+Supr)
- Recarga la página (Ctrl+F5)
- Si usas hot-reload, asegúrate de que el servidor dev sigue ejecutándose

### Puerto 3000 ya está en uso
```bash
# Cambia el puerto
npm run dev -- -p 3001
```

## Desarrollo

### Agregar nueva ruta/página
1. Crea una carpeta en `src/app/(dashboard)/turol/nueva-pagina/`
2. Crea el archivo `page.tsx` dentro
3. Importa los componentes necesarios
4. El enrutamiento es automático

### Agregar nuevo servicio
1. Crea un archivo en `src/app/services/tunombre/`
2. Importa `apiService` de `../api.service`
3. Exporta las funciones para comunicarse con el backend

### Agregar componentes reutilizables
Coloca componentes genéricos en `src/app/components/shared/`
Coloca componentes específicos de una funcionalidad en `src/app/components/features/`

## Build y Despliegue

### Build para Producción
```bash
npm run build
npm start
```

### Despliegue en Vercel (recomendado)
1. Conecta tu repositorio a Vercel
2. Configura `NEXT_PUBLIC_API_URL` en variables de entorno
3. Vercel detectará automáticamente que es un proyecto Next.js

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |

## Contacto y Soporte

Para problemas, preguntas o sugerencias, contacta con el equipo de desarrollo.

# Informe del Proyecto - Gym Frontend

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Arquitectura General](#arquitectura-general)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Funcionalidades Principales](#funcionalidades-principales)
7. [Patrones de Desarrollo](#patrones-de-desarrollo)
8. [Flujo de Datos](#flujo-de-datos)
9. [Estado del Proyecto](#estado-del-proyecto)
10. [Próximos Pasos](#próximos-pasos)
11. [Guía de Desarrollo](#guía-de-desarrollo)

---

## Resumen Ejecutivo

Temple Gym es un sistema de gestión integral para gimnasios que se construye como una aplicación web de una sola página (SPA) con Next.js. El sistema maneja múltiples roles de usuario (administrador, entrenador, recepcionista, cliente) y proporciona funcionalidades específicas para cada uno de ellos.

El proyecto está en una fase de desarrollo activo con componentes y servicios base implementados. El frontend se conecta a un backend REST API y utiliza WebSocket para notificaciones en tiempo real.

---

## Descripción del Proyecto

### Propósito

Proporcionar una plataforma web donde los gimnasios puedan:

- Gestionar usuarios y sus roles
- Administrar membresías y suscripciones
- Registrar check-in/check-out de clientes
- Controlar asistencia a clases
- Generar reportes de actividad

### Roles de Usuario

1. **Administrador**: Acceso total al sistema. Gestiona usuarios, membresías, suscripciones y visualiza reportes.
2. **Entrenador (Coach)**: Gestiona clases y sus asistentes. Puede ver información de miembros.
3. **Recepcionista**: Realiza check-in/check-out de usuarios. Monitorea quién está dentro del gimnasio.
4. **Cliente**: Compra membresías, visualiza su suscripción activa y su historial de asistencias.

### Características Principales

- Autenticación basada en JWT
- Gestión de roles dinámicos
- Sincronización en tiempo real vía WebSocket
- Sistema de persistencia de sesión en cliente
- Interfaz adaptativa según el rol del usuario

---

## Stack Tecnológico

### Frontend

| Componente | Versión | Propósito |
|-----------|---------|----------|
| Next.js | 16.0.1 | Framework React con SSR y routing basado en archivos |
| React | 19.2.0 | Librería de UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Framework de estilos utilitarios |
| Zustand | 5.0.8 | Gestión de estado global |
| Axios | 1.13.2 | Cliente HTTP |
| Socket.io | 4.8.1 | WebSocket para comunicación en tiempo real |
| Lucide React | 0.553.0 | Iconografía |
| React Hot Toast | 2.6.0 | Sistema de notificaciones |

### Testing

| Herramienta | Versión | Propósito |
|-----------|---------|----------|
| Vitest | 4.0.9 | Framework de pruebas unitarias |
| @vitest/coverage-v8 | 4.0.9 | Generador de cobertura |
| @vitest/ui | 4.0.9 | UI para vitest |
| @testing-library/react | 16.3.0 | Utilidades de testing para React |
| Cypress | 15.6.0 | Testing E2E |
| jsdom | 27.2.0 | Simulador de DOM |

### Herramientas de Desarrollo

- ESLint: Validación de código
- Node.js con npm: Gestor de paquetes

---

## Arquitectura General

### Patrón de Capas

El proyecto sigue una arquitectura de capas clara:

```
Presentation Layer (Componentes React)
        ↓
Business Logic Layer (Servicios HTTP)
        ↓
Data Access Layer (Axios + Interceptores)
        ↓
State Management (Zustand Stores)
        ↓
Backend REST API
```

### Separación de Responsabilidades

- **Componentes**: Responsables solo de renderizar UI y capturar eventos del usuario
- **Servicios**: Abstracción de llamadas HTTP al backend
- **Stores**: Manejo de estado global y persistencia
- **Interfaces**: Definición de tipos para toda la aplicación
- **Config**: Configuración centralizada (endpoints, navegación, etc)

---

## Estructura de Carpetas

### Organización Principal

```
src/
├── app/
│   ├── (authentication)/          # Rutas públicas (login, register)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/               # Rutas protegidas por rol
│   │   ├── admin/                 # Panel administrativo
│   │   ├── coach/                 # Panel de entrenador
│   │   ├── receptionist/          # Panel de recepción
│   │   ├── client/                # Panel de cliente
│   │   └── layout.tsx             # Layout principal con sidebar
│   │
│   ├── api/                       # API Routes de Next.js
│   │   └── auth/[...nextauth]/   # NextAuth (pendiente)
│   │
│   ├── components/                # Componentes React
│   │   ├── ui/                    # Componentes base (Button, Modal, etc)
│   │   ├── shared/                # Componentes reutilizables
│   │   └── features/              # Componentes específicos de funcionalidades
│   │
│   ├── services/                  # Servicios HTTP
│   │   ├── api.service.ts         # Wrapper genérico
│   │   ├── auth/
│   │   ├── memberships/
│   │   ├── subscriptions/
│   │   ├── attendances/
│   │   └── classes/
│   │
│   ├── interfaces/                # Tipos TypeScript
│   │   ├── auth.interface.ts
│   │   ├── memberships.interface.ts
│   │   ├── subscriptions.interface.ts
│   │   ├── attendance.interface.ts
│   │   └── index.ts
│   │
│   ├── _store/                    # Zustand stores (estado global)
│   │   └── auth/
│   │       ├── auth.store.ts
│   │       └── interfaces/
│   │
│   ├── stores/                    # Stores adicionales (plantillas)
│   │   ├── ui-state.store.ts
│   │   └── table-filters.store.ts
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── useWebSocketRoleSync.ts
│   │
│   ├── config/                    # Configuración centralizada
│   │   ├── navigation-by-role.ts
│   │   └── data-table-configs.ts
│   │
│   ├── providers/                 # Context providers
│   │   ├── SessionAuthProvider.tsx
│   │   ├── ThemeCustomizationProvider.tsx
│   │   └── ReactQueryProvider.tsx
│   │
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Estilos globales
│   └── not-found.tsx
│
└── lib/                           # Librerías y configuración
    ├── api.ts                     # Instancia de Axios
    └── configuration/
        └── api-endpoints.ts       # Endpoints centralizados
```

### Ventajas de esta Estructura

- **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar las existentes
- **Mantenibilidad**: Cambios en servicios no afectan componentes
- **Reutilización**: Componentes compartidos evitan duplicación
- **Testing**: Cada capa puede testearse independientemente

---

## Funcionalidades Principales

### 1. Autenticación y Autorización

- Login y registro de usuarios
- Generación y almacenamiento de JWT en cliente
- Persistencia de sesión en localStorage mediante Zustand
- Protección de rutas basada en autenticación
- Control de acceso basado en roles (RBAC)

**Flujo**:
```
Usuario ingresa credenciales
    ↓
authService.login(email, password)
    ↓
Backend valida y retorna token
    ↓
useAuthStore.login() persiste token y user en localStorage
    ↓
DashboardLayout redirige a dashboard según rol
```

### 2. Gestión de Usuarios (Admin)

- CRUD de usuarios
- Asignación y revocación de roles
- Activación/desactivación de cuentas
- Eliminación de usuarios
- Búsqueda y filtrado en tablas

**Servicios involucrados**:
- `authenticationService.getAllUsers()`
- `authenticationService.createUser()`
- `authenticationService.updateUser()`
- `authenticationService.assignRoles()`
- `authenticationService.deleteUser()`

### 3. Gestión de Membresías (Admin)

- Crear tipos de membresías
- Definir características (precio, límites de acceso)
- Editar y eliminar membresías
- Activación/desactivación

**Servicios involucrados**:
- `membershipsService.getAll()`
- `membershipsService.create()`
- `membershipsService.update()`
- `membershipsService.delete()`
- `membershipsService.toggleStatus()`

### 4. Gestión de Suscripciones (Admin/Cliente)

- Clientes adquieren membresías
- Estados: activa, pendiente, expirada, cancelada
- Historial de suscripciones
- Agregar más membresías a suscripción existente

**Servicios involucrados**:
- `subscriptionsService.create()`
- `subscriptionsService.getByUserId()`
- `subscriptionsService.addMembership()`
- `subscriptionsService.activate()`
- `subscriptionsService.deactivate()`

### 5. Control de Asistencias (Recepcionista/Cliente)

- Check-in al llegar al gimnasio
- Check-out al irse
- Validación de límites de acceso
- Historial de asistencias
- Estadísticas de uso

**Servicios involucrados**:
- `attendancesService.checkIn()`
- `attendancesService.checkOut()`
- `attendancesService.getStatus()`
- `attendancesService.getHistory()`
- `attendancesService.getStats()`

### 6. Gestión de Clases (Coach/Admin)

- Crear clases
- Registrar asistencia de miembros
- Control de capacidad
- Programación de clases

**Servicios involucrados**:
- `classesService.getAll()`
- `classesService.registerClass()`
- `classesService.getMyClasses()`

### 7. Dashboards Específicos por Rol

Cada rol tiene su propio dashboard con información relevante:

- **Admin**: Resumen de usuarios, membresías, suscripciones y asistencias
- **Coach**: Clases programadas y miembros registrados
- **Recepcionista**: Usuarios actualmente dentro del gimnasio, check-in/out
- **Cliente**: Membresías activas, historial de asistencias, clases disponibles

---

## Patrones de Desarrollo

### 1. Patrón de Componentes

```
UI Components (Presentación)
├── Button.tsx - Botón genérico
├── Modal.tsx - Modal dialog
├── Table.tsx - Tabla base
└── Input.tsx - Input de formulario

Shared Components (Reutilizable)
├── cards/ - Tarjetas
├── forms/ - Campos de formulario reutilizables
├── dialogs/ - Diálogos comunes
└── data-table/ - Componentes de tabla de datos

Feature Components (Lógica específica)
├── authentication/ - LoginForm, RegisterForm
├── memberships/ - MembershipsList, MembershipForm
├── subscriptions/ - SubscriptionsList, SubscriptionForm
├── attendances/ - CheckInForm, AttendanceHistory
└── classes/ - ClassesList, ClassForm
```

### 2. Patrón de Servicios HTTP

```typescript
// Nivel genérico
const apiService = {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: any): Promise<T>
  put<T>(url: string, data: any): Promise<T>
  delete<T>(url: string): Promise<T>
}

// Nivel específico
const membershipsService = {
  getAll: () => apiService.get<Membership[]>('/memberships'),
  create: (dto: CreateMembershipDto) =>
    apiService.post<Membership>('/memberships', dto),
  // más métodos...
}

// Uso en componentes
const [data, setData] = useState<Membership[]>([])
useEffect(() => {
  membershipsService.getAll()
    .then(setData)
    .catch(error => console.error(error))
}, [])
```

### 3. Patrón de Gestión de Estado Global

```typescript
// Zustand store con persistencia
const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Estado
      isAuthenticated: false,
      user: null,
      token: null,

      // Acciones
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
      updateUser: (userData) => set(state => ({
        user: { ...state.user, ...userData }
      }))
    }),
    { name: 'auth-storage' } // Persistencia en localStorage
  )
)

// Uso en componentes
const { isAuthenticated, user, login, logout } = useAuthStore()
```

### 4. Patrón de Protección de Rutas

```typescript
// Root layout valida autenticación
export default function DashboardLayout({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsHydrated(true)
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated])

  if (!isHydrated || !isAuthenticated) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  )
}
```

### 5. Patrón de Grupo de Rutas

Next.js permite agrupar rutas sin afectar la estructura de URL:

```
(authentication)/        → /login, /register (sin prefijo)
  ├── login/page.tsx
  └── register/page.tsx

(dashboard)/            → /admin, /coach, etc (sin prefijo)
  ├── admin/page.tsx
  ├── coach/page.tsx
  └── receptionist/page.tsx
```

Esto mantiene rutas públicas separadas de protegidas sin necesidad de rutas con prefijos.

### 6. Patrón de Interfaces/DTOs

```typescript
// Entidad del dominio
interface User {
  id: string
  email: string
  fullName: string
  roles: Role[]
  isActive: boolean
}

// DTO para operaciones
interface LoginDto {
  email: string
  password: string
}

interface CreateUserDto {
  email: string
  password: string
  fullName: string
}

// Respuesta API
interface AuthResponse {
  token: string
  user: User
}
```

### 7. Patrón de Sincronización en Tiempo Real

```typescript
// Custom hook para WebSocket
useWebSocketRoleSync() →
  1. Se conecta al WebSocket cuando user inicia sesión
  2. Escucha evento "roleChanged"
  3. Actualiza Zustand store con nuevo rol
  4. Redirige si rol principal cambió
  5. Desconecta al logout
```

---

## Flujo de Datos

### Flujo de Autenticación

```
┌──────────────────────────┐
│   Usuario: Login Form    │
│   email, password        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ authService.login(email, pass)   │
│ POST /auth/login                 │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Axios Interceptor       │
│  Agregar headers, etc    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Backend API            │
│   Valida credenciales    │
│   Retorna token + user   │
└────────┬─────────────────┘
         │ {token, user, roles}
         ▼
┌──────────────────────────┐
│  useAuthStore.login()    │
│  Zustand persiste en LS  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ DashboardLayout          │
│ Verifica rol             │
│ Redirige a dashboard     │
└──────────────────────────┘
```

### Flujo de Obtención de Datos

```
┌──────────────────────────┐
│  Componente mounted      │
│  useEffect con []        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ membershipService.getAll()   │
│ GET /memberships             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Axios interceptor       │
│  Agrega Authorization    │
│  Bearer {token}          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Backend API            │
│   Valida token           │
│   Retorna datos          │
└────────┬─────────────────┘
         │ Array<Membership>
         ▼
┌──────────────────────────┐
│ useState -> setData()     │
│ Componente se re-renderiza
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  GenericDataTable        │
│  Muestra datos al usuario│
└──────────────────────────┘
```

### Flujo de Creación de Recurso

```
┌────────────────────────┐
│  Usuario: Form submit  │
│  (ej: crear membership)│
└────────┬───────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ membershipsService.create(formData)│
│ POST /memberships                  │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Axios + Interceptor       │
│  Agrega auth + validate    │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│   Backend API              │
│   Valida datos             │
│   Guarda recurso           │
│   Retorna recurso creado   │
└────────┬───────────────────┘
         │ Membership creado
         ▼
┌────────────────────────────┐
│ setState - agregar a lista │
│ toast.success()            │
│ Redirige o cierra modal    │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  UI actualiza con nuevo    │
│  recurso en la tabla       │
└────────────────────────────┘
```

---

## Estado del Proyecto

### Completado

- Estructura base del proyecto con Next.js 16
- Configuración de TypeScript y Tailwind CSS
- Implementación de Zustand para autenticación
- Servicios HTTP para todas las entidades principales
- Componentes de autenticación (login, registro)
- Layouts con protección de rutas
- Configuración centralizada de endpoints y navegación
- Custom hook para sincronización en tiempo real vía WebSocket
- Componentes de dashboard por rol
- Interfaz de tablas genérica (estructura base)
- Manejo de errores con interceptores de Axios
- Sistema de notificaciones con React Hot Toast
- Configuración de Cypress para E2E testing
- Configuración de Vitest para testing unitario

### En Progreso

- Implementación completa de GenericDataTable con TanStack Table
- Completar suite de componentes de features
- Escribir tests unitarios
- Escribir tests E2E

### Pendiente

- Implementación de NextAuth.js (configurado pero no usado)
- UI State Store con Zustand (template comentado)
- Persistencia de filtros de tabla
- React Query para caching de datos
- Documentación de componentes
- Deployment en producción

---

## Próximos Pasos

### Corto Plazo (Desarrollo Inmediato)

1. **Completar Tests Unitarios**
   - Escribir tests para servicios HTTP
   - Tests para Zustand stores
   - Tests para componentes de formularios
   - Generar reporte de cobertura

   Comando: `npm run test:coverage`

2. **Terminar Componentes de Features**
   - Completar todas las formas (forms) de creación/edición
   - Implementar confirmaciones de eliminación
   - Validaciones de formularios

3. **Tests E2E con Cypress**
   - Login y flujo de autenticación
   - Crear/editar/eliminar recursos
   - Verificar redirecciones por rol

### Mediano Plazo

1. **Optimización de Performance**
   - Implementar React Query para caching
   - Lazy loading de componentes pesados
   - Optimizar imágenes

2. **Mejoras de UX**
   - Agregar más validaciones de formularios
   - Mejorar estados de carga
   - Confirmaciones más amigables

3. **Seguridad**
   - Implementar CSRF protection
   - Validar permisos en backend (ya hecho)
   - Auditoría de acciones críticas

### Largo Plazo

1. **Escalabilidad**
   - Considerar GraphQL si crece complejidad
   - Implementar feature flags
   - Versionamiento de API

2. **Documentación**
   - Guía de desarrollo
   - API de componentes
   - Guía de deployment

3. **Experiencia**
   - Tema claro/oscuro
   - Internacionalización (i18n)
   - Accesibilidad (a11y)

---

## Guía de Desarrollo

### Flujo para Agregar una Nueva Funcionalidad

Siguiendo la arquitectura del proyecto, estos son los pasos:

#### 1. Definir Interfaces

Crea archivo `src/app/interfaces/nueva-entidad.interface.ts`:

```typescript
export interface NuevaEntidad {
  id: string
  nombre: string
  descripcion: string
  // más campos
}

export interface CreateNuevaEntidadDto {
  nombre: string
  descripcion: string
}

export interface UpdateNuevaEntidadDto {
  nombre?: string
  descripcion?: string
}
```

#### 2. Crear Servicio HTTP

Crea archivo `src/app/services/nueva-entidad.service.ts`:

```typescript
import { apiService } from './api.service'
import { NuevaEntidad, CreateNuevaEntidadDto } from '@/interfaces'

export const nuevaEntidadService = {
  getAll: () => apiService.get<NuevaEntidad[]>('/nueva-entidad'),
  getById: (id: string) => apiService.get<NuevaEntidad>(`/nueva-entidad/${id}`),
  create: (dto: CreateNuevaEntidadDto) => apiService.post<NuevaEntidad>('/nueva-entidad', dto),
  update: (id: string, dto: UpdateNuevaEntidadDto) =>
    apiService.put<NuevaEntidad>(`/nueva-entidad/${id}`, dto),
  delete: (id: string) => apiService.delete<void>(`/nueva-entidad/${id}`),
}
```

#### 3. Crear Componentes de Features

Carpeta `src/app/components/features/nueva-entidad/`:

- `NuevaEntidadForm.tsx` - Formulario crear/editar
- `NuevaEntidadList.tsx` - Listado con tabla
- `NuevaEntidadDetails.tsx` - Vista de detalles

```typescript
// src/app/components/features/nueva-entidad/NuevaEntidadList.tsx
'use client'

import { useEffect, useState } from 'react'
import { nuevaEntidadService } from '@/services'
import { NuevaEntidad } from '@/interfaces'
import { toast } from 'react-hot-toast'

export default function NuevaEntidadList() {
  const [data, setData] = useState<NuevaEntidad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const result = await nuevaEntidadService.getAll()
      setData(result)
    } catch (error) {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await nuevaEntidadService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
      toast.success('Eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Nueva Entidad</h1>
      <table>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

#### 4. Crear Página en Dashboard

Crea `src/app/(dashboard)/admin/nueva-entidad/page.tsx`:

```typescript
import NuevaEntidadList from '@/components/features/nueva-entidad/NuevaEntidadList'

export default function NuevaEntidadPage() {
  return <NuevaEntidadList />
}
```

#### 5. Actualizar Configuración de Navegación

En `src/app/config/navigation-by-role.ts`:

```typescript
export const navigationByRole = {
  admin: [
    // ... rutas existentes
    {
      label: 'Nueva Entidad',
      href: '/admin/nueva-entidad',
      icon: 'IconName' // de lucide-react
    }
  ]
}
```

#### 6. Agregar Tests

Crea `src/app/services/__tests__/nueva-entidad.service.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nuevaEntidadService } from '../nueva-entidad.service'

describe('nuevaEntidadService', () => {
  it('debe obtener todas las entidades', async () => {
    // Mock y test
  })
})
```

Luego correr: `npm run test:coverage`

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor en http://localhost:3000
npm run dev:skip-check  # Dev sin verificar backend

# Build y producción
npm run build            # Compilar para producción
npm start               # Iniciar servidor de producción

# Testing
npm run test            # Tests en modo watch
npm run test:ui         # UI de tests
npm run test:run        # Tests una sola ejecución
npm run test:coverage   # Tests con cobertura

# Linting
npm run lint            # Validar código

# E2E
npm run cypress         # Cypress (si está configurado)
```

### Mejores Prácticas del Proyecto

1. **Siempre definir tipos primero** - Comenzar por las interfaces
2. **Reutilizar servicios** - No hacer fetch directo en componentes
3. **Centralizar configuración** - Cambios en un solo lugar
4. **Manejo de errores** - Try-catch con notificaciones al usuario
5. **Validar roles** - En layout y componentes sensibles
6. **Código limpio** - Nombres descriptivos, funciones pequeñas
7. **Testing** - Tests unitarios para lógica crítica, E2E para flujos principales

---

## Referencias Técnicas

### Configuración de Axios

Archivo: `src/lib/api.ts`

El servicio de axios incluye:
- Interceptor de solicitud: Agrega token JWT en header Authorization
- Interceptor de respuesta: Maneja errores 401 y redirige a login
- Timeout de 30 segundos
- Base URL configurada

### Zustand Store

Archivo: `src/app/_store/auth/auth.store.ts`

Almacena:
- Token JWT
- Datos del usuario
- Estado de autenticación
- Funciones login/logout

Usa persistencia en localStorage con key 'auth-storage'

### Interceptores de Errores

- 401 Unauthorized: Limpia autenticación y redirige a login
- 403 Forbidden: Muestra error sin redirigir
- 500 Server Error: Notifica al usuario
- Network Error: Intenta reconectar

---

Documento generado como referencia del estado y estructura del proyecto Gym Frontend.
Última actualización: 2025-11-18

# Informe de funcionalidades – Temple Gym  Frontend

## 1. Descripción general de la aplicación

La aplicación **Gym Manager** es un frontend construido con **Next.js 16**, **React 19** y **TypeScript** para la gestión integral de un gimnasio. Se conecta a una API REST y ofrece un conjunto de módulos funcionales organizados por rol de usuario:

- **Admin**
  - Gestión completa de usuarios (creación, edición, borrado, activación/desactivación, asignación de roles).
  - Configuración de **membresías** (planes, precios, duración).
  - Gestión de **suscripciones** de los clientes a las membresías.
  - Gestión de **clases** (creación, edición, eliminación, listado).
  - Visualización y administración de **asistencias**.
- **Recepcionista**
  - Módulo de **check‑in / check‑out** de usuarios.
  - Vista de **usuarios activos** en el gimnasio.
- **Coach (entrenador)**
  - Gestión de sus **clases**.
  - Gestión de **miembros** asociados a sus clases.
  - Registro de **asistencias** a clases.
- **Client (cliente)**
  - Dashboard personal con información general.
  - Consulta de **membresías disponibles**.
  - Gestión de **su suscripción** actual.
  - Consulta de **historial de asistencias**.

Además, la aplicación incluye componentes compartidos reutilizables (tablas, formularios, modales, tarjetas) y una navegación de dashboard consistente, adaptada al rol del usuario.

---

## 2. Funcionalidades principales por módulo

### 2.1 Autenticación y registro de usuarios

Ubicación principal:
- Páginas: `src/app/(authentication)/login/page.tsx`, `src/app/(authentication)/register/page.tsx`.
- Formularios: `src/app/components/features/authentication/LoginForm.tsx`, `RegisterForm.tsx`.
- Servicio: `src/app/services/auth/authentication.service.ts`.
- Store de estado: `src/app/_store/auth/auth.store.ts`.

Funcionalidades:
- **Registro de nuevos usuarios**
  - Formulario con campos: nombre completo, email, edad, contraseña y confirmación de contraseña.
  - Validaciones de frontend: formato de email, longitud mínima de contraseña, rango de edad, coincidencia de contraseñas.
  - Llamada a `POST /auth/register` a través de `authenticationService.register`.
  - Inicio de sesión automático tras el registro y redirección al dashboard según rol.

- **Inicio de sesión (login)**
  - Formulario de login con validación básica (campos requeridos, formato de email, longitud mínima de contraseña).
  - Llamada a `POST /auth/login` mediante `authenticationService.login`.
  - Al recibir la respuesta, se actualiza el store de autenticación (`useAuthStore.login`) y se redirige al dashboard correspondiente al primer rol del usuario.

- **Manejo de errores de autenticación**
  - Mensajes de error amigables provenientes de la API (`err.response?.data?.message`) o genéricos en caso de fallo inesperado.

### 2.2 Gestión de usuarios y roles (Admin)

Ubicación principal:
- Servicio: `src/app/services/auth/authentication.service.ts`.
- Páginas de administración: `src/app/(dashboard)/admin/users/page.tsx`, `src/app/(dashboard)/admin/users/[id]/page.tsx`.
- Componentes: `CreateUserForm`, `EditUserForm`, `EditProfileForm`, `RoleManagementModal`, `UserRoleBadge`, `RolesBadge`.

Funcionalidades:
- **CRUD de usuarios** mediante endpoints (`GET /auth`, `GET /auth/:id`, `PATCH /auth/:id`, `DELETE /auth/:id`).
- **Activación/desactivación de usuarios** con `PATCH /auth/:id/toggle-active`.
- **Gestión de roles** (admin, coach, receptionist, client) con los métodos:
  - `assignRoles` – reemplaza todos los roles del usuario.
  - `addRoles` – agrega roles sin eliminar los existentes.
  - `removeRoles` – elimina roles y, si el usuario queda sin roles, se asegura que mantenga al menos el rol `client`.
- Funciones helper de autorización en el servicio:
  - `hasRole`, `isAdmin`, `isReceptionist`, `isCoach`, `isClient`.

### 2.3 Gestión de membresías

Ubicación principal:
- Páginas: `src/app/(dashboard)/admin/memberships/page.tsx`, `src/app/(dashboard)/admin/memberships/[id]/page.tsx`.
- Componentes: `CreateMembershipForm`, `EditMembershipForm`, `MembershipDurationBadge`, `MembershipPriceDisplay`, `MembershipFormValidation`.
- Servicio: `src/app/services/memberships/memberships.service.ts`.

Funcionalidades:
- Listado de todas las membresías disponibles.
- Creación de nuevas membresías (definición de nombre, precio, duración, etc.).
- Edición y eliminación de membresías existentes.
- Visualización detallada de una membresía específica.

### 2.4 Gestión de suscripciones

Ubicación principal:
- Páginas: `src/app/(dashboard)/admin/subscriptions/page.tsx`, `src/app/(dashboard)/admin/subscriptions/[id]/page.tsx`, `src/app/(dashboard)/client/my-subscription/page.tsx`.
- Componentes: `AddMembershipToSubscription`, `SubscriptionDetailsCard`, `SubscriptionStatusBadge`, `SubscriptionFormValidation`.
- Servicio: `src/app/services/subscriptions/subscriptions.service.ts`.

Funcionalidades:
- Listado y administración de suscripciones (admin).
- Creación y actualización de suscripciones asociadas a usuarios.
- Asociación y remoción de membresías a una suscripción concreta.
- Visualización del estado y detalles de la suscripción desde la vista de cliente.

### 2.5 Gestión de clases

Ubicación principal:
- Páginas: `src/app/(dashboard)/admin/classes/page.tsx`, `src/app/(dashboard)/coach/classes/page.tsx`.
- Componentes: `ClassManagement`, `TodayClasses`, `MyClassesHistory`.
- Servicio: `src/app/services/classes/classes.service.ts`.

Funcionalidades:
- Creación, edición y eliminación de clases (admin/coach).
- Listado de clases disponibles y de clases impartidas por un coach.
- Visualización de clases del día y del historial de clases asociadas a un usuario.

### 2.6 Control de asistencias

Ubicación principal:
- Páginas: `src/app/(dashboard)/admin/attendances/page.tsx`, `src/app/(dashboard)/client/my-attendance/page.tsx`, `src/app/(dashboard)/receptionist/check-in/page.tsx`.
- Componentes: `CheckInOutForm`, `CheckOutActionButton`, `AttendanceMonthlyCalendar`, `AttendanceTrendChart`, `AttendanceStatusIndicator`, `RegisterClassAttendance`.
- Servicio: `src/app/services/attendances/attendances.service.ts`.

Funcionalidades:
- **Check‑in / Check‑out** de usuarios desde recepción.
- Registro de asistencias a clases (coach).
- Visualización del **estado actual** del usuario, historial y estadísticas de asistencia.
- Vista de **usuarios activos** en el gimnasio.

### 2.7 Componentes compartidos y layout

Ubicación principal:
- Layout de dashboard: `src/app/(dashboard)/layout.tsx`.
- Componentes compartidos: `src/app/components/shared/*`.

Funcionalidades:
- **Dashboard unificado** con:
  - Barra superior con información del usuario y menú de perfil (editar perfil, cerrar sesión).
  - Sidebar con navegación dinámica basada en los roles del usuario.
- Componentes reutilizables:
  - Tablas genéricas (`GenericDataTable`) con filtros, paginación y toolbar.
  - Diálogos genéricos (`ConfirmActionDialog`, `DetailViewDialog`, `FormModalDialog`).
  - Formularios dinámicos (`DynamicSchemaForm`, campos reutilizables de input/select/fecha).
  - Tarjetas de información y estadísticas.

---

## 3. Implementación de autenticación

### 3.1 Flujo general

1. **Registro/Login**: el usuario se registra o inicia sesión en las rutas `/register` o `/login`.
2. **Petición al backend**: los formularios llaman a `authenticationService.register` o `authenticationService.login`, que usan `apiService` (instancia de Axios) y los endpoints configurados en `API_CONFIG`.
3. **Respuesta del backend**: el backend devuelve un objeto `AuthResponse` que incluye el **token JWT** y los datos del usuario (incluyendo roles).
4. **Actualización del estado de autenticación**: el componente ejecuta `useAuthStore.getState().login(response)`, almacenando en el store de Zustand:
   - `isAuthenticated: true`.
   - `user`: datos del usuario autenticado.
   - `token`: token JWT recibido.
5. **Redirección por rol**: en `LoginForm` y `RegisterForm` se lee el primer rol (`response.roles[0]?.name`) y se redirige al dashboard correspondiente:
   - `admin` → `/admin`
   - `receptionist` → `/receptionist`
   - `coach` → `/coach`
   - `client` → `/client`

### 3.2 Store de autenticación (Zustand)

Archivo: `src/app/_store/auth/auth.store.ts`.

- Se define un store combinado `StoreState = AuthState & AuthActions`, persistido con `zustand/middleware/persist` bajo la clave `auth-storage`.
- Estado principal:
  - `isAuthenticated: boolean` – indica si el usuario está autenticado.
  - `user: User | null` – objeto de usuario autenticado.
  - `token: string | null` – token JWT activo.
- Acciones:
  - `login(data: LoginResponse)`
    - Extrae `token` de la respuesta y guarda el resto como `user`.
    - Marca `isAuthenticated` en `true`.
  - `logout()`
    - Limpia `isAuthenticated`, `user` y `token`.
  - `updateUser(data: Partial<User>)`
    - Fusiona los cambios con el usuario actual, útil para edición de perfil y actualización de roles.

El uso de `persist` permite que la sesión se conserve entre recargas de la página (localStorage), manteniendo el token disponible para los interceptores de Axios.

### 3.3 Cliente HTTP y token (Axios + interceptores)

Archivo: `src/lib/api.ts`.

- Se crea una instancia de Axios con:
  - `baseURL` tomada de `NEXT_PUBLIC_API_URL`.
  - Timeout de 30 segundos y cabeceras JSON por defecto.
- **Interceptor de request**:
  - Obtiene el `token` actual desde `useAuthStore.getState().token`.
  - Si existe, inyecta el header `Authorization: Bearer <token>` en todas las peticiones.
- **Interceptor de response**:
  - Si el backend responde con estado `401` (no autorizado), ejecuta `useAuthStore.getState().logout()` para limpiar la sesión.

Este enfoque centraliza el envío del token y el manejo de expiración o invalidación de la sesión.

### 3.4 Provider de sesión

Archivo: `src/app/providers/SessionAuthProvider.tsx`.

- Existe un **esqueleto** para integrar `NextAuth` (comentado), que en un futuro envolvería la aplicación con `SessionProvider`.
- Actualmente, el provider activo simplemente devuelve `children`, delegando la lógica de autenticación a Zustand y Axios.

---

## 4. Implementación de autorización (control de acceso por rol)

La autorización se implementa principalmente a través de:

1. **Roles entregados por el backend**.
2. **Store de autenticación** que almacena el usuario y sus roles.
3. **Layout del dashboard** que filtra navegación y acceso.
4. **Servicios y helpers** que verifican roles.

### 4.1 Roles y helpers en el servicio de autenticación

En `authenticationService` se definen métodos helper:

- `hasRole(user, role)` – verifica si el usuario tiene un rol específico.
- `isAdmin`, `isReceptionist`, `isCoach`, `isClient` – verificaciones directas por rol usando `ValidRoles`.

Estos helpers se utilizan para mostrar u ocultar funcionalidades y asegurar que ciertas operaciones sólo se ejecuten cuando el usuario tiene los permisos adecuados (por ejemplo, gestión completa de usuarios únicamente para `admin`).

### 4.2 Protección de rutas del dashboard

Archivo: `src/app/(dashboard)/layout.tsx`.

- Lógica de protección:
  - Se leen `isAuthenticated` y `user` desde `useAuthStore()`.
  - Un estado `isHydrated` evita problemas de hidratación en el cliente.
  - `useEffect`:
    - Si la app ya está hidratada y el usuario **no** está autenticado, se ejecuta `router.replace('/login')` para impedir el acceso al dashboard.
  - Si no hay usuario o no está autenticado, se muestra un estado de "Cargando aplicación".

- Navegación basada en roles:
  - Se construye `userRoles` a partir de `user.roles.map(role => role.name)`.
  - La función `hasRole(ValidRoles.X)` determina qué secciones del sidebar se renderizan.
  - Se definen colecciones de elementos de navegación por rol:
    - `adminNavItems`, `coachNavItems`, `receptionistNavItems`, `clientNavItems`.
  - El sidebar combina los items según los roles del usuario, creando un menú multi‑rol si el usuario tiene más de un rol.

- Información de rol en la UI:
  - `userRoleLabel` muestra todos los roles del usuario en texto legible (por ejemplo, "Administrador, Coach").

### 4.3 Hook de sincronización de roles en tiempo real

Archivo: `src/app/hooks/useWebSocketRoleSync.ts`.

- Este hook se encarga de **sincronizar cambios de rol y estado de usuario en tiempo real** usando WebSockets (`socket.io-client`).
- Funcionamiento:
  - Sólo se conecta si `isAuthenticated`, `user` y `token` están definidos.
  - Se conecta al servidor WebSocket usando `API_CONFIG.BASE_URL` y pasa el `token` como autenticación.
  - Al conectarse, emite un evento `register` con el `user.id` para suscribirse a notificaciones.

- Eventos principales:
  - `roleChanged({ roles, message })`:
    - Compara los roles actuales con los nuevos.
    - Si hay cambios, ejecuta `updateUser({ roles })` en el store.
    - Si cambia el rol principal, calcula la ruta de dashboard correcta (`/admin`, `/receptionist`, `/coach`, `/client` o `/403`) y redirige.
    - Si sólo cambian roles secundarios, recarga la página para actualizar la UI.
  - `userStatusChanged({ isActive, message })`:
    - Si `isActive` pasa a `false`, muestra un mensaje de error indicando que la cuenta ha sido desactivada por un administrador.
    - Tras unos segundos, ejecuta `logout()` y redirige a `/auth/login`.
    - Si el usuario es reactivado, muestra un mensaje de éxito.

Esto permite que cambios administrativos de permisos o estado de cuenta se reflejen inmediatamente en la sesión del usuario sin necesidad de recargar manualmente.

### 4.4 RoleBasedGuard (esqueleto)

Archivo: `src/app/components/features/authentication/RoleBasedGuard.tsx`.

- Se ha definido un componente `RoleBasedGuard` con la intención de crear un **guard de rutas basado en rol** reutilizable, pero actualmente sólo devuelve `children` sin verificación.
- La documentación en comentarios indica que su uso esperado sería:

  ```tsx
  <RoleBasedGuard allowedRoles={['ADMIN', 'RECEPTIONIST']}>
    <ProtectedContent />
  </RoleBasedGuard>
  ```

- En el estado actual del proyecto, la **autorización efectiva** se realiza principalmente en el layout del dashboard y en la forma de construir la navegación según roles, mientras que `RoleBasedGuard` queda como un punto de extensión futuro.

---

## 5. Gestión de estado en la aplicación

La gestión de estado se realiza combinando:

- **Zustand** para estado global de autenticación y otro estado global específico.
- **Estado local de React** (`useState`) para formularios y UI puntual.
- **Hooks personalizados** para lógica transversal (por ejemplo, sincronización de roles por WebSocket).

### 5.1 Estado global con Zustand

- **Autenticación**: `src/app/_store/auth/auth.store.ts`.
  - Centraliza la información de sesión (usuario y token) y expone acciones para login, logout y actualización del usuario.
  - Utiliza `persist` para almacenar el estado en `localStorage`, permitiendo persistencia entre recargas.

- **Otros stores** (ejemplos en `src/app/stores`):
  - `table-filters.store.ts` – gestión de filtros globales de tablas (búsquedas, filtros por columna, paginación, etc.).
  - `ui-state.store.ts` – estado de UI (p. ej. diálogos abiertos, configuraciones de vista) compartido entre páginas/componentes.

Estos stores permiten que diferentes partes del dashboard compartan estado sin necesidad de prop drilling y manteniendo el código más modular.

### 5.2 Estado local y formularios

- Componentes como `LoginForm`, `RegisterForm`, `CreateMembershipForm`, `EditMembershipForm` y otros formularios utilizan `useState` para manejar:
  - Valores de campos de formulario.
  - Flags de `loading` durante llamadas a la API.
  - Mensajes de error y éxito.

Este nivel de estado es efímero y específico a cada componente, y se complementa con el estado global en los casos donde los datos deben ser compartidos o persistidos.

---

## 6. Conclusión

Nuestra aplicación Temple Gym implementa un conjunto completo de funcionalidades para la gestión de un gimnasio con diversos roles de usuario. La **autenticación** se basa en tokens JWT almacenados y gestionados a través de un store de Zustand, con interceptores de Axios que garantizan el envío del token en cada petición y el cierre de sesión automático ante respuestas no autorizadas.

La **autorización** se realiza principalmente mediante control de roles, tanto en el nivel de servicios (helpers `hasRole`, `isAdmin`, etc.) como en la construcción dinámica de la navegación y en la protección del layout del dashboard, complementada por un hook de WebSocket que sincroniza en tiempo real cambios en roles y estado de usuario.

Finalmente, la **gestión del estado** combina Zustand para estado global persistente (autenticación, filtros, UI) con estado local de React para formularios y componentes específicos, y una infraestructura preparada para integrar React Query, lo que proporciona una base sólida para escalar la aplicación y mantener un código organizado y mantenible.

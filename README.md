# SOLIVER — Alquiler y Venta de Trajes de Caporal

Aplicación web para la gestión de una tienda de **alquiler y venta de trajes de Caporal**: catálogo público para clientes, flujo de reserva y compra en línea y panel administrativo para controlar inventario, reservas, alquileres, devoluciones, pagos y reportes.

Proyecto de la materia **TAW-256**.

- **Repositorio:** https://github.com/favbri1/soliver-react-taw256
- **Estado actual:** Frontend completo con datos y autenticación simulados (sin backend todavía).
- **Próxima etapa:** Backend en NestJS (ver [Hoja de ruta](#7-hoja-de-ruta-backend)).

---

## 1. Objetivo

Digitalizar el proceso de alquiler y venta de trajes de Caporal, permitiendo:

- Al **cliente**: explorar el catálogo, consultar disponibilidad por fechas, reservar uno o varios trajes (con una talla por unidad) y consultar su reserva.
- Al **administrador**: controlar el catálogo de trajes, el inventario por piezas, las reservas, los alquileres activos, las devoluciones (con multas por retraso o piezas faltantes), los clientes y los pagos, apoyándose en un dashboard con métricas y gráficos.

---

## 2. Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 6 |
| Estilos | Tailwind CSS 3 (sistema de diseño propio: colores `ink`, `gold`, `wine`) |
| Enrutamiento | React Router 6 |
| Estado global | Zustand 5 |
| Íconos | lucide-react |
| Fechas | date-fns |
| Gráficos | Componentes SVG propios (`LineTrend`, `BarList`) |

> **Backend (pendiente):** NestJS. Hoy todos los datos viven en memoria (`src/mocks/`) y se acceden a través de `src/services/`, que simula latencia de red.

---

## 3. Cómo ejecutar el proyecto

Requisitos: **Node.js 18+** y npm.

```bash
# 1. Clonar
git clone https://github.com/favbri1/soliver-react-taw256.git
cd soliver-react-taw256

# 2. Instalar dependencias
npm install

# 3. Modo desarrollo (http://localhost:5173)
npm run dev

# 4. Build de producción
npm run build

# 5. Previsualizar el build
npm run preview
```

### Acceso al panel administrativo

El área del personal está detrás de **dos pasos**:

1. **Contraseña de acceso administrativo.** Desde el catálogo público, el botón *Acceso administrativo* lleva a `/acceso-administrativo`, que pide una contraseña previa esta es Soliver@2026. Mientras no se supere, `/login`, `/registro` y `/recuperar-contrasena` redirigen a esa pantalla (escribir la URL a mano no la evita). La autorización se guarda en `sessionStorage` (dura mientras la pestaña esté abierta) y **se borra al cerrar sesión**, que además devuelve al catálogo.
2. **Login del personal.** La autenticación es **simulada en el navegador** (sin backend), pero funciona de verdad: verifica credenciales contra usuarios guardados con contraseña cifrada, aplica roles, CAPTCHA y bloqueo por intentos.

El catálogo, el detalle de traje, la reserva y la consulta de reserva son públicos y **no piden ninguna contraseña ni cuenta**.

| Dato | Valor |
|---|---|
| Contraseña de acceso administrativo (inicial) | `Soliver@2026` |
| Dónde cambiarla | `src/config/adminAccess.ts` → constante `ADMIN_ACCESS_PASSWORD` (único lugar) |

> ⚠️ Esta contraseña previa **no es seguridad real**: sin backend, vive dentro del código del frontend y cualquiera con conocimientos técnicos puede verla. Es solo una barrera de acceso para el prototipo; la autenticación y autorización reales las implementará NestJS.


| Rol | Usuario | Contraseña | Permisos |
|---|---|---|---|
| Administrador | `admin` | `Morenada#2026` | Todo el sistema |
| Empleado | `empleado` | `Tinku@2026!` | Todo excepto Trajes (CRUD), Reportes, Configuración y Registro de accesos |

> Las cuentas anteriores existen internamente (`src/services/auth.service.ts`) pero **ya no se muestran en la pantalla de login**. Las cuentas nuevas creadas en `/registro` tienen rol **Empleado**.
>
> Los usuarios, el log de accesos y los intentos de login se guardan en `localStorage` del navegador (solo hashes, nunca contraseñas en texto plano). Para restablecer la demo: borrar los datos del sitio en el navegador.

---

## 4. Funcionalidades del frontend

### Sitio público

| Ruta | Descripción |
|---|---|
| `/` | Catálogo con filtros (categoría, talla, búsqueda, precio, solo disponibles) |
| `/trajes/:id` | Detalle del traje: galería, piezas del conjunto, **selector de talla por unidad** y total dinámico. En los trajes con venta aparece el selector **Alquilar / Comprar**: alquiler = (alquiler + depósito) × cantidad, con consulta de disponibilidad por fechas; compra = precio de venta × cantidad, sin fechas ni depósito |
| `/reservar/:id` | **Alquiler** (6 pasos): cantidad y tallas → fechas → disponibilidad → cliente → resumen → anticipo. **Compra** (4 pasos): cantidad y tallas → cliente → resumen → anticipo (50% del total) |
| `/reserva/:id` | Comprobante de reserva con código y QR |
| `/mi-reserva` | Consulta por código de reserva (`SOL-…`, alquiler) o de compra (`VTA-…`) |
| `/sobre-nosotros` | Información de la empresa |
| `/preguntas-frecuentes` | Preguntas frecuentes |
| `/acceso-administrativo` | Contraseña previa para entrar al área del personal |
| `/login` | Inicio de sesión con CAPTCHA, límite de 3 intentos y bloqueo temporal *(requiere la contraseña previa)* |
| `/registro` | Registro de personal (rol Empleado) con medidor de fortaleza de contraseña *(requiere la contraseña previa)* |
| `/recuperar-contrasena` | Recuperación de contraseña con código temporal de un solo uso *(requiere la contraseña previa)* |

### Panel administrativo (requiere sesión)

| Ruta | Descripción |
|---|---|
| `/dashboard` | Métricas, alertas de negocio, gráficos de ingresos, reservas por mes, trajes más alquilados y estado del inventario |
| `/admin/trajes` | **CRUD de trajes** (crear, editar, eliminación lógica con confirmación) con modal de formulario; imágenes por URL o archivo. Cada traje se marca como **Solo alquiler** o **Alquiler y venta** (con precio de venta, siempre mayor al de alquiler) *(solo Administrador)* |
| `/inventario` | Inventario por traje con detalle de piezas y su estado |
| `/reservas` | Reservas de alquiler y pedidos de compra, con columna *Tipo* |
| `/calendario` | Calendario de reservas |
| `/alquileres` | Alquileres activos |
| `/devoluciones` | Registro de devoluciones con multas por retraso o piezas faltantes |
| `/clientes` | Historial y estado de clientes |
| `/pagos` | Registro de pagos |
| `/reportes` | Reportes analíticos con gráficos y **exportación a PDF real** *(solo Administrador)* |
| `/configuracion` | Maqueta de ajustes (no persiste cambios) *(solo Administrador)* |
| `/admin/accesos` | **Registro de accesos**: usuario, IP, evento, navegador, fecha y hora *(solo Administrador)* |

Además, la barra **"Escenario"** del panel (escenarios de demostración) permite simular distintos días de operación (normal, alta demanda, día de entrada, devoluciones, incidencias) y ver cómo cambian el dashboard y las alertas.

### Alquiler y venta

Todos los trajes se alquilan; **algunos además se pueden comprar**. El administrador decide la modalidad al crear o editar cada traje: *Solo alquiler* o *Alquiler y venta*. Si elige venta, debe indicar un **precio de venta mayor al de alquiler** (el formulario no deja guardar un precio igual o menor).

| | Alquiler | Compra |
|---|---|---|
| Precio | Precio de alquiler | Precio de venta |
| Depósito | Sí (por unidad) | No |
| Fechas y disponibilidad | Sí | No |
| Anticipo | 50% del alquiler | 50% del total |
| Código | `SOL-2026-…` | `VTA-2026-…` |

- En el catálogo, los trajes con venta muestran la etiqueta "También en venta" y su precio de compra; hay un filtro *Disponibles para compra*.
- Las compras no bloquean la disponibilidad del traje ni aparecen en el calendario de alquileres; sí figuran en *Reservas* (columna *Tipo*).
- En los datos de ejemplo se venden 6 de los 12 trajes (TR-001, TR-003, TR-004, TR-005, TR-007 y TR-012). El campo está en `src/mocks/costumes.ts` (`saleAvailable` y `salePrice`) y las reglas de precios en `src/utils/pricing.ts`.

### Seguridad y control de acceso (simulado en el frontend)

| Función | Cómo funciona hoy |
|---|---|
| **Fortaleza de contraseña** | Medidor *débil / intermedia / fuerte* con lista de requisitos. Se rechaza la contraseña débil (mínimo 8 caracteres con 3 tipos de carácter; también se rechazan claves comunes o que contengan el usuario). |
| **Contraseña cifrada** | Se guarda `sha256$sal$hash` con sal aleatoria; el texto plano nunca se almacena. *(En el backend se usará bcrypt/argon2.)* |
| **CAPTCHA** | Texto distorsionado generado en el navegador, con botón para renovarlo. |
| **Límite de intentos** | 3 intentos fallidos bloquean el acceso **60 segundos** (con cuenta regresiva); el bloqueo sobrevive a recargar la página. Configurable en `LOCKOUT_SECONDS` (`src/services/auth.service.ts`). |
| **Recuperar contraseña** | Se pide usuario o correo → código de 6 dígitos de un solo uso que vence en 10 minutos (máx. 5 intentos) → nueva contraseña (con la misma política). Al terminar se desbloquea la cuenta. El mensaje es igual exista o no la cuenta. Mientras no exista servidor de correo, el código se muestra en un recuadro de la propia pantalla. |
| **Roles y permisos** | Administrador / Empleado. El menú oculta lo no permitido y las rutas restringidas muestran "Acceso denegado". Reglas en `src/utils/permissions.ts`. |
| **Log de accesos** | Registra *Ingreso, Salida, Intento fallido y Bloqueo* con usuario, IP, navegador y fecha/hora. La **IP es simulada** (`127.0.0.1`): el navegador no puede conocer su IP real; la registrará el backend. Cerrar sesión desde el botón "Salir" registra la salida. |

> ⚠️ Nada de esto es seguridad real hasta que exista el backend: un frontend siempre puede ser manipulado. Todas estas reglas deben repetirse en NestJS (JWT, guards por rol, bcrypt/argon2, CAPTCHA validado en servidor, envío de correo, IP real).

### Reporte PDF

En **Reportes → Exportar PDF** se descarga un reporte de gestión de 2 páginas con indicadores clave, gráficos de barras (ingresos, reservas, trajes más alquilados), estado del inventario y alertas, según el escenario de demostración activo. El PDF se genera **en el navegador sin librerías externas** (`src/utils/pdf.ts` y `src/utils/reportPdf.ts`). Con backend podrá generarse en el servidor (`GET /reports/pdf`).

---

## 5. Estructura del proyecto

```
src/
├── assets/          Logo e imágenes de los trajes
├── components/
│   ├── admin/       CostumeFormModal (crear/editar traje)
│   ├── auth/        AuthShell, PasswordInput, PasswordStrengthMeter, CaptchaField, RequireAdminGate
│   ├── catalog/     CostumeCard
│   ├── common/      DataTable, PageHeader, EmptyState, StatusBadge, Skeleton, ToastHost, DateRangePicker
│   ├── costumes/    SizeSelector, QuantitySizePicker
│   ├── dashboard/   MetricCard, ChartCard, LineTrend, BarList
│   ├── layout/      AdminSidebar, AdminDrawer (móvil), AdminHeader, PublicHeader, PublicFooter, DemoScenarioBar
│   └── reservations/AvailabilityBadge, QRCodeCard
├── hooks/           useQuantitySizes (cantidad + talla por unidad), useLogout
├── config/          adminAccess (contraseña previa del área administrativa)
├── layouts/         PublicLayout, AdminLayout
├── mocks/           Datos simulados en memoria
├── router/          Títulos de página
├── services/        Capa de acceso a datos (hoy mock; mañana REST API), incl. auth.service
├── stores/          Estado global con Zustand
├── types/           Tipos de dominio (contrato con el futuro backend)
├── utils/           Formato, validators, password (fortaleza), sha256, captcha, permissions, browser,
│                    pdf + reportPdf (generador de PDF propio), costume (eliminación lógica)
└── views/           Una vista por ruta
```

### Arquitectura pensada para conectar el backend

Las vistas **no** conocen los datos simulados: hablan con `stores/` (Zustand), y estos con `services/`. Cada servicio tiene comentada la ruta REST que lo reemplazará, por lo que al llegar el backend solo hay que cambiar el cuerpo de cada función por un `fetch`, sin tocar las vistas.

```
View  →  Store (Zustand)  →  Service  →  [hoy: mocks en memoria | mañana: API NestJS]
```

---

## 6. Estado respecto a los requisitos de la presentación

Leyenda: ✅ cumplido · 🟡 parcial · ❌ pendiente

| # | Requisito | Estado | Detalle |
|---|---|:---:|---|
| — | Objetivo bien definido | ✅ | Alquiler y venta de trajes de Caporal (ver sección 1) |
| 1 | Al menos un menú | ✅ | Sidebar contraíble (escritorio), drawer (móvil) y menú público |
| 2 | CRUD con eliminación lógica | ✅ | CRUD de trajes: al eliminar, el traje se marca con `deletedAt` y se oculta del catálogo, inventario, calendario y dashboard, pero el registro se conserva (las reservas antiguas siguen mostrando su nombre). Con backend será una columna `deleted_at` |
| 3 | Frontend en React | ✅ | React 18 + TypeScript + Vite |
| 4 | Backend en NestJS | ❌ | Pendiente (siguiente etapa) |
| 5 | Validaciones en campos de entrada | ✅ | Formulario de trajes, login (usuario y contraseña) y datos del cliente en la reserva (nombre, teléfono boliviano y correo opcional), con mensajes por campo. Reglas en `src/utils/validators.ts`; en el backend deberán repetirse con `class-validator` |
| 6 | Reporte en PDF | ✅ | PDF real generado en el navegador (Reportes → Exportar PDF), con indicadores y gráficos |
| 7 | Gráfico estadístico | ✅ | Gráficos de líneas y barras en Dashboard y Reportes |
| 8 | Contraseña débil/intermedia/fuerte + cifrada | 🟡 | Registro con medidor y política; se guarda como hash con sal. **Falta** hash real (bcrypt/argon2) en el backend |
| 9 | Login, permisos y CAPTCHA | 🟡 | Login con credenciales verificadas, roles (Administrador/Empleado), rutas protegidas y CAPTCHA. **Falta** JWT y CAPTCHA validado en el servidor |
| 10 | Bloqueo tras 3 intentos fallidos | 🟡 | Bloqueo de 60 s con cuenta regresiva. **Falta** aplicarlo en el servidor (por usuario e IP) |
| 11 | Recuperación de contraseña | 🟡 | Flujo completo con código temporal (correo simulado). **Falta** envío real de correo |
| 12 | Log de accesos (usuario, IP, evento, navegador, fecha/hora) | 🟡 | Pantalla `/admin/accesos` con filtros; IP simulada. **Falta** IP real y persistencia en base de datos (backend) |
| 13 | Funciona en móvil | ✅ | Diseño responsive con Tailwind, drawer móvil, tablas que se convierten en tarjetas |
| 14 | API documentada (Swagger/Scalar) | ❌ | Depende del backend |
| 15 | Código en GitHub | ✅ | https://github.com/favbri1/soliver-react-taw256 |
| 16 | Despliegue en sitio gratuito | ✅ | vercel |
| 17 | Docker | ❌ | Pendiente |
| 18 | Kubernetes | ❌ | Pendiente |
| 19 | Agente inteligente (opcional) | ❌ | lo haremos despues |

---

## 7. Hoja de ruta (backend)

Las decisiones de abajo son una **propuesta de trabajo**, aún no implementadas.

### Módulos NestJS sugeridos

| Módulo | Reemplaza a | Endpoints principales |
|---|---|---|
| `auth` | `ui.store.login` | `POST /auth/login`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| `users` | — | `POST /users` (con validación de fortaleza y hash), roles y permisos |
| `costumes` | `costume.service`, `inventory.service` | `GET/POST/PATCH/DELETE /costumes` (borrado lógico) |
| `pieces` | `mocks/pieces` | `GET/PATCH /pieces` |
| `reservations` | `reservation.service` | `GET/POST /reservations`, `GET /reservations/availability` |
| `rentals`, `returns`, `payments`, `clients` | servicios homónimos | CRUD correspondiente |
| `reports` | `dashboard.service` | `GET /reports/dashboard`, `GET /reports/pdf` |
| `audit` | — | Log de acceso (usuario, IP, evento, navegador, fecha/hora) |

### Puntos a resolver al conectar el backend

- **Persistencia real** de trajes creados, editados y eliminados (hoy se pierden al recargar la página).
- **Imágenes:** hoy las subidas por archivo usan `URL.createObjectURL` (temporal). Habrá que subir el archivo y guardar la URL definitiva.
- **Reservas con varias unidades:** el tipo `Reservation` ya incluye `quantity` y `sizes[]`. En base de datos conviene modelarlo como una tabla de ítems (una fila por unidad con su talla).
- **Disponibilidad por stock:** hoy solo se verifica el cruce de fechas; el backend debe comprobar que existan N unidades libres del modelo.
- **Ventas:** guardar `sale_available` y `sale_price` en el traje (con la regla `sale_price > rental_price` también en el servidor), registrar el tipo de operación en la reserva/pedido, **descontar el stock** al vender (una venta retira unidades del inventario de alquiler) y emitir comprobante/factura.
- **Eliminación lógica:** el frontend ya usa `deletedAt`; en base de datos será una columna `deleted_at` y las consultas deberán filtrarla.
- **Seguridad de acceso:** el frontend ya tiene las pantallas y reglas; en NestJS hay que implementar hash bcrypt/argon2, JWT con guards por rol, CAPTCHA validado en el servidor, bloqueo tras 3 intentos (por usuario e IP), correo de recuperación con token de un solo uso y expiración, y el log de accesos con la IP real en base de datos.
- **Documentación:** Swagger (`@nestjs/swagger`) o Scalar.
- **Despliegue:** Dockerfile para frontend y backend, `docker-compose`, manifiestos de Kubernetes y publicación en un servicio gratuito.

---

## 8. Notas

- Los cambios hechos desde el panel (crear/editar/eliminar trajes, nuevas reservas) se guardan **solo en memoria** y se reinician al recargar la página. Las excepciones son usuarios, intentos de login y log de accesos, que se guardan en `localStorage`.
- Si se recarga la página con la sesión iniciada, la sesión se cierra (no se persiste) y no se registra la *Salida*; solo se registra cuando se usa el botón "Salir".
- Las imágenes de algunos trajes y la del login provienen de `picsum.photos` (marcadores de posición).
- El proyecto no incluye `node_modules` ni `dist` (ver `.gitignore`).

## Autor

Fabricio Raúl Álvarez López — Materia TAW-256.

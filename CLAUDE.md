# llamador-web-front — Contexto de proyecto

Angular 21 + Socket.IO. Sistema de gestión de turnos/llamados en tiempo real.
Backend: NestJS 11 con WebSocket gateway (`llamador-web-back`).

## Arquitectura de servicios

### SocketService (`src/app/services/socket.service.ts`)
Capa delgada sobre `ngx-socket-io`. Expone los eventos reales del backend y nada más.

**Eventos que el backend SÍ emite:**
- `puesto:update` → `Puesto[]` completo cada vez que cambia cualquier puesto
- `llamable:update` → `Llamable[]` al conectar un cliente nuevo
- `llamable:called` → `Llamable[]` cuando se procesa un llamado

**Eventos que el backend NO emite (no agregar listeners para estos):**
- `puesto:added`, `puesto:taked`, `puesto:deleted`, `puesto:liberated`, `person:called`
- Estos no existen en el gateway — agregarlos crea listeners muertos

También expone `connectionState$: Observable<ConnectionState>` con estados `'connecting' | 'connected' | 'disconnected' | 'error'`.

### PuestosService (`src/app/services/puestos.service.ts`)
- Singleton `providedIn: 'root'` — no debe agregarse a `providers` de ningún componente
- Se suscribe solo a `puesto:update`
- Limpia el BehaviorSubject en `disconnected`/`error` para evitar mostrar puestos ocupados stale después de reiniciar el backend

### LlamadorService
Delega a `SocketService.llamarPersona()`.

## Componentes clave

### AdminPanelComponent
- Usa el singleton `PuestosService` (no tiene `providers` propio)
- Pendiente: `console.log(items)` en el template y `cancelarEliminarPuesto()` vacío

### PuestoAtencionComponent (`/puesto-atencion/:id?name=...`)
- Emite llamados al display screen vía `LlamadorService`
- El botón Llamar cambia a Re-llamar (con modal de confirmación) una vez que `payload.fueLlamado === true`
- Muestra snackbar con clase `.snackbar-llamado` (definida en `styles.css`) al llamar/re-llamar

### DisplayScreenComponent (`/display-screen`)
- Se suscribe a `llamable:update` (cola inicial) y `llamable:called` (llamados en tiempo real)
- Condición del template para mostrar llamado activo: `llamableActual?.fueLlamado` (no `llamableActual.id > 0`)
- `llamableActual` es `Llamable | null`, usa `shift() ?? null` para evitar `undefined`

### AppComponent
- Muestra indicador de conexión en toolbar usando `connectionState$` del `SocketService`
- Clases CSS: `connected` / `connecting` / `disconnected` / `error` en `.connection-badge`

## Modelos

```ts
interface Puesto { id: number; nombre: string; disponible: boolean; }
interface Llamable { id: number; nombrePuesto: string; persona: string; timestamp: number; fueLlamado: boolean; }
```

> El modelo `Puesto` en frontend tiene campo `descripcion` pero el backend no lo envía.
> `admin-panel` usa `p.descripcion` para títulos de cards — puestos nuevos desde backend no tendrán este valor.

## Rutas

```
/               → redirect a /admin-panel
/admin-panel    → AdminPanelComponent
/puesto-atencion/:id  → PuestoAtencionComponent (query param: ?name=NombrePuesto)
/display-screen → DisplayScreenComponent
```

## Tests

`socket.service.spec.ts` cubre: `onPuestosUpdate()`, `onLlamablesUpdate()`, `onLlamarPersona()`, `connectionState$`.
No testear `onPersonCalled` — ese método fue eliminado (el backend no emite ese evento).

## Patrones establecidos

- Suscripciones en componentes: usar `Subscription.add()` y `unsubscribe()` en `ngOnDestroy`
- Señales: `toSignal(observable$)` para interop con templates `@if`/`@switch`
- Feedback de acciones: `MatSnackBar` con `panelClass: 'snackbar-llamado'`
- Confirmaciones destructivas: `MatDialog` con `DialogContentComponent`

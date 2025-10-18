
# Reflexión breve (entrega)

**Flujo de datos entre interfaz y API**
La UI solicita datos al `ProductStore`. El `ProductStore` llama a `ApiService` que usa `fetch` hacia `http://localhost:3001/api`. Las respuestas actualizan el `BehaviorSubject` `products$` al que los componentes se suscriben.

**Gestión de estado y errores**
Se usó un store ligero con `BehaviorSubject` (similar a Redux pero más simple para este proyecto). El store expone streams `products$`, `loading$` y `error$`. Todos los cambios de estado pasan por el store: carga inicial, creación y eliminación; los errores se colocan en `error$` y pueden mostrarse en la UI.

**Patrón aplicado**
Se aplicó el patrón de separación de responsabilidades:
- `ApiService` — lógica de acceso a datos (fetch).
- `ProductStore` — lógica de negocio y estado compartido.
- Componentes — vistas (suscriben a `products$` y disparan acciones del store).
Este patrón facilita pruebas unitarias y mantiene más limpio el código de los componentes.

**Validaciones y manejo de errores**
- El servidor valida payloads en `POST`.
- El client-side captura errores y los publica en `error$`.
- Sugerencia: implementar mensajes en la UI (toasts o alertas) al suscribirse a `error$`.


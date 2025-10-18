
# API Simulada añadida al proyecto

## Qué se agregó
- `mock-api/server.js` — servidor Express con endpoints:
  - `GET /api/products` — listar productos
  - `GET /api/products/:id` — obtener uno
  - `POST /api/products` — crear (payload `{ name, price }`)
  - `DELETE /api/products/:id` — eliminar
  - `POST /api/__reset` — reinicia datos (para pruebas)

- `src/app/services/api.service.ts` — cliente simple usando `fetch`.
- `src/app/services/product-store.service.ts` — store ligero con `BehaviorSubject` (manejo de estado, loading y errores).
- `package.json` script `"start:api"` para levantar la API: `npm run start:api`.
- `DOCUMENTATION.md` — instrucciones para probar con Postman y conectar frontend.
- `REFLEXION.md` — breve informe de flujo de datos, manejo de estados y patrón aplicado.

## Cómo ejecutar
1. Abrir terminal en la carpeta del proyecto.
2. Instalar dependencias si es necesario: `npm install`
3. Levantar la API simulada (puerto 3001): `npm run start:api`
4. Levantar la aplicación Angular en otro terminal: `npm start` (por defecto `ng serve`).
5. Cambiar la URL base si su app se sirve en otro host (ver `DOCUMENTATION.md`).


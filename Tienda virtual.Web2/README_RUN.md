# Ejecutar el proyecto (PowerShell)

Esta guía rápida muestra cómo arrancar el backend (mock-api) y el frontend (build estático) en Windows PowerShell.

Prerequisitos
- Node.js 18+ y npm
- npx disponible

Arrancar backend (mock-api)

1. Abrir PowerShell y navegar a la carpeta mock-api:

```powershell
cd "c:\Users\USR-79M2\Desktop\Tienda.virtual.Sam\Tienda virtual.Web2\mock-api"
```

2. Instalar dependencias (si no está hecho):

```powershell
npm install
```

3. Ejecutar en modo desarrollo (con reinicio automático):

```powershell
npm run dev
```

4. O ejecutar directamente:

```powershell
npm start
```

Comprobar endpoints (desde cualquier PowerShell):

```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing
Invoke-WebRequest -Uri http://localhost:3000/api/usuarios -UseBasicParsing
```

Servir frontend estático (build ya generada en `dist/mi-proyecto`)

1. Desde la raíz del proyecto (`Tienda virtual.Web2`):

```powershell
cd "c:\Users\USR-79M2\Desktop\Tienda.virtual.Sam\Tienda virtual.Web2"
npx http-server ./dist/mi-proyecto -p 4200 -a 127.0.0.1
```

2. Abrir en el navegador: http://127.0.0.1:4200

Limpieza de archivos temporales del mock-api

Dentro de `mock-api` hay un script para mover archivos temporales a una carpeta de backup:

```powershell
cd "c:\Users\USR-79M2\Desktop\Tienda.virtual.Sam\Tienda virtual.Web2\mock-api"
npm run clean-temp
```

Comandos npm rápidos desde la raíz

Si prefieres usar npm desde la raíz del proyecto, he añadido dos scripts en el `package.json` raíz:

- `npm run start:frontend` — sirve el build estático en http://127.0.0.1:4200 (usa `http-server`).
- `npm run start:api` — ejecuta el `mock-api` (equivalente a `npm start` dentro de `mock-api`).

- Nota: `start:api` ahora arranca `mock-api/server.launch.js`. Por defecto el servidor usa el puerto 3001 (puedes forzarlo con `\$env:PORT=3001; npm run start:api`).

Ejemplo:

```powershell
cd "c:\Users\USR-79M2\Desktop\Tienda.virtual.Sam\Tienda virtual.Web2"
npm run start:api
npm run start:frontend
```

Notas
- El servidor backend crea un archivo `server.ready` cuando está listo para recibir peticiones.
- Si tu entorno no dispone de MongoDB, el backend usa `mongodb-memory-server` como fallback en desarrollo.

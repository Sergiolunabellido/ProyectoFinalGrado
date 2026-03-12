# 📚 GoblinVerse (proyectode0) — Documentación Técnica Completa

Fecha de documentación: 2026-03-12

## ✨ Resumen
GoblinVerse es una aplicación full-stack para una librería fantástica. Incluye un frontend React con navegación SPA y renderizado 3D de portadas, y un backend Express con autenticación JWT (access + refresh), persistencia en MySQL y endpoints para usuarios, libros, favoritos, compras y carrito. El diseño visual se apoya en Tailwind CSS y estilos personalizados. La página del libro incluye lectura por voz de la descripción.

## 🎯 Objetivo de este documento
Cubrir el 100% de los archivos relevantes del repositorio (excluyendo `node_modules`) y explicar el comportamiento de cada pieza de código, los flujos principales, la estructura de carpetas y los puntos pendientes detectados.

---

## 🧭 Contenido
1. Visión general y arquitectura
2. Estructura del repositorio
3. Configuración y variables de entorno
4. Dependencias y scripts
5. Frontend (React)
6. Backend (Node + Express)
7. API de backend (referencia detallada)
8. Modelo de datos inferido
9. Flujo de autenticación
10. Seeding de libros
11. Assets y recursos públicos
12. Testing
13. Informe de evaluación existente
14. Apéndice: Mapa de archivos

---

## 🏛️ Visión General y Arquitectura
Arquitectura en tres capas:
- 🖥️ Capa cliente: React SPA en `http://localhost:3000`.
- 🧠 Capa API: Express en `http://localhost:5000`.
- 🗄️ Capa datos: MySQL (`basedatosProyecto`).

Flujo principal:
- El frontend consume endpoints REST mediante `fetch`.
- El backend entrega datos JSON y gestiona autenticación JWT.
- El refresh token se guarda en cookie HTTP-Only y también en la tabla de `usuarios`.

---

## 🗂️ Estructura del Repositorio
```
proyectode0/
├─ .env
├─ .gitignore
├─ README.md
├─ package.json
├─ package-lock.json
├─ tailwind.config.js
├─ build/ (salida generada por CRA)
├─ public/
│  ├─ index.html
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ images/
├─ src/
│  ├─ index.js
│  ├─ index.css
│  ├─ App.js
│  ├─ App.css
│  ├─ App.test.js
│  ├─ reportWebVitals.js
│  ├─ setupTests.js
│  ├─ Context/
│  │  └─ AuthContext.js
│  ├─ Services/
│  │  ├─ funtionGenres.js
│  │  └─ cerrarSesion.js
│  ├─ utils/
│  │  └─ utils.js
│  ├─ Pages/
│  │  ├─ Principal/
│  │  │  ├─ principal.jsx
│  │  │  └─ principal.css
│  │  ├─ Catalogo/catalogo.jsx
│  │  ├─ Libros/paginaLibro.jsx
│  │  ├─ Login/
│  │  │  ├─ login.jsx
│  │  │  └─ styles-login.css
│  │  ├─ Perfil/perfil.jsx
│  │  └─ Carrito/carrito.jsx
│  └─ Components/
│     ├─ Header/header.jsx
│     ├─ Footer/footer.jsx
│     ├─ MiPerfil/miPerfil.jsx
│     ├─ MisCompras/misCompras.jsx
│     ├─ LibrosDestacados/librosDestacados.jsx
│     └─ Login-Registro/
│        ├─ InicioRegistro/inicioRegistro.jsx
│        └─ Botones-Enviar/
│           ├─ Enviar-Login.jsx
│           └─ Enviar-Registro.jsx
└─ backend/
   ├─ .env
   ├─ package.json
   ├─ package-lock.json
   ├─ server.js
   ├─ config/
   │  ├─ db.js
   │  └─ seedLibros.js
   ├─ controllers/
   │  ├─ authController.js
   │  ├─ registerController.js
   │  ├─ refreshTokenController.js
   │  ├─ usersController.js
   │  ├─ librosController.js
   │  └─ cartController.js
   ├─ middleware/
   │  └─ auth.middleware.js
   └─ routes/
      └─ auth.js
```

---

## ⚙️ Configuración y Variables de Entorno
- `c:\Users\sergi\Desktop\proyectode0\.env`
  - `GENERATE_SOURCEMAP=false` (desactiva sourcemaps en CRA).
- `c:\Users\sergi\Desktop\proyectode0\backend\.env`
  - `JWT_SECRET=1234`
  - `JWT_REFRESH_SECRET=contraseña_refresco`
  - `JWT_EXPIRES_IN=15min`
  - `JWT_REFRESH_EXPIRES_IN=5d`

Nota: el backend depende de estas variables para firmar y verificar tokens.

---

## 📦 Dependencias y Scripts
Frontend (`package.json`):
- React 19, React Router DOM 7, react-hot-toast, three + @react-three/fiber/drei.
- Tailwind CSS y Testing Library.
- Stripe está declarado pero no usado en el frontend.

Backend (`backend/package.json`):
- Express, cors, cookie-parser, jsonwebtoken, bcryptjs, mysql2.
- Redis y sesiones listadas pero no usadas en código actual.
- Stripe está declarado pero no usado en backend.

Scripts frontend:
- `npm start`, `npm build`, `npm test`, `npm run eject`.

Scripts backend:
- `npm run dev` (nodemon)
- `npm start` (node server.js)

---

## 🧩 Frontend (React)

### 🚀 Bootstrap de la aplicación
- `src/index.js`:
  - Crea root con React 19.
  - Envuelve `App` en `BrowserRouter`.
  - Activa `reportWebVitals()`.
- `src/App.js`:
  - Define rutas con `react-router-dom`.
  - Configura `Toaster` global (tema verde para éxito, rojo para error).
  - Rutas:
    - `/` → `Principal`.
    - `/login` → `Login`.
    - `/perfil` → `Perfil`.
    - `/libro/:id` → `PageBook`.
    - `/catalogo` → `Catalogo`.
    - `/carrito` → `Carrito`.

### 🧭 Páginas

1. `src/Pages/Principal/principal.jsx`
- Renderiza la landing con sección de presentación y destacados.
- Llama a `POST /librosPublicos` para obtener 6 libros.
- Muestra libros con el componente 3D `Libro3D` dentro de un `Canvas`.
- Incluye listado de géneros usando `generosArray`.
- `handleClickCatalogo` navega a `/catalogo`.
- Al pulsar un género, navega a `/catalogo` con el filtro aplicado.

2. `src/Pages/Catalogo/catalogo.jsx`
- Llama a `POST /libros` para listado completo.
- Filtro por título con `POST /libroTitulo`.
- Filtro por géneros con `POST /librosFiltrados`.
- Paginación local con `LIBROS_POR_PAGINA = 12`.
- Al hacer click en un libro navega a `/libro/:id` pasando el libro por `state`.
- Limpia filtros al recargar o al entrar desde el link “Catálogo”.
- Panel de filtros y géneros responsive.

3. `src/Pages/Libros/paginaLibro.jsx`
- Muestra detalle del libro:
  - Portada 3D.
  - Información de precio, descripción y detalles.
- `añadirLibroCarrito()` llama a `POST /anadirLibroCarrito`.
- `comprobarFavorito()` consulta `POST /librosFavoritos`.
- `anadirFavorito()` llama a `POST /anadirFavorito`.
- Si no hay `state.libro`, carga desde `POST /libroId`.
- Calcula un “precio original” sumando 10 al precio actual.
- Botón “Resumen” que lee la descripción con `speechSynthesis` y voz automática.

4. `src/Pages/Login/login.jsx`
- Alterna entre modo login y registro con `isLoginView`.
- Login: `BotonEnviarLogin` envía usuario y contraseña.
- Registro: `BotonEnviarRegistro` envía nombre, email y contraseña.
- UI incluye botones “Google” y “Facebook” sin lógica.

5. `src/Pages/Perfil/perfil.jsx`
- Dashboard con barra lateral.
- Alterna entre `MiPerfil` y `MisCompras`.
- Carga usuario con `POST /usuarios`.
- Cierre de sesión usando `CerrarSesion` y redirección a `/`.

6. `src/Pages/Carrito/carrito.jsx`
- Carga libros desde `POST /librosCarrito`.
- Permite incrementar o disminuir cantidades localmente.
- `eliminarLibroCarrito` llama a `POST /eliminarLibroCarrito`.
- Calcula subtotal y total con envío fijo `PRECIO_ENVIO = 5.99`.
- Si el token expira, usa `renovarToken()`.

### 🧱 Componentes

- `src/Components/Header/header.jsx`
- Muestra logo, navegación y buscador.
- El buscador solo aparece en `/catalogo`.
- Botón usuario depende de si hay token en `localStorage`.
- Botón carrito navega a `/carrito`.
- El link “Catálogo” entra con filtros limpios.

- `src/Components/Footer/footer.jsx`
  - Pie de página con copyright.

- `src/Components/MiPerfil/miPerfil.jsx`
  - Obtiene datos de usuario (`/usuarios`), favoritos (`/librosFavoritos`) y compras (`/librosComprados`).
  - Calcula el género favorito por frecuencia.
- Lista favoritos con portadas 3D.
- Menú contextual (clic derecho) para eliminar favorito (`/eliminarLibro`).
- Tarjetas de estadísticas apiladas en móvil y favoritos centrados en pantallas pequeñas.

- `src/Components/MisCompras/misCompras.jsx`
  - Lista compras del usuario (`/librosComprados`).
  - Renderiza libro 3D y datos de la compra.

- `src/Components/Login-Registro/InicioRegistro/inicioRegistro.jsx`
  - Botones para alternar entre login y registro.

- `src/Components/Login-Registro/Botones-Enviar/Enviar-Login.jsx`
  - `POST /login`.
  - Guarda token en `localStorage`.

- `src/Components/Login-Registro/Botones-Enviar/Enviar-Registro.jsx`
  - `POST /register`.
  - Navega a `/login` tras registro correcto.

- `src/Components/LibrosDestacados/librosDestacados.jsx`
  - Archivo vacío (sin implementación).

### 🧰 Servicios y utilidades

- `src/Services/funtionGenres.js`
  - Define clase `Genero`.
  - Exporta `generosArray` con imágenes en `/public/images`.

- `src/Services/cerrarSesion.js`
  - Llama a `POST /cerrarSesion`.
  - Elimina `localStorage.token` en cualquier caso.

- `src/utils/utils.js`
  - `renovarToken()`: llama a `POST /refresh`, guarda token si ok.
  - `Libro3D`: renderiza un libro como `BoxGeometry` con textura de portada.

### 🧠 Contexto
- `src/Context/AuthContext.js`: archivo vacío, reservado para auth global.

### 🎨 Estilos
- `src/index.css`: inicializa Tailwind y estilos base.
- `src/App.css`: tipografía Orbitron y detalles de render.
- `src/Pages/Principal/principal.css`: fondo de presentación.
- `src/Pages/Login/styles-login.css`: estilos completos de login y registro.

---

## 🛠️ Backend (Node + Express)

### 🧪 Servidor
- `backend/server.js`:
  - Instancia Express.
  - Configura CORS para `http://localhost:3000` con `credentials: true`.
  - Usa `express.json()` y `cookie-parser`.
  - Monta rutas en `/` usando `routes/auth.js`.

### 🗄️ Base de datos
- `backend/config/db.js`:
  - Crea conexión con MySQL usando `mysql2/promise`.
  - Configuración hardcodeada:
    - host: `127.0.0.1`
    - user: `root`
    - password: `sergio`
    - database: `basedatosProyecto`

### 🧩 Controllers

- `authController.js` (login):
  - Verifica usuario por `nombre_usuario`.
  - Compara contraseña con `bcrypt`.
  - Genera access token y refresh token.
  - Guarda refresh token en la tabla `usuarios`.
  - Envía cookie `refreshToken` (httpOnly, sameSite strict, secure false).

- `registerController.js`:
  - Crea usuario con `bcrypt.hash`.
  - Inserta en tabla `usuarios`.

- `refreshTokenController.js`:
  - Lee `refreshToken` desde cookies.
  - Verifica firma con `JWT_REFRESH_SECRET`.
  - Comprueba que coincide con el token guardado en BD.
  - Emite nuevo access token.

- `usersController.js`:
  - `listarUsuarios()` devuelve todos los usuarios.
  - `listarUsuariosId()` devuelve usuario autenticado.
  - `cerrarSesion()` invalida refresh token en BD y limpia cookie.

- `librosController.js`:
  - `libros()` devuelve 6 libros (destacados).
  - `librosCompletos()` devuelve todos los libros.
  - `libroId()` devuelve libro por id.
  - `libroTitulo()` filtra por LIKE en título.
  - `librosFiltradosGenero()` filtra por lista de categorías.
  - `librosFavoritosUser()` devuelve favoritos del usuario (join con libros).
  - `anadirFavorito()` inserta favorito si no existe.
  - `eliminarFavoritoPorId()` elimina favorito por id.
  - `librosCompradosUser()` devuelve compras del usuario.
  - `crearLibro()` inserta libro (no se usa en rutas).

- `cartController.js`:
  - `añadirLibroCarrito()` inserta en tabla `carrito` si no existe.
  - `librosCarrito()` devuelve libros del carrito con join.
  - `eliminarLibroCarrito()` elimina libro del carrito.

### 🛡️ Middleware
- `backend/middleware/auth.middleware.js`:
  - Lee `Authorization: Bearer <token>`.
  - Verifica `JWT_SECRET`.
  - Inyecta `req.user` y `req.id_usuario`.
  - Responde 401 en casos inválidos o expirados.

### 🧭 Rutas
- `backend/routes/auth.js` define todos los endpoints `POST`.

---

## 📡 API de Backend (Referencia Detallada)
Todas las rutas usan método `POST`.

1. `POST /login`
- Auth: no.
- Body: `{ usuario, contraseña }`.
- Respuesta ok: `{ ok: true, mensaje, token }`.

2. `POST /register`
- Auth: no.
- Body: `{ nombre, email, password }`.
- Respuesta ok: `{ ok: true, mensaje }`.

3. `POST /refresh`
- Auth: cookie `refreshToken`.
- Body: vacío.
- Respuesta ok: `{ ok: true, token }`.

4. `POST /usuarios`
- Auth: Bearer token.
- Body: vacío.
- Respuesta ok: `{ ok: true, filas: [usuario] }`.

5. `POST /librosPublicos`
- Auth: no.
- Body: vacío.
- Respuesta ok: `{ ok: true, filas: [libros] }` (máx 6).

6. `POST /libros`
- Auth: no.
- Body: vacío.
- Respuesta ok: `{ ok: true, filas: [libros] }`.

7. `POST /libroId`
- Auth: no.
- Body: `{ id_libro }`.
- Respuesta ok: `{ ok: true, filas: [libro] }`.

8. `POST /libroTitulo`
- Auth: no.
- Body: `{ titulo_libro }`.
- Respuesta ok: `{ ok: true, filas: [libros] }`.

9. `POST /librosFiltrados`
- Auth: no.
- Body: `{ listaCategorias: [] }`.
- Respuesta ok: `{ ok: true, filas: [libros] }`.

10. `POST /librosFavoritos`
- Auth: Bearer token.
- Body: vacío.
- Respuesta ok: `{ ok: true, filas: [favoritos] }`.

11. `POST /anadirFavorito`
- Auth: Bearer token.
- Body: `{ id_libro }`.
- Respuesta ok: `{ ok: true, resultado | mensaje }`.

12. `POST /eliminarLibro`
- Auth: Bearer token.
- Body: `{ idFavorito }`.
- Respuesta ok: `{ ok: true, filas: resultado }`.

13. `POST /librosComprados`
- Auth: Bearer token.
- Body: vacío.
- Respuesta ok: `{ ok: true, filas: [compras] }`.

14. `POST /anadirLibroCarrito`
- Auth: Bearer token.
- Body: `{ id_libro }`.
- Respuesta ok: `{ ok: true, filas: resultado }`.

15. `POST /librosCarrito`
- Auth: Bearer token.
- Body: vacío.
- Respuesta ok: `{ ok: true, libros: [libros] }`.

16. `POST /eliminarLibroCarrito`
- Auth: Bearer token.
- Body: `{ id_libro }`.
- Respuesta ok: `{ ok: true, resultado }`.

17. `POST /cerrarSesion`
- Auth: no explícita (usa cookie si existe).
- Body: vacío.
- Respuesta ok: `{ ok: true, mensaje? }`.

---

## 🧱 Modelo de Datos Inferido
Tablas deducidas a partir de consultas SQL en controllers.

- `usuarios`
  - `id_usuario` (PK)
  - `nombre_usuario`
  - `gmail`
  - `contrasena` (hash bcrypt)
  - `token` (refresh token)

- `libros`
  - `id_libro` (PK)
  - `isbn`
  - `titulo`
  - `autor`
  - `categoria`
  - `editorial`
  - `existencias`
  - `url_imagen`
  - `descripcion`
  - `idioma`
  - `precio` (usado en frontend)
  - `publicacion` (usado en frontend)
  - `paginas` (usado en frontend)
  - `formato` (usado en frontend)

- `favoritos`
  - `id_favorito` (PK)
  - `id_user` (FK a `usuarios`)
  - `id_libro` (FK a `libros`)
  - `fecha`

- `compra`
  - `id_compra` (PK)
  - `id_user` (FK a `usuarios`)
  - `id_libro` (FK a `libros`)
  - `fecha`

- `carrito`
  - `id_user` (FK a `usuarios`)
  - `id_libro` (FK a `libros`)

---

## 🔐 Flujo de Autenticación
1. Usuario inicia sesión en `/login`.
2. Backend genera `access token` y `refresh token`.
3. El `refresh token` se guarda en cookie HTTP-Only y en BD.
4. El `access token` se guarda en `localStorage`.
5. En peticiones protegidas se envía `Authorization: Bearer <token>`.
6. Si el token expira, el frontend llama a `/refresh` y reintenta.
7. `cerrarSesion` elimina refresh token de BD y cookie.

---

## 🌱 Seeding de Libros
- Archivo: `backend/config/seedLibros.js`.
- Fuente: Open Library `search.json?q=fiction&limit=50`.
- Inserta o actualiza en tabla `libros` por ISBN.
- Ejecutar:
  - `cd backend`
  - `node config/seedLibros.js`

---

## 🖼️ Assets y Recursos Públicos
Carpeta `public/images`:
- `carrito-de-compras.png`
- `cienciaFiccion.png`
- `fantasiaEpica.png`
- `misterio.png`
- `terror.png`
- `fondotitulo.png`
- `logoLibreria2.jpg`
- `Library--Streamline-Ionic-Filled.svg`
- `google-app-logo-in-big-sur-style-3d-render-icon-design-concept-element-isolated-transparent-background-free-png.webp`
- `facebook-3d-facebook-logo-3d-facebook-icon-3d-facebook-symbol-free-png.webp`
- `icono-transparente-facebook-formato-psd_1073073-360.webp`
- `workspace.code-workspace`

Uso principal:
- Fondos en `principal.css` y `styles-login.css`.
- Íconos en login.

---

## 🧪 Testing
- `src/App.test.js` contiene el test por defecto de CRA (busca “learn react”).
- `src/setupTests.js` configura `@testing-library/jest-dom`.

---

## 📝 Informe de Evaluación Existente
Archivo: `📊 Evaluación General Proyecto.md`.

Puntos destacables del informe:
- Autenticación JWT completa con refresh.
- UI moderna con Tailwind y renderizado 3D.
- Carrito incompleto y Stripe no implementado.
- Rutas privadas pendientes en frontend.
- Buscador en Header no conectado en todas las vistas.

---

## 🧾 Apéndice: Mapa de Archivos (descripción breve)

Archivos raíz:
- `c:\Users\sergi\Desktop\proyectode0\.env`: configuración CRA.
- `c:\Users\sergi\Desktop\proyectode0\.gitignore`: exclusiones git.
- `c:\Users\sergi\Desktop\proyectode0\README.md`: documentación general del proyecto.
- `c:\Users\sergi\Desktop\proyectode0\package.json`: dependencias y scripts frontend.
- `c:\Users\sergi\Desktop\proyectode0\package-lock.json`: lock de dependencias frontend.
- `c:\Users\sergi\Desktop\proyectode0\tailwind.config.js`: configuración Tailwind.
- `c:\Users\sergi\Desktop\proyectode0\build`: salida compilada (generada).

Backend:
- `c:\Users\sergi\Desktop\proyectode0\backend\.env`: claves JWT.
- `c:\Users\sergi\Desktop\proyectode0\backend\package.json`: dependencias backend.
- `c:\Users\sergi\Desktop\proyectode0\backend\server.js`: servidor Express.
- `c:\Users\sergi\Desktop\proyectode0\backend\config\db.js`: conexión MySQL.
- `c:\Users\sergi\Desktop\proyectode0\backend\config\seedLibros.js`: seeding Open Library.
- `c:\Users\sergi\Desktop\proyectode0\backend\controllers\authController.js`: login.
- `c:\Users\sergi\Desktop\proyectode0\backend\controllers\registerController.js`: registro.
- `c:\Users\sergi\Desktop\proyectode0\backend\controllers\refreshTokenController.js`: refresh.
- `c:\Users\sergi\Desktop\proyectode0\backend\controllers\usersController.js`: usuario y logout.
- `c:\Users\sergi\Desktop\proyectode0\backend\controllers\librosController.js`: libros y favoritos.
- `c:\Users\sergi\Desktop\proyectode0\backend\controllers\cartController.js`: carrito.
- `c:\Users\sergi\Desktop\proyectode0\backend\middleware\auth.middleware.js`: auth JWT.
- `c:\Users\sergi\Desktop\proyectode0\backend\routes\auth.js`: rutas API.

Frontend:
- `c:\Users\sergi\Desktop\proyectode0\src\index.js`: entrypoint React.
- `c:\Users\sergi\Desktop\proyectode0\src\index.css`: base CSS + Tailwind.
- `c:\Users\sergi\Desktop\proyectode0\src\App.js`: rutas y Toaster.
- `c:\Users\sergi\Desktop\proyectode0\src\App.css`: tipografía global.
- `c:\Users\sergi\Desktop\proyectode0\src\App.test.js`: test default.
- `c:\Users\sergi\Desktop\proyectode0\src\reportWebVitals.js`: métricas.
- `c:\Users\sergi\Desktop\proyectode0\src\setupTests.js`: config tests.
- `c:\Users\sergi\Desktop\proyectode0\src\Context\AuthContext.js`: vacío.
- `c:\Users\sergi\Desktop\proyectode0\src\Services\funtionGenres.js`: géneros.
- `c:\Users\sergi\Desktop\proyectode0\src\Services\cerrarSesion.js`: logout.
- `c:\Users\sergi\Desktop\proyectode0\src\utils\utils.js`: refresh y Libro3D.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Principal\principal.jsx`: landing.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Principal\principal.css`: estilos landing.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Catalogo\catalogo.jsx`: catálogo.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Libros\paginaLibro.jsx`: detalle libro.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Login\login.jsx`: login/registro.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Login\styles-login.css`: estilos login.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Perfil\perfil.jsx`: perfil.
- `c:\Users\sergi\Desktop\proyectode0\src\Pages\Carrito\carrito.jsx`: carrito.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\Header\header.jsx`: header.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\Footer\footer.jsx`: footer.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\MiPerfil\miPerfil.jsx`: panel perfil.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\MisCompras\misCompras.jsx`: compras.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\LibrosDestacados\librosDestacados.jsx`: vacío.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\Login-Registro\InicioRegistro\inicioRegistro.jsx`: selector login/registro.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\Login-Registro\Botones-Enviar\Enviar-Login.jsx`: login API.
- `c:\Users\sergi\Desktop\proyectode0\src\Components\Login-Registro\Botones-Enviar\Enviar-Registro.jsx`: registro API.

Public:
- `c:\Users\sergi\Desktop\proyectode0\public\index.html`: HTML base.
- `c:\Users\sergi\Desktop\proyectode0\public\manifest.json`: PWA manifest.
- `c:\Users\sergi\Desktop\proyectode0\public\robots.txt`: robots.
- `c:\Users\sergi\Desktop\proyectode0\public\images\*`: assets gráficos.

---

Fin del documento.

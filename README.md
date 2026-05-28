# Rick Gallery API M3L4 HENRY practica

Este proyecto es un mini-dashboard que consume la API de **Rick and Morty** y muestra una galería de personajes.

La aplicación está organizada en capas:

- `src/services/fetchJson.js` — helper de red que hace `fetch()` y valida `response.ok`
- `src/services/rmApi.js` — construye la URL y obtiene los personajes de la API
- `src/transform/character.js` — transforma los datos crudos de la API en objetos claros para la UI
- `src/ui/characterGrid.js` — renderiza el estado de la aplicación y las cards en el DOM
- `src/main.js` — orquesta el flujo de carga, el manejo de estados y los eventos de usuario

---

## Cómo funciona

1. `src/main.js` inicia la aplicación y carga la galería.
2. `src/services/rmApi.js` crea la URL de búsqueda y llama a `fetchJson()`.
3. `fetchJson()` obtiene la respuesta HTTP y valida que `response.ok` sea verdadero.
4. `rmApi.fetchCharacters()` extrae `data.results` del JSON devuelto por la API.
5. `rmApi.getFirstSixCharacters()` retorna solo los primeros 6 personajes.
6. `src/transform/character.js` transforma cada personaje crudo en un `profile` limpio:
   - `id`
   - `name`
   - `image`
   - `status`
   - `statusClass`
   - `species`
   - `originName`
   - `locationName`
7. `src/ui/characterGrid.js` renderiza el estado actual:
   - `loading`
   - `error`
   - `success`

El flujo completo es un pipeline claro y ordenado: datos de red → transformación → render.

---

## Estructura de archivos

- `index.html` — contiene la estructura HTML de la app y los contenedores de estados.
- `styles.css` — define el diseño de la grilla, las tarjetas y los estados de carga/error.
- `src/main.js` — controla el estado, dispara la carga de personajes y escucha el botón de retry.
- `src/services/fetchJson.js` — hace la petición HTTP y arroja error si el status no es OK.
- `src/services/rmApi.js` — arma la URL y devuelve los personajes de la API.
- `src/transform/character.js` — normaliza los datos crudos para la UI.
- `src/ui/characterGrid.js` — crea las tarjetas HTML y muestra mensajes al usuario.

---

## Cómo ejecutar

### Clonar el proyecto

Si querés ejecutar este proyecto en cualquier equipo, seguí estos pasos:

1. Abrí la carpeta donde querés guardar el proyecto.
2. Abrí una terminal en esa carpeta (por ejemplo "Open Bash Here" o "Open PowerShell Here").
3. Ejecutá:

```bash
# Clonar el repositorio desde GitHub
# Reemplazá la URL por la URL real del repositorio si es necesario
git clone https://github.com/tu-usuario/tu-repositorio.git

# Entrar a la carpeta creada por Git
git checkout main
cd tu-repositorio
```

> Nota: necesitás tener instalado Git y Node.js (o al menos `npx` disponible).

### Opción 1: con `live-server`

Desde la carpeta del proyecto en la terminal:

```bash
npx --yes live-server --port=8095
```

Después abrí en el navegador:

```text
http://127.0.0.1:8095
```

### Opción 2: con la extensión Live Server de VS Code

1. Abrí `index.html` en VS Code.
2. Hacé clic en "Go Live".
3. Abrí la URL que te muestra la extensión.

---

## Qué esperar

- Al inicio se carga la galería de personajes.
- Si la app está en proceso, aparece el estado `loading`.
- Si ocurre un error, muestra un mensaje amigable.
- Si todo sale bien, renderiza una grilla con hasta 6 personajes.
- El botón `Retry` vuelve a cargar la galería en caso de falla.

## Buscador y comportamiento del botón `Retry`

Se agregó un buscador en la cabecera para consultar la API por nombre y una lista de sugerencias rápidas.

- `#search-form` / `#search-input`: formulario para escribir el término a buscar y presionar `Buscar`.
- `.suggestion-list`: lista de botones rápidos (Rick, Morty, Summer, Beth). Al hacer clic en una sugerencia, el nombre se copia en el campo de búsqueda pero NO se realiza la consulta automáticamente — tenés que presionar `Buscar` para ejecutar la petición. Esto permite editar el término antes de buscar.

Comportamiento del botón `Retry`:

- `#retry-btn` aparece únicamente cuando el estado es `error` (panel de error visible).
- `Retry` ahora intentará primero la última búsqueda exitosa (`lastSuccessfulQuery`). Si no hay ninguna búsqueda exitosa previa, hará fallback a la última búsqueda intentada (`lastQuery`). Si no existe ninguna consulta almacenada, enfocará el campo de búsqueda para que ingreses un término nuevo.

Esto hace que `Retry` sea más útil: evita repetir automáticamente una búsqueda fallida y facilita volver a una consulta que previamente sí devolvió resultados.

Cómo probarlo rápidamente:

1. Buscar `morty` (debe mostrar resultados).
2. Buscar `asdfasdf` (término inexistente) — aparecerá el panel de error con `🔄 Reintentar`.
3. Pulsar `🔄 Reintentar` — reintentará `morty` (última búsqueda exitosa) en lugar de repetir la búsqueda fallida.

Archivos modificados relacionados:

- `index.html` — formulario de búsqueda y lista de sugerencias.
- `styles.css` — estilos para barra de búsqueda y sugerencias.
- `src/main.js` — lógica del buscador, manejo de sugerencias y mejora del comportamiento de `Retry`.

---

## Notas importantes

- `fetchJson.js` es la única capa que validará `response.ok`.
- La API devuelve los personajes en `data.results`, no en `data` directamente.
- `origin` y `location` son objetos anidados, por eso el código usa `?.` para acceder de forma segura.
- La transformación en `character.js` asegura que la UI siempre reciba datos consistentes.

---

## Ejemplo de uso

1. Abrir la app en el navegador.
2. Ver el estado de carga.
3. Confirmar que aparecen hasta 6 cards.
4. En caso de error, usar el botón `Retry`.

¡Listo! Este README describe cómo funciona la app y cómo ejecutarla correctamente.

Checkpoint:

```js
const api = await import("./src/services/rmApi.js");
const t = await import("./src/transform/character.js");
const raw = await api.getFirstSixCharacters("rick");
const profiles = t.toCharacterProfileList(raw);
profiles.length;
```

Esperado:

```text
6
```

---

## Paso 4 — Completar `src/ui/characterGrid.js`

Este archivo renderiza.

Regla:

```text
Recibe ViewModels.
Construye HTML.
No hace fetch.
No transforma raw API.
```

### TODO 1: `render(state)`

Necesitás implementar el patrón:

```text
ocultar todo -> actualizar badge -> mostrar panel correcto
```

Estados:

```text
loading
error
success
```

Pistas:

- Ocultá `$loading`, `$error` y `$success` al principio.
- El badge muestra `estado: ${state.status}`.
- En `loading`, mostrás spinner.
- En `error`, mostrás mensaje.
- En `success`, renderizás la grilla.

Para success:

```text
state.data es array de ViewModels.
Cada ViewModel se transforma en una card.
El array de strings HTML se une en un string final.
```

### TODO 2: `buildCard(profile)`

Necesitás crear una card con:

- imagen
- nombre
- status + especie
- punto de color según `statusClass`
- origen
- ubicación

Pistas:

```text
profile.statusClass se usa para armar status-dot--alive, status-dot--dead o status-dot--unknown.
profile ya viene limpio desde el transform.
No necesitás acceder a origin.name ni location.name acá.
```

### TODO 3: `getUserMessage(error)`

Necesitás traducir errores técnicos a mensajes humanos.

Casos:

```text
NO_RESULTS
404
offline
default
```

Pistas:

- Para `NO_RESULTS`, usar `error.code`.
- Para HTTP 404, usar `error.status`.
- Para offline, usar `navigator.onLine`.
- Para default, usar `error?.message`.

---

## Paso 5 — Reescribir `src/main.js`

Este archivo coordina el pipeline.

Primero borrá el anti-patrón.

Después necesitás:

1. Importar la función que trae los primeros 6 personajes.
2. Importar la función que transforma raw array en ViewModels.
3. Importar `render` y `getUserMessage`.
4. Crear un estado simple.
5. Crear `setState(updates)`.
6. Crear `loadGallery(name)`.
7. Conectar retry.
8. Cargar `"rick"` al inicio.

### Estado esperado

Campos:

```text
status
data
error
```

### `setState(updates)`

Pistas:

```text
Fusiona updates dentro del state.
Después llama render(state).
```

### `loadGallery(name)`

Flujo:

```text
setState loading
try:
  pedir raw characters
  transformar a profiles
  setState success con profiles
catch:
  setState error con mensaje humano
```

Pistas:

- Antes de pedir datos, limpiar `data` y `error`.
- Los datos raw no van directo al render.
- El render recibe ViewModels.
- Agregá logs para ver raw y profiles durante la clase.

### Retry

Pista:

```text
El botón retry vuelve a llamar loadGallery("rick").
```

### Inicio

Pista:

```text
La galería carga automáticamente. No hay formulario.
```

---

## Paso 6 — Probar el resultado

### Happy path

Al cargar:

```text
estado: loading
luego estado: success
Mostrando 6 personajes
6 cards
```

### Network

En DevTools:

```text
Network -> request a rickandmortyapi.com
status 200
response con info + results
```

### Console

Deberías ver logs del pipeline:

```text
Raw characters recibidos
ViewModels generados
```

### Responsive

Probar:

```text
mobile  -> 1 columna
tablet  -> 2 columnas
desktop -> 3 columnas
```

### Error/offline

Poner DevTools en Offline y recargar.

Esperado:

```text
estado: error
mensaje humano
botón Reintentar
```

---

## Errores comunes

### Error 1: `characters no es un array`

Probable causa:

```text
Usaste data en vez de data.results.
```

Revisá:

```text
¿Dónde vive el array real?
```

### Error 2: `Cannot read properties of undefined`

Probable causa:

```text
Accediste a raw.origin.name sin validar origin.
```

Revisá:

```text
¿Usaste optional chaining?
```

### Error 3: Todas las cards muestran Unknown

Probable causa:

```text
Ruta incorrecta al campo anidado.
```

Revisá en Network:

```text
results[0].origin.name
results[0].location.name
```

### Error 4: La grilla no aparece

Probable causa:

```text
No llamaste render después de cambiar state.
```

Revisá:

```text
setState debe llamar render(state).
```

---

## Checklist final

- [ ] `buildUrl` usa `URLSearchParams`.
- [ ] `fetchCharacters` extrae `data.results`.
- [ ] `getFirstSixCharacters` devuelve 6 elementos.
- [ ] `toCharacterProfile` devuelve ViewModel plano.
- [ ] `toCharacterProfileList` usa `map`.
- [ ] `render` oculta todo y muestra un estado.
- [ ] `buildCard` usa ViewModel, no raw API.
- [ ] `main.js` coordina el pipeline.
- [ ] Retry vuelve a cargar `"rick"`.
- [ ] La grilla responde a mobile/tablet/desktop.

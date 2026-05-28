# Rick Gallery — Starter M3L4

Este es el punto de partida para el Hands On de **Consumiendo APIs REST y Estructuras de Datos**.

El objetivo es transformar un anti-patrón con `fetch` directo en un pipeline ordenado:

```text
buildUrl -> fetchJson -> fetchCharacters -> toCharacterProfile -> renderGrid
```

Importante: este README guía el proceso, pero no entrega la solución completa.
La idea es que completes los TODOs en clase siguiendo los pasos.

---

## Cómo correr el starter

Desde esta carpeta:

```bash
npx --yes live-server --port=8095
```

Abrir:

```text
http://127.0.0.1:8095
```

Qué vas a ver al inicio:

- La app carga.
- No se renderizan cards todavía.
- La consola muestra un warning didáctico del anti-patrón.

Eso es esperado: el starter está preparado para mostrar por qué necesitamos el pipeline.

---

## Qué archivos NO se tocan

Estos archivos ya están completos:

```text
index.html
styles.css
src/services/fetchJson.js
```

Por qué:

- `index.html` ya tiene los contenedores de estado.
- `styles.css` ya tiene la grilla, cards, hover y responsive.
- `fetchJson.js` ya fue trabajado en M3L3.

---

## Qué archivos vas a completar

```text
src/services/rmApi.js
src/transform/character.js
src/ui/characterGrid.js
src/main.js
```

Orden recomendado:

```text
1. Inspeccionar JSON en el navegador
2. Completar rmApi.js
3. Completar character.js
4. Completar characterGrid.js
5. Reescribir main.js
6. Probar responsive y errores
```

---

## Paso 1 — Inspeccionar el JSON antes de codear

Abrí esta URL:

```text
https://rickandmortyapi.com/api/character/?name=rick
```

Anotá:

- Qué claves hay en la raíz.
- Dónde está el array de personajes.
- Qué campos tiene `results[0]`.
- Si `origin` es string u objeto.
- Si `location` es string u objeto.

Pistas:

```text
Los personajes no están en data directamente.
Hay una propiedad que contiene el array.
origin y location son objetos anidados.
```

Checklist:

- [ ] Identifiqué dónde está el array.
- [ ] Identifiqué el campo `name`.
- [ ] Identifiqué el campo `image`.
- [ ] Identifiqué cómo llegar a `origin.name`.
- [ ] Identifiqué cómo llegar a `location.name`.

---

## Paso 2 — Completar `src/services/rmApi.js`

Este archivo se encarga de hablar con la Rick & Morty API.
No transforma datos y no toca el DOM.

### TODO 1: `buildUrl({ name, page = 1 })`

Necesitás construir una URL segura usando `URLSearchParams`.

No uses concatenación manual.

Pistas:

```text
Crear params con name y page.
Convertir page a string.
Usar name.trim().
Retornar BASE_URL + "?" + params.toString().
```

Checkpoint:

```js
const api = await import("./src/services/rmApi.js");
api.buildUrl({ name: "Rick & Morty", page: 1 });
```

Deberías ver una URL con el `&` codificado, no roto como separador de query.

### TODO 2: `fetchCharacters(name)`

Necesitás:

1. Construir la URL con `buildUrl`.
2. Pedir datos con `fetchJson`.
3. Extraer el array correcto del JSON.
4. Validar que sea array y que no esté vacío.
5. Retornar el array raw.

Pistas:

```text
La API devuelve un objeto raíz.
El array está dentro de una propiedad.
Si esa propiedad no es array, hay que lanzar error.
```

Checkpoint:

```js
const api = await import("./src/services/rmApi.js");
await api.fetchCharacters("rick");
```

Debería devolver un array de personajes raw.

### TODO 3: `getFirstSixCharacters(name)`

Necesitás:

1. Llamar a `fetchCharacters(name)`.
2. Tomar solo los primeros 6.

Pista:

```text
Los arrays tienen un método para tomar una porción sin mutar el original.
```

Checkpoint:

```js
const api = await import("./src/services/rmApi.js");
const chars = await api.getFirstSixCharacters("rick");
chars.length;
```

Esperado:

```text
6
```

---

## Paso 3 — Completar `src/transform/character.js`

Este archivo convierte el JSON crudo de la API en un ViewModel.

Regla:

```text
Recibe raw JSON.
Devuelve objeto plano y seguro para la UI.
No hace fetch.
No toca el DOM.
```

### TODO 1: `getOriginName(raw)`

Necesitás leer el origen de forma segura.

Pistas:

```text
origin puede ser objeto.
origin podría faltar.
Usá optional chaining.
Usá nullish coalescing para default.
```

Checkpoint mental:

```text
Si raw.origin existe, quiero raw.origin.name.
Si no existe, quiero "Unknown".
```

### TODO 2: `getLocationName(raw)`

Mismo patrón que origin, pero con location.

Checkpoint mental:

```text
Si raw.location existe, quiero raw.location.name.
Si no existe, quiero "Unknown".
```

### TODO 3: `getStatusClass(status)`

Necesitás traducir valores de API a clases CSS.

La API devuelve:

```text
Alive
Dead
unknown
```

El CSS espera:

```text
alive
dead
unknown
```

Pista:

```text
Un objeto mapa funciona mejor que muchos if.
```

### TODO 4: `toCharacterProfile(rawCharacter)`

Necesitás construir este contrato:

```text
id
name
image
status
statusClass
species
originName
locationName
```

Pistas:

- Para campos raíz, podés usar destructuring.
- Para campos anidados, usá helpers.
- Para defaults, usá `??`.
- No uses `||` para defaults de datos de API.

Checkpoint:

```js
const t = await import("./src/transform/character.js");
t.toCharacterProfile({
  id: 1,
  name: "Test Rick",
  status: "Alive",
  species: "Human",
  image: "image.jpg",
  origin: null,
  location: { name: "Earth" },
});
```

No debería crashear aunque `origin` sea `null`.

### TODO 5: `toCharacterProfileList(rawArray)`

Necesitás transformar un array entero.

Pista:

```text
Cuando quiero array -> array transformado, pienso en map.
```

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

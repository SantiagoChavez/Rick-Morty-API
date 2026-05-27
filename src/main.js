// ============================================================
// STARTER — Anti-patrón: fetch directo sin pipeline
// ============================================================
// Esta app "funciona" solo si tenemos suerte, pero tiene 5 bugs:
//
//   1. URL construida con concatenación -> falla con caracteres especiales
//   2. No valida response.ok -> un 404 no entra al catch
//   3. Accede a data en vez de data.results -> no obtiene el array real
//   4. No hay transform -> data anidada llega directa al render
//   5. Accede a character.origin.name sin ?. -> crash si origin es null
//
// Tu tarea: reemplazar esto con el pipeline correcto
// ============================================================

async function loadRicks() {
  // ❌ Bug 1: URL concatenada -> falla con espacios o caracteres especiales
  const url = "https://rickandmortyapi.com/api/character/?name=rick&page=1";

  // ❌ Bug 2: sin response.ok -> 404 no va al catch
  const response = await fetch(url);
  const data = await response.json();

  // ❌ Bug 3: accede a data directamente, no a data.results
  // Si la API devuelve { info: ..., results: [...] }, data es el objeto raíz.
  const characters = data; // debería ser data.results

  // ❌ Bug 4: intenta iterar sobre el objeto raíz (no el array)
  // ❌ Bug 5: accede a character.origin.name sin ?. si llegara un dato incompleto
  const grid = document.querySelector("#cards-grid");

  if (grid && Array.isArray(characters)) {
    grid.innerHTML = characters
      .slice(0, 6)
      .map(
        (character) => `
          <article class="card">
            <img class="card__image" src="${character.image}" alt="${character.name}" />
            <div class="card__body">
              <h2 class="card__name">${character.name}</h2>
              <p>${character.status} — ${character.species}</p>
              <p>Origen: ${character.origin.name}</p>
            </div>
          </article>
        `
      )
      .join("");

    document.querySelector("#state-success")?.classList.remove("hidden");
  } else {
    console.warn("Anti-patrón detectado: characters no es un array:", characters);
  }
}

loadRicks();

// ============================================================
// TODO 1: Importar getFirstSixCharacters desde ./services/rmApi.js
// TODO 2: Importar toCharacterProfileList desde ./transform/character.js
// TODO 3: Importar render y getUserMessage desde ./ui/characterGrid.js
// TODO 4: Crear objeto state con { status, data, error }
// TODO 5: Crear función setState(updates) que fusiona y llama render(state)
// TODO 6: Implementar loadGallery(name):
//           setState loading -> getFirstSixCharacters -> toCharacterProfileList
//           -> setState success / catch -> setState error con getUserMessage
// TODO 7: Agregar event listener al #retry-btn
// TODO 8: Llamar loadGallery("rick") al inicio
// ============================================================

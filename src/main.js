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
import { getFirstSixCharacters } from "./services/rmApi.js";
import { toCharacterProfileList } from "./transform/character.js";
import { render, getUserMessage } from "./ui/characterGrid.js"; 

// ============================================================
// TODO 1: Importar getFirstSixCharacters desde ./services/rmApi.js
// TODO 2: Importar toCharacterProfileList desde ./transform/character.js
// TODO 3: Importar render y getUserMessage desde ./ui/characterGrid.js
// TODO 4: Crear objeto state con { status, data, error }
const state = {
    status: "idle",
    data: null,
    error: null,
  };

const $searchForm = document.querySelector("#search-form");
const $searchInput = document.querySelector("#search-input");
const $suggestions = document.querySelectorAll(".suggestion-btn");
const $retryBtn = document.querySelector("#retry-btn");
let lastQuery = "morty";
let lastSuccessfulQuery = null;

$searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $searchInput.value.trim();
  if (query) {
    loadGallery(query);
  }
});

$suggestions.forEach((button) => {
  button.addEventListener("click", () => {
    $searchInput.value = button.dataset.query;
    $searchInput.focus();
  });
});

// TODO 5: Crear función setState(updates) que fusiona y llama render(state)
function setState(updates) {
    Object.assign(state, updates);
    render(state);
}
// TODO 6: Implementar loadGallery(name):
//           setState loading -> getFirstSixCharacters -> toCharacterProfileList
//           -> setState success / catch -> setState error con getUserMessage
async function loadGallery(name) {
  lastQuery = name;
  setState({ status: "loading", data: null, error: null });
    try {        
        const rawCharacters = await getFirstSixCharacters(name);
        const profiles = toCharacterProfileList(rawCharacters);
        lastSuccessfulQuery = name;
        setState({ status: "success", data: profiles, error: null });
    } catch (err) {
        const message = getUserMessage(err);
        setState({ status: "error", data: null, error: message });
    }
} 
// TODO 7: Agregar event listener al #retry-btn
if ($retryBtn) {
  $retryBtn.addEventListener("click", () => {
    const target = lastSuccessfulQuery ?? lastQuery;
    if (target) {
      loadGallery(target);
    } else {
      $searchInput.focus();
    }
  });
}
// TODO 8: Llamar loadGallery("morty") al inicio
// ============================================================
loadGallery("morty");
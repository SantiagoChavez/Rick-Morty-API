// ============================================================
// characterGrid.js — Capa de render
// ============================================================
// Responsabilidad: recibir ViewModels y construir HTML.
// NUNCA hace fetch. NUNCA transforma datos.
// ============================================================

// Referencias DOM (ya dadas, no son TODOs)
const $loading = document.querySelector("#state-loading");
const $error = document.querySelector("#state-error");
const $success = document.querySelector("#state-success");
const $grid = document.querySelector("#cards-grid");
const $errMsg = document.querySelector("#error-message");
const $count = document.querySelector("#results-count");
const $badge = document.querySelector("#state-badge");

// TODO 1: Implementar render(state)
//
// Patrón: ocultar todo -> mostrar solo el panel del estado actual.
//
// Pasos:
//   1. Ocultar los 3 paneles: [$loading, $error, $success].forEach(...)
//      Tip: agregar clase "hidden" a cada uno
//
//   2. Actualizar badge: $badge.textContent = `estado: ${state.status}`
//
//   3. Según state.status mostrar el panel correspondiente:
//
//      "loading" -> quitar "hidden" de $loading
//
//      "error"   -> quitar "hidden" de $error
//                   $errMsg.textContent = state.error
//
//      "success" -> quitar "hidden" de $success
//                   const profiles = state.data
//                   $count.textContent = `Mostrando ${profiles.length} personajes`
//                   $grid.innerHTML = profiles.map(buildCard).join("")
//
// export function render(state) { ... }

// TODO 2: Implementar buildCard(profile)
//
// Recibe UN ViewModel (ya limpio) y retorna el HTML string de la card.
//
//   <article class="card">
//     <img class="card__image" src="${profile.image}" alt="..." loading="lazy" />
//     <div class="card__body">
//       <h2 class="card__name">${profile.name}</h2>
//       <div class="card__meta">
//         <span class="status-dot status-dot--${profile.statusClass}"></span>
//         <span class="card__status-text">${profile.status} — ${profile.species}</span>
//       </div>
//       <p class="card__detail">🌍 Origen: <span>${profile.originName}</span></p>
//       <p class="card__detail">📍 Ubicación: <span>${profile.locationName}</span></p>
//     </div>
//   </article>
//
// function buildCard(profile) { ... }

// TODO 3: Implementar getUserMessage(error)
//
// Traduce errores técnicos a mensajes entendibles.
//
// Casos:
//   - error.code === "NO_RESULTS" -> "No encontramos personajes con ese nombre."
//   - error.status === 404 -> "El recurso no existe (404)."
//   - !navigator.onLine -> "Sin conexión a internet..."
//   - default -> `Error inesperado: ${error?.message ?? "Algo salió mal"}`
//
// export function getUserMessage(error) { ... }

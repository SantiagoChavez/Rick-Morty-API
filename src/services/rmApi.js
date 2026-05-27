// ============================================================
// rmApi.js — Capa de red para la Rick & Morty API
// ============================================================

import { fetchJson } from "./fetchJson.js";

const BASE_URL = "https://rickandmortyapi.com/api/character/";

// TODO 1: Implementar buildUrl({ name, page = 1 })
//
// Construye la URL de búsqueda con URLSearchParams.
//
// ANTI-PATRÓN a evitar:
//   ❌ return `${BASE_URL}?name=${name}&page=${page}`
//   -> falla con espacios, &, ñ, tildes
//
// PATRÓN CORRECTO:
//   ✅ new URLSearchParams({ name: name.trim(), page: String(page) })
//   -> codifica automáticamente cualquier caracter especial
//
// Ejemplo de URL resultante:
//   "https://rickandmortyapi.com/api/character/?name=rick&page=1"
//
// export function buildUrl({ name, page = 1 }) { ... }

// TODO 2: Implementar fetchCharacters(name)
//
// Busca personajes y devuelve el ARRAY crudo de resultados.
//
// Pasos:
//   1. Llamar a buildUrl({ name, page: 1 }) para construir la URL
//   2. Llamar a fetchJson(url) para hacer la request (ya valida response.ok)
//   3. Extraer data.results
//
// Inspección del JSON que devuelve la API:
//   {
//     info: { count: 107, pages: 6 },
//     results: [ { id, name, status, ... } ]   ← acá están los personajes
//   }
//
//   Los datos útiles NO están en data directamente, sino en data.results
//
//   Validar que results sea un array no vacío:
//   if (!Array.isArray(results) || results.length === 0) {
//     const err = new Error("No results found")
//     err.code = "NO_RESULTS"
//     throw err
//   }
//
//   Retornar el array crudo (sin transformar todavía)
//
// export async function fetchCharacters(name) { ... }

// TODO 3: Implementar getFirstSixCharacters(name)
//
// Llama a fetchCharacters(name) y retorna solo los primeros 6 resultados.
// Tip: Array.slice(0, 6)
//
// export async function getFirstSixCharacters(name) { ... }

// ============================================================
// character.js — Transformación de raw API -> ViewModel
// ============================================================
// Responsabilidad: recibir objeto crudo de la API y devolver
// un objeto plano y predecible para la UI.
//
// Nunca toca la red. Nunca toca el DOM.
// ============================================================

// TODO 1: Implementar getOriginName(raw)
//
// El campo origin en el JSON es un OBJETO anidado: { name: "...", url: "..." }
// No un string. Si accedés con raw.origin.name sin validar -> TypeError.
//
// RUTA en el JSON: results[0].origin.name
//
// Usar optional chaining (?.) para acceso seguro:
//   raw.origin?.name  -> si origin es null/undefined, devuelve undefined
//
// Usar nullish coalescing (??) para el default:
//   raw.origin?.name ?? "Unknown"
//
// POR QUÉ ?? Y NO ||:
//   Si origin.name es "" (string vacío), ?? lo respeta, || lo pisa con "Unknown"
//
// function getOriginName(raw) { ... }

// TODO 2: Implementar getLocationName(raw)
//
// Mismo patrón que getOriginName.
// RUTA en el JSON: results[0].location.name
//
// function getLocationName(raw) { ... }

// TODO 3: Implementar getStatusClass(status)
//
// Mapea el status de la API a la clase CSS del dot de color.
// Valores posibles que devuelve la API: "Alive", "Dead", "unknown"
// Clases CSS en styles.css: "alive", "dead", "unknown"
//
// Tip: usar un objeto como mapa y ?? para el fallback
//
// function getStatusClass(status) { ... }

// TODO 4: Implementar toCharacterProfile(rawCharacter)
//
// Función principal de transformación.
//
// Contrato del ViewModel que debe producir:
// {
//   id: number,
//   name: string,
//   image: string,
//   status: string,
//   statusClass: string,
//   species: string,
//   originName: string,
//   locationName: string,
// }
//
// Pasos:
//   1. Destructuring de campos planos:
//      const { id, name, status, species, image } = rawCharacter
//
//   2. Usar ?? para defaults:
//      name: name ?? "Desconocido"
//
//   3. Usar helpers para campos anidados:
//      originName: getOriginName(rawCharacter)
//      locationName: getLocationName(rawCharacter)
//
// export function toCharacterProfile(rawCharacter) { ... }

// TODO 5: Implementar toCharacterProfileList(rawArray)
//
// Transforma un ARRAY de personajes raw -> array de ViewModels.
// Usa Array.map() aplicando toCharacterProfile a cada ítem.
//
// export function toCharacterProfileList(rawArray) { ... }

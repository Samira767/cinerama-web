/**
 * Punto único de acceso a datos.
 *
 * Fase 1: implementación mock (localStorage).
 * Fase 2: crear `data/api/repositorios.ts` que implemente las mismas interfaces
 * contra el backend y cambiar la línea de abajo por `crearRepositoriosApi()`.
 */
import type { Repositorios } from "./repositories";
import { crearRepositoriosMock } from "./mock/repositorios";

export const repos: Repositorios = crearRepositoriosMock();

export type { Repositorios } from "./repositories";
export { restablecer as restablecerDatosDemo } from "./mock/db";

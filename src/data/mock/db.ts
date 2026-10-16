/**
 * "Base de datos" de la Fase 1: un objeto en memoria persistido en localStorage.
 * Se suscribe con useSyncExternalStore para que la UI reaccione a los cambios
 * (por ejemplo, lo que se edita desde el panel administrativo).
 */
import { completarProgramacion, crearSemilla, type BaseDatos } from "../seed";
import { hoy } from "@/lib/fechas";

const CLAVE = "cinerama-demo-db";
// Subir al cambiar los datos semilla: fuerza a recargar la semilla en los navegadores.
const VERSION_ESQUEMA = 2;

interface Almacenado {
  version: number;
  datos: BaseDatos;
}

let db: BaseDatos | null = null;
let revision = 0;
const oyentes = new Set<() => void>();

const hayNavegador = () => typeof window !== "undefined" && !!window.localStorage;

function cargar(): BaseDatos {
  if (hayNavegador()) {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) {
        const guardado = JSON.parse(crudo) as Almacenado;
        if (guardado.version === VERSION_ESQUEMA) {
          // Si la demo se abre días después, se programan los días que falten.
          if (completarProgramacion(guardado.datos, hoy())) persistir(guardado.datos);
          return guardado.datos;
        }
      }
    } catch {
      // Datos corruptos o acceso bloqueado: se vuelve a la semilla.
    }
  }
  const semilla = crearSemilla(hoy());
  persistir(semilla);
  return semilla;
}

function persistir(datos: BaseDatos) {
  if (!hayNavegador()) return;
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ version: VERSION_ESQUEMA, datos }));
  } catch {
    // Cuota llena o modo privado: la demo sigue funcionando en memoria.
  }
}

export function leer(): BaseDatos {
  db ??= cargar();
  return db;
}

/** Aplica un cambio, lo persiste y notifica a los suscriptores. */
export function escribir<R>(mutar: (datos: BaseDatos) => R): R {
  const datos = leer();
  const resultado = mutar(datos);
  persistir(datos);
  revision++;
  oyentes.forEach((o) => o());
  return resultado;
}

/** Vuelve a los datos de fábrica (útil antes de una presentación). */
export function restablecer() {
  db = crearSemilla(hoy());
  persistir(db);
  revision++;
  oyentes.forEach((o) => o());
}

export function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  const alCambiarEnOtraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    db = null;
    revision++;
    oyente();
  };
  window.addEventListener("storage", alCambiarEnOtraPestana);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiarEnOtraPestana);
  };
}

export function obtenerRevision() {
  return revision;
}

export function nuevoId(prefijo: string) {
  return `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

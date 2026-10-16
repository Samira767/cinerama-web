import type { Formato, Funcion, Idioma } from "@/domain/types";
import { ETIQUETA_IDIOMA } from "@/domain/types";
import { DIAS_PROGRAMACION } from "@/data/seed";
import { aFechaISO, desdeISO, hoy, sumarDias } from "./fechas";

/** Días con programación, empezando hoy. */
export function diasDeProgramacion(): Date[] {
  const inicio = hoy();
  return Array.from({ length: DIAS_PROGRAMACION }, (_, i) => sumarDias(inicio, i));
}

/** Fecha válida desde la URL (?fecha=2026-10-16) o la de hoy. */
export function fechaDesdeParametro(valor: string | null): string {
  const dias = diasDeProgramacion().map(aFechaISO);
  return valor && dias.includes(valor) ? valor : dias[0];
}

/** Funciones que todavía no empezaron (se da 10 min de tolerancia). */
export function funcionesDisponibles(funciones: Funcion[], ahora = new Date()): Funcion[] {
  const limite = ahora.getTime() - 10 * 60_000;
  return funciones.filter((f) => desdeISO(f.fechaHora).getTime() > limite);
}

export interface Version {
  clave: string;
  formato: Formato;
  idioma: Idioma;
  etiqueta: string;
  funciones: Funcion[];
}

/** Agrupa funciones por versión: "2D · Doblada", "3D · Subtitulada"… */
export function agruparPorVersion(funciones: Funcion[]): Version[] {
  const grupos = new Map<string, Version>();
  for (const f of funciones) {
    const clave = `${f.formato}-${f.idioma}`;
    if (!grupos.has(clave)) {
      grupos.set(clave, {
        clave,
        formato: f.formato,
        idioma: f.idioma,
        etiqueta: `${f.formato} · ${ETIQUETA_IDIOMA[f.idioma]}`,
        funciones: [],
      });
    }
    grupos.get(clave)!.funciones.push(f);
  }
  return [...grupos.values()].sort((a, b) => a.clave.localeCompare(b.clave));
}

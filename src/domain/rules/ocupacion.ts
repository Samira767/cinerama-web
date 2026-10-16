import type { Butaca } from "../types";

/** Hash simple y determinista (FNV-1a) para generar números a partir de un texto. */
export function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Generador pseudoaleatorio con semilla (mulberry32). */
export function aleatorioConSemilla(semilla: number): () => number {
  let a = semilla;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Butacas "ya vendidas" simuladas para una función, siempre las mismas para
 * el mismo id. Se concentran en el centro de la sala, como pasa en la vida real.
 * En la Fase 2 esto se reemplaza por las ventas reales del backend.
 */
export function butacasOcupadasSimuladas(
  funcionId: string,
  butacas: Butaca[],
  fechaHora: Date,
): Set<string> {
  const rnd = aleatorioConSemilla(hash(funcionId));
  const hora = fechaHora.getHours();
  const finDeSemana = [0, 5, 6].includes(fechaHora.getDay());
  // Ocupación base: más alta de noche y fin de semana
  let base = 0.12 + (hora >= 18 ? 0.18 : 0) + (finDeSemana ? 0.15 : 0);
  base += rnd() * 0.15;

  const columnas = Math.max(...butacas.map((b) => b.columna), 1);
  const ocupadas = new Set<string>();
  for (const b of butacas) {
    const centro = 1 - Math.abs(b.columna / columnas - 0.5) * 1.4;
    if (rnd() < base * (0.6 + centro * 0.8)) ocupadas.add(b.id);
  }
  return ocupadas;
}

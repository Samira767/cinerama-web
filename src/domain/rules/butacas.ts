import type { Butaca, Sala } from "../types";

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Convierte el layout textual de una sala en filas de butacas.
 * Las filas se nombran A, B, C… desde la pantalla; los números se asignan
 * de izquierda a derecha ignorando los pasillos.
 */
export function parsearLayout(layout: string[]): (Butaca | null)[][] {
  return layout.map((fila, i) => {
    const letra = LETRAS[i];
    let numero = 0;
    return fila.split("").map((c, columna) => {
      if (c === "_") return null;
      numero += 1;
      return {
        id: `${letra}${numero}`,
        fila: letra,
        numero,
        columna,
        tipo: c === "D" ? "discapacidad" : "normal",
      } satisfies Butaca;
    });
  });
}

export function listarButacas(sala: Pick<Sala, "layout">): Butaca[] {
  return parsearLayout(sala.layout)
    .flat()
    .filter((b): b is Butaca => b !== null);
}

export function capacidadSala(sala: Pick<Sala, "layout">): number {
  return sala.layout.join("").replace(/_/g, "").length;
}

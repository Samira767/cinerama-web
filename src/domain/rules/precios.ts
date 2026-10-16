import type { Formato, Tarifa, TipoDia, TipoEntrada } from "../types";

/** Lunes (1), martes (2) y miércoles (3) son días de precio rebajado. */
export const DIAS_REBAJADOS = [1, 2, 3];

export function tipoDia(fecha: Date): TipoDia {
  return DIAS_REBAJADOS.includes(fecha.getDay()) ? "rebajado" : "regular";
}

export function buscarTarifa(
  tarifas: Tarifa[],
  sedeId: string,
  tipoEntrada: TipoEntrada,
  formato: Formato,
  fecha: Date,
): Tarifa | undefined {
  const dia = tipoDia(fecha);
  return tarifas.find(
    (t) =>
      t.sedeId === sedeId &&
      t.tipoEntrada === tipoEntrada &&
      t.formato === formato &&
      t.tipoDia === dia,
  );
}

const soles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

/** 18.9 → "S/ 18.90" */
export function formatSoles(monto: number): string {
  return soles.format(monto).replace(/ /g, " ");
}

/** 128 → "2 h 8 min" */
export function formatDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}

export function cn(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(" ");
}

import { addDays, format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { FechaHoraISO, FechaISO } from "@/domain/types";

/** Fecha local (sin zona horaria) → "2026-10-16" */
export function aFechaISO(fecha: Date): FechaISO {
  return format(fecha, "yyyy-MM-dd");
}

/** Fecha local → "2026-10-16T19:30:00" */
export function aFechaHoraISO(fecha: Date): FechaHoraISO {
  return format(fecha, "yyyy-MM-dd'T'HH:mm:ss");
}

export function desdeISO(valor: string): Date {
  return parseISO(valor);
}

export function hoy(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function sumarDias(fecha: Date, dias: number): Date {
  return addDays(fecha, dias);
}

/** "Hoy", "Mañana" o "Sáb 18" */
export function etiquetaDia(fecha: Date, referencia = hoy()): string {
  if (isSameDay(fecha, referencia)) return "Hoy";
  if (isSameDay(fecha, addDays(referencia, 1))) return "Mañana";
  return capitalizar(format(fecha, "EEE d", { locale: es }).replace(".", ""));
}

/** "sábado 18 de octubre" */
export function fechaLarga(fecha: Date): string {
  return format(fecha, "EEEE d 'de' MMMM", { locale: es });
}

/** "19:30" */
export function hora(fecha: Date): string {
  return format(fecha, "HH:mm");
}

export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

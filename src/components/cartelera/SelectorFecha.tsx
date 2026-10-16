"use client";

import { tipoDia } from "@/domain/rules/precios";
import { diasDeProgramacion } from "@/lib/cartelera";
import { aFechaISO, etiquetaDia } from "@/lib/fechas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/format";

/** Fila deslizable de días; marca los días de precio rebajado. */
export function SelectorFecha({
  valor,
  alCambiar,
}: {
  valor: string;
  alCambiar: (fecha: string) => void;
}) {
  const dias = diasDeProgramacion();
  return (
    <div
      role="tablist"
      aria-label="Fecha"
      className="sin-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pt-2 pb-1 md:mx-0 md:px-0"
    >
      {dias.map((d) => {
        const iso = aFechaISO(d);
        const activo = iso === valor;
        const rebajado = tipoDia(d) === "rebajado";
        return (
          <button
            key={iso}
            type="button"
            role="tab"
            aria-selected={activo}
            onClick={() => alCambiar(iso)}
            className={cn(
              "relative flex w-[4.5rem] shrink-0 snap-start flex-col items-center rounded-2xl py-2.5 ring-1 transition",
              activo
                ? "bg-rojo-500 text-blanco-50 ring-rojo-500"
                : "bg-noche-900 text-blanco-300 ring-noche-700 hover:ring-noche-500",
            )}
          >
            <span className="text-[11px] font-medium uppercase">
              {etiquetaDia(d).split(" ")[0]}
            </span>
            <span className="font-display text-xl leading-tight font-bold">{format(d, "d")}</span>
            <span className="text-[10px] uppercase opacity-70">
              {format(d, "MMM", { locale: es }).replace(".", "")}
            </span>
            {rebajado && (
              <span
                className={cn(
                  "absolute -top-1.5 rounded-full px-1.5 text-[9px] font-bold",
                  activo ? "bg-oro-400 text-noche-950" : "bg-oro-950 text-oro-300 ring-1 ring-oro-400/40",
                )}
              >
                S/ ↓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

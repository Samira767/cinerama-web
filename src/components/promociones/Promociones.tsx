"use client";

import { Tag } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useConsulta } from "@/data/hooks";
import type { Promocion } from "@/domain/types";
import { desdeISO } from "@/lib/fechas";
import { cn } from "@/lib/format";

export function TarjetaPromocion({ promo, detallada = false }: { promo: Promocion; detallada?: boolean }) {
  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-tarjeta)] bg-noche-900 p-5 ring-1 ring-noche-700"
      style={{ backgroundImage: `radial-gradient(120% 80% at 100% 0%, ${promo.color}40, transparent 60%)` }}
    >
      <span
        className="inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white"
        style={{ backgroundColor: promo.color }}
      >
        <Tag className="size-3" aria-hidden /> {promo.etiqueta}
      </span>
      <h3 className="mt-4 text-xl leading-tight font-bold text-balance">{promo.titulo}</h3>
      <p className="mt-2 text-sm text-blanco-300">{promo.descripcion}</p>
      {detallada && (
        <div className="mt-4 space-y-2 border-t border-noche-700 pt-4 text-xs text-blanco-400">
          <p>{promo.condiciones}</p>
          <p>
            Vigente hasta el {format(desdeISO(promo.vigenciaHasta), "d 'de' MMMM 'de' yyyy", { locale: es })}
            {promo.sedes === "todas" ? " · Todas las sedes" : ` · ${promo.sedes.length} sedes participantes`}
          </p>
        </div>
      )}
    </article>
  );
}

export function ListaPromociones({ sedeId, franja = false }: { sedeId?: string; franja?: boolean }) {
  const { datos } = useConsulta((r) => r.promociones.listarVigentes(sedeId), [sedeId]);
  const items = datos ?? [];

  return (
    <div
      className={cn(
        franja
          ? "sin-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {datos
        ? items.map((p) => (
            <div key={p.id} className={cn(franja && "w-72 shrink-0 snap-start md:w-auto")}>
              <TarjetaPromocion promo={p} detallada={!franja} />
            </div>
          ))
        : Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={cn("h-48 animate-pulse rounded-[var(--radius-tarjeta)] bg-noche-900", franja && "w-72 shrink-0 md:w-auto")}
            />
          ))}
    </div>
  );
}

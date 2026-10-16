"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { useConsulta } from "@/data/hooks";
import type { Pelicula } from "@/domain/types";
import { desdeISO, hoy } from "@/lib/fechas";
import { formatDuracion } from "@/lib/format";
import { Poster } from "@/components/pelicula/Poster";
import { TarjetaPeliculaEsqueleto } from "./TarjetaPelicula";

export function cuentaRegresiva(pelicula: Pick<Pelicula, "fechaEstreno">): string {
  const dias = differenceInCalendarDays(desdeISO(pelicula.fechaEstreno), hoy());
  if (dias <= 0) return "Ya en cartelera";
  if (dias === 1) return "Estrena mañana";
  return `Estrena en ${dias} días`;
}

function TarjetaEstreno({ pelicula }: { pelicula: Pelicula }) {
  return (
    <Link href={`/pelicula/${pelicula.slug}`} className="group block space-y-3">
      <div className="relative">
        <Poster pelicula={pelicula} className="transition group-hover:-translate-y-1" />
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-oro-400 px-1.5 py-0.5 text-[10px] font-extrabold text-noche-950 uppercase">
          <CalendarClock className="size-3" aria-hidden />
          {cuentaRegresiva(pelicula).replace("Estrena ", "")}
        </span>
      </div>
      <div className="space-y-1 px-0.5">
        <h3 className="line-clamp-1 font-semibold group-hover:text-rojo-300">{pelicula.titulo}</h3>
        <p className="text-xs text-blanco-400">
          {format(desdeISO(pelicula.fechaEstreno), "d 'de' MMMM", { locale: es })} ·{" "}
          {formatDuracion(pelicula.duracionMin)}
        </p>
      </div>
    </Link>
  );
}

/** Próximos estrenos. `franja` = carrusel horizontal (inicio); si no, rejilla. */
export function ProximosEstrenos({ franja = false }: { franja?: boolean }) {
  const { datos } = useConsulta((r) => r.peliculas.listarProximosEstrenos(), []);

  const items = datos ?? [];
  if (datos && items.length === 0) {
    return <p className="text-blanco-400">Pronto anunciaremos nuevos estrenos.</p>;
  }

  if (franja) {
    return (
      <div className="sin-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0 lg:grid-cols-5">
        {(datos ? items : Array.from({ length: 4 }, () => null)).map((p, i) => (
          <div key={p?.id ?? i} className="w-40 shrink-0 snap-start md:w-auto">
            {p ? <TarjetaEstreno pelicula={p} /> : <TarjetaPeliculaEsqueleto />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {datos
        ? items.map((p) => <TarjetaEstreno key={p.id} pelicula={p} />)
        : Array.from({ length: 4 }, (_, i) => <TarjetaPeliculaEsqueleto key={i} />)}
    </div>
  );
}

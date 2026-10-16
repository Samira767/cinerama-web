import Link from "next/link";
import type { Funcion, Pelicula } from "@/domain/types";
import { ETIQUETA_IDIOMA } from "@/domain/types";
import { formatDuracion } from "@/lib/format";
import { hora, desdeISO } from "@/lib/fechas";
import { Poster } from "@/components/pelicula/Poster";

/** Tarjeta de la cartelera: afiche, datos básicos y próximos horarios. */
export function TarjetaPelicula({
  pelicula,
  funciones,
  fecha,
  esEstreno,
}: {
  pelicula: Pelicula;
  funciones: Funcion[];
  fecha: string;
  esEstreno?: boolean;
}) {
  const versiones = [...new Set(funciones.map((f) => `${f.formato} ${ETIQUETA_IDIOMA[f.idioma].slice(0, 3)}.`))];
  const proximas = funciones.slice(0, 3);

  return (
    <Link
      href={`/pelicula/${pelicula.slug}?fecha=${fecha}`}
      className="group block space-y-3 rounded-[var(--radius-tarjeta)] focus-visible:outline-offset-4"
    >
      <div className="relative">
        <Poster
          pelicula={pelicula}
          className="transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/60"
        />
        {esEstreno && (
          <span className="absolute top-2 right-2 rounded-md bg-oro-400 px-1.5 py-0.5 text-[10px] font-extrabold text-noche-950">
            ESTRENO
          </span>
        )}
      </div>
      <div className="space-y-1.5 px-0.5">
        <h3 className="line-clamp-1 font-semibold text-blanco-50 group-hover:text-rojo-300">
          {pelicula.titulo}
        </h3>
        <p className="line-clamp-1 text-xs text-blanco-400">
          {pelicula.generos.slice(0, 2).join(", ")} · {formatDuracion(pelicula.duracionMin)}
        </p>
        <p className="line-clamp-1 text-[11px] font-medium text-blanco-300">{versiones.join(" · ")}</p>
        {proximas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {proximas.map((f) => (
              <span
                key={f.id}
                className="rounded-lg bg-noche-800 px-2 py-1 text-xs font-semibold text-blanco-100 ring-1 ring-noche-600"
              >
                {hora(desdeISO(f.fechaHora))}
              </span>
            ))}
            {funciones.length > 3 && (
              <span className="px-1 py-1 text-xs text-blanco-400">+{funciones.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function TarjetaPeliculaEsqueleto() {
  return (
    <div className="space-y-3">
      <div className="aspect-[2/3] animate-pulse rounded-[var(--radius-tarjeta)] bg-noche-800" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-noche-800" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-noche-800" />
    </div>
  );
}

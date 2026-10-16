"use client";

import { useState } from "react";
import { Film, Percent } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import { buscarTarifa, tipoDia } from "@/domain/rules/precios";
import { funcionesDisponibles } from "@/lib/cartelera";
import { aFechaISO, desdeISO, fechaLarga, hoy, sumarDias } from "@/lib/fechas";
import { cn, formatSoles } from "@/lib/format";
import { SelectorFecha } from "./SelectorFecha";
import { TarjetaPelicula, TarjetaPeliculaEsqueleto } from "./TarjetaPelicula";

/** Cartelera de la sede activa para la fecha elegida, con filtro por género. */
export function Cartelera({ sedeId }: { sedeId: string }) {
  const [fecha, setFecha] = useState(() => aFechaISO(hoy()));
  const [genero, setGenero] = useState<string | null>(null);

  const { datos, cargando } = useConsulta(
    async (r) => {
      const [peliculas, funciones, tarifas] = await Promise.all([
        r.peliculas.listarEnCartelera(sedeId, fecha),
        r.funciones.listarPorSede(sedeId, fecha),
        r.tarifas.listarPorSede(sedeId),
      ]);
      return { peliculas, funciones: funcionesDisponibles(funciones), tarifas };
    },
    [sedeId, fecha],
  );

  const dia = desdeISO(fecha);
  const rebajado = tipoDia(dia) === "rebajado";
  const precioGeneral = datos && buscarTarifa(datos.tarifas, sedeId, "general", "2D", dia)?.precio;
  const haceUnaSemana = aFechaISO(sumarDias(hoy(), -7));

  const conFunciones = (datos?.peliculas ?? [])
    .map((p) => ({ pelicula: p, funciones: datos!.funciones.filter((f) => f.peliculaId === p.id) }))
    .filter((x) => x.funciones.length > 0)
    .sort((a, b) => b.pelicula.fechaEstreno.localeCompare(a.pelicula.fechaEstreno));

  const generos = [...new Set(conFunciones.flatMap((x) => x.pelicula.generos))].sort();
  const visibles = genero ? conFunciones.filter((x) => x.pelicula.generos.includes(genero)) : conFunciones;

  return (
    <section id="cartelera" className="scroll-mt-32 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Cartelera</h2>
          <p className="mt-1 text-sm text-blanco-400 first-letter:uppercase">{fechaLarga(dia)}</p>
        </div>
        <SelectorFecha valor={fecha} alCambiar={setFecha} />
      </div>

      {precioGeneral !== undefined && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ring-1",
            rebajado ? "bg-oro-950 text-oro-300 ring-oro-400/30" : "bg-noche-900 text-blanco-300 ring-noche-700",
          )}
        >
          <Percent className="size-4 shrink-0" aria-hidden />
          {rebajado ? (
            <p>
              <strong className="text-oro-400">¡Día de precio rebajado!</strong> Entrada general 2D a{" "}
              <strong>{formatSoles(precioGeneral)}</strong> en todas las funciones.
            </p>
          ) : (
            <p>
              Entrada general 2D desde <strong className="text-blanco-50">{formatSoles(precioGeneral)}</strong>.
              De lunes a miércoles, precio rebajado.
            </p>
          )}
        </div>
      )}

      {generos.length > 1 && (
        <div className="sin-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {[null, ...generos].map((g) => (
            <button
              key={g ?? "todos"}
              type="button"
              onClick={() => setGenero(g)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
                genero === g
                  ? "bg-blanco-50 text-noche-950 ring-blanco-50"
                  : "text-blanco-300 ring-noche-600 hover:text-blanco-50",
              )}
            >
              {g ?? "Todas"}
            </button>
          ))}
        </div>
      )}

      {cargando && !datos ? (
        <Rejilla>
          {Array.from({ length: 8 }, (_, i) => (
            <TarjetaPeliculaEsqueleto key={i} />
          ))}
        </Rejilla>
      ) : visibles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-noche-900 py-16 text-center ring-1 ring-noche-700">
          <Film className="size-8 text-blanco-400" aria-hidden />
          <p className="text-blanco-300">No quedan funciones para este día. Prueba con otra fecha.</p>
        </div>
      ) : (
        <Rejilla>
          {visibles.map(({ pelicula, funciones }) => (
            <TarjetaPelicula
              key={pelicula.id}
              pelicula={pelicula}
              funciones={funciones}
              fecha={fecha}
              esEstreno={pelicula.fechaEstreno >= haceUnaSemana}
            />
          ))}
        </Rejilla>
      )}
    </section>
  );
}

function Rejilla({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}

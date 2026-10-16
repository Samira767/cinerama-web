"use client";

import { Clock, Play, Ticket } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import type { Pelicula } from "@/domain/types";
import { aFechaISO, hoy } from "@/lib/fechas";
import { formatDuracion } from "@/lib/format";
import { BotonEnlace } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Poster } from "@/components/pelicula/Poster";

/** Portada: el estreno más reciente con funciones hoy en la sede. */
export function Destacado({ sedeId }: { sedeId: string }) {
  const { datos: pelicula } = useConsulta(async (r) => {
    const lista = await r.peliculas.listarEnCartelera(sedeId, aFechaISO(hoy()));
    return [...lista].sort((a, b) => b.fechaEstreno.localeCompare(a.fechaEstreno))[0] ?? null;
  }, [sedeId]);

  if (pelicula === undefined) return <DestacadoEsqueleto />;
  if (pelicula === null) return null;
  return <Portada pelicula={pelicula} />;
}

function Portada({ pelicula }: { pelicula: Pelicula }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fondo: color del afiche difuminado */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background: `radial-gradient(80% 90% at 75% 20%, ${pelicula.colorTema}, transparent 70%)`,
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-noche-950 via-noche-950/40 to-transparent" />

      <div className="contenedor grid items-center gap-8 py-10 md:grid-cols-[1fr_auto] md:py-16">
        <div className="animate-aparecer order-2 space-y-5 md:order-1">
          <div className="flex flex-wrap gap-2">
            <Etiqueta tono="solido">Estreno</Etiqueta>
            <Etiqueta>{pelicula.clasificacion}</Etiqueta>
            {pelicula.generos.map((g) => (
              <Etiqueta key={g}>{g}</Etiqueta>
            ))}
          </div>
          <h1 className="text-5xl leading-[0.95] font-extrabold text-balance sm:text-7xl">
            {pelicula.titulo}
          </h1>
          <p className="line-clamp-3 max-w-xl text-blanco-300 sm:text-lg">{pelicula.sinopsis}</p>
          <p className="flex items-center gap-2 text-sm text-blanco-400">
            <Clock className="size-4" aria-hidden /> {formatDuracion(pelicula.duracionMin)} · Dir.{" "}
            {pelicula.director}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <BotonEnlace href={`/pelicula/${pelicula.slug}#horarios`} tamano="lg">
              <Ticket className="size-5" aria-hidden /> Comprar entradas
            </BotonEnlace>
            <BotonEnlace href={`/pelicula/${pelicula.slug}#trailer`} tamano="lg" variante="secundario">
              <Play className="size-5" aria-hidden /> Ver tráiler
            </BotonEnlace>
          </div>
        </div>
        <div className="order-1 mx-auto w-44 rotate-2 sm:w-56 md:order-2 md:w-72">
          <Poster pelicula={pelicula} prioridad className="shadow-2xl shadow-black/70" />
        </div>
      </div>
    </section>
  );
}

export function DestacadoEsqueleto() {
  return (
    <div className="contenedor grid gap-8 py-10 md:grid-cols-[1fr_auto] md:py-16">
      <div className="order-2 space-y-4 md:order-1">
        <div className="h-6 w-40 animate-pulse rounded-full bg-noche-800" />
        <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-noche-800" />
        <div className="h-20 w-full max-w-xl animate-pulse rounded-2xl bg-noche-800" />
      </div>
      <div className="order-1 mx-auto aspect-[2/3] w-44 animate-pulse rounded-[var(--radius-tarjeta)] bg-noche-800 sm:w-56 md:order-2 md:w-72" />
    </div>
  );
}

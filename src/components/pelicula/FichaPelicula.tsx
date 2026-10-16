"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarClock, Clock, Clapperboard, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useConsulta } from "@/data/hooks";
import { fechaDesdeParametro } from "@/lib/cartelera";
import { desdeISO } from "@/lib/fechas";
import { formatDuracion } from "@/lib/format";
import { BotonEnlace } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { cuentaRegresiva } from "@/components/cartelera/Estrenos";
import { Horarios } from "./Horarios";
import { Poster } from "./Poster";
import { Trailer } from "./Trailer";

export function FichaPelicula({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const parametros = useSearchParams();
  const [fecha, setFecha] = useState(() => fechaDesdeParametro(parametros.get("fecha")));
  const { datos: pelicula } = useConsulta((r) => r.peliculas.obtenerPorSlug(slug), [slug]);

  // El contenido se pinta en el navegador: se hace el salto a #horarios / #trailer al cargar.
  useEffect(() => {
    if (pelicula && location.hash) {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pelicula]);

  if (pelicula === undefined) return <FichaEsqueleto />;
  if (pelicula === null) {
    return (
      <div className="contenedor flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Película no encontrada</h1>
        <BotonEnlace href="/" variante="secundario">
          Volver a la cartelera
        </BotonEnlace>
      </div>
    );
  }

  const proximamente = pelicula.estado === "proximamente";

  return (
    <article>
      {/* Cabecera con el color del afiche */}
      <header className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70"
          style={{ background: `radial-gradient(90% 100% at 20% 0%, ${pelicula.colorTema}, transparent 70%)` }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-noche-950 to-transparent" />
        <div className="contenedor grid gap-6 py-8 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-10 md:py-14">
          <Poster pelicula={pelicula} conTitulo={false} prioridad className="w-36 shadow-2xl shadow-black/60 sm:w-56" />
          <div className="animate-aparecer space-y-4">
            <div className="flex flex-wrap gap-2">
              {proximamente && <Etiqueta tono="solido">{cuentaRegresiva(pelicula)}</Etiqueta>}
              <Etiqueta>{pelicula.clasificacion}</Etiqueta>
              {pelicula.generos.map((g) => (
                <Etiqueta key={g}>{g}</Etiqueta>
              ))}
            </div>
            <h1 className="text-4xl leading-[0.95] font-extrabold text-balance sm:text-6xl">{pelicula.titulo}</h1>
            <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-blanco-300">
              <Dato icono={<Clock className="size-4" />} texto={formatDuracion(pelicula.duracionMin)} />
              <Dato
                icono={<CalendarClock className="size-4" />}
                texto={`Estreno: ${format(desdeISO(pelicula.fechaEstreno), "d MMM yyyy", { locale: es })}`}
              />
              <Dato icono={<Clapperboard className="size-4" />} texto={`Dir. ${pelicula.director}`} />
            </dl>
          </div>
        </div>
      </header>

      <div className="contenedor grid gap-12 pt-4 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <section id="horarios" className="scroll-mt-32 space-y-4">
            <h2 className="text-2xl font-extrabold">Horarios</h2>
            {proximamente ? (
              <p className="rounded-3xl bg-oro-950 p-6 text-oro-300 ring-1 ring-oro-400/30">
                Esta película estrena el{" "}
                <strong>{format(desdeISO(pelicula.fechaEstreno), "EEEE d 'de' MMMM", { locale: es })}</strong>. La
                preventa se abrirá pronto.
              </p>
            ) : (
              <Horarios pelicula={pelicula} fecha={fecha} alCambiarFecha={setFecha} />
            )}
          </section>

          <section id="trailer" className="scroll-mt-32 space-y-4">
            <h2 className="text-2xl font-extrabold">Tráiler</h2>
            <Trailer url={pelicula.trailerUrl} titulo={pelicula.titulo} />
          </section>
        </div>

        <aside className="min-w-0 space-y-8 lg:pt-14">
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Sinopsis</h2>
            <p className="leading-relaxed text-blanco-300">{pelicula.sinopsis}</p>
          </section>
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Users className="size-4 text-blanco-400" aria-hidden /> Reparto
            </h2>
            <ul className="flex flex-wrap gap-2">
              {pelicula.reparto.map((a) => (
                <li key={a} className="rounded-full bg-noche-900 px-3 py-1 text-sm text-blanco-300 ring-1 ring-noche-700">
                  {a}
                </li>
              ))}
            </ul>
          </section>
          <p className="text-xs text-blanco-400">
            Película ficticia creada para esta demostración. Tráiler: cortometraje libre de la Blender Foundation.
          </p>
        </aside>
      </div>
    </article>
  );
}

function Dato({ icono, texto }: { icono: React.ReactNode; texto: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <dt className="text-blanco-400">{icono}</dt>
      <dd>{texto}</dd>
    </div>
  );
}

export function FichaEsqueleto() {
  return (
    <div className="contenedor grid gap-6 py-8 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-10 md:py-14">
      <div className="aspect-[2/3] w-36 animate-pulse rounded-[var(--radius-tarjeta)] bg-noche-800 sm:w-56" />
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded-full bg-noche-800" />
        <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-noche-800" />
      </div>
    </div>
  );
}

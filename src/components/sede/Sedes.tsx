"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Armchair, Clock, Clapperboard, MapPin, Navigation } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import { capacidadSala } from "@/domain/rules/butacas";
import type { Sala } from "@/domain/types";
import { useSede } from "@/store/sedeStore";
import { Boton, BotonEnlace } from "@/components/ui/Boton";

function resumen(salas: Sala[]) {
  return { salas: salas.length, butacas: salas.reduce((t, s) => t + capacidadSala(s), 0) };
}

/** Listado de sedes agrupadas por región. */
export function ListaSedes() {
  const sedeActiva = useSede((s) => s.sedeId);
  const { datos } = useConsulta(
    async (r) => {
      const [sedes, salas] = await Promise.all([r.sedes.listar(), r.salas.listar()]);
      return { sedes, salas };
    },
    [],
  );

  if (!datos) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-[var(--radius-tarjeta)] bg-noche-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {datos.sedes.map((s) => {
        const r = resumen(datos.salas.filter((x) => x.sedeId === s.id));
        return (
          <Link
            key={s.id}
            href={`/sedes/${s.slug}`}
            className="group flex flex-col justify-between gap-5 rounded-[var(--radius-tarjeta)] bg-noche-900 p-5 ring-1 ring-noche-700 transition hover:ring-rojo-500"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-blanco-400 uppercase">{s.region}</span>
                {s.esPrincipal && (
                  <span className="rounded-full bg-oro-400 px-2 py-px text-[10px] font-bold text-noche-950">
                    EMBLEMÁTICA
                  </span>
                )}
                {s.id === sedeActiva && (
                  <span className="rounded-full bg-rojo-500 px-2 py-px text-[10px] font-bold text-blanco-50">
                    TU CINE
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold group-hover:text-rojo-300">{s.nombre}</h2>
              <p className="text-sm text-blanco-400">
                {s.direccion}
                {s.referencia && !s.esPrincipal && <> · {s.referencia}</>}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-blanco-300">
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clapperboard className="size-4 text-blanco-400" aria-hidden /> {r.salas} salas
                </span>
                <span className="flex items-center gap-1.5">
                  <Armchair className="size-4 text-blanco-400" aria-hidden /> {r.butacas} butacas
                </span>
              </span>
              <ArrowRight className="size-4 text-blanco-400 transition group-hover:translate-x-1 group-hover:text-rojo-300" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** Detalle de una sede con mapa (OpenStreetMap, sin API key). */
export function DetalleSede({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { sedeId, elegirSede } = useSede();
  const { datos } = useConsulta(
    async (r) => {
      const sede = await r.sedes.obtenerPorSlug(slug);
      return { sede, salas: sede ? await r.salas.listarPorSede(sede.id) : [] };
    },
    [slug],
  );

  if (!datos) return <div className="h-96 animate-pulse rounded-3xl bg-noche-900" />;
  const { sede, salas } = datos;
  if (!sede) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Sede no encontrada</h1>
        <BotonEnlace href="/sedes" variante="secundario">
          Ver todas las sedes
        </BotonEnlace>
      </div>
    );
  }
  const r = resumen(salas);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wider text-blanco-400 uppercase">{sede.region}</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">{sede.nombre}</h1>
          {sede.referencia && <p className="text-blanco-300">{sede.referencia}</p>}
        </div>

        <ul className="space-y-3 text-blanco-300">
          <Fila icono={<MapPin className="size-5 text-rojo-400" />}>{sede.direccion}</Fila>
          <Fila icono={<Clock className="size-5 text-rojo-400" />}>{sede.horarioAtencion}</Fila>
          <Fila icono={<Clapperboard className="size-5 text-rojo-400" />}>
            {r.salas} salas · {r.butacas} butacas en total
          </Fila>
        </ul>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {salas.map((s) => (
            <div key={s.id} className="rounded-2xl bg-noche-900 p-3 ring-1 ring-noche-700">
              <p className="font-semibold">{s.nombre}</p>
              <p className="text-xs text-blanco-400">{capacidadSala(s)} butacas · 2D/3D</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Boton
            tamano="lg"
            onClick={() => {
              elegirSede(sede.id);
              router.push("/#cartelera");
            }}
          >
            {sedeId === sede.id ? "Ver cartelera" : "Elegir este cine"}
          </Boton>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${sede.lat},${sede.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-noche-800 px-6 font-semibold ring-1 ring-noche-600 hover:bg-noche-700"
          >
            <Navigation className="size-5" aria-hidden /> Cómo llegar
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-tarjeta)] ring-1 ring-noche-700">
        <iframe
          title={`Mapa de ${sede.nombre}`}
          className="aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[28rem]"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${sede.lng - 0.006},${sede.lat - 0.004},${sede.lng + 0.006},${sede.lat + 0.004}&layer=mapnik&marker=${sede.lat},${sede.lng}`}
        />
      </div>
    </div>
  );
}

function Fila({ icono, children }: { icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icono}</span>
      <span>{children}</span>
    </li>
  );
}

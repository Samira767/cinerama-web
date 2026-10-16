"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import { capacidadSala } from "@/domain/rules/butacas";
import { buscarTarifa } from "@/domain/rules/precios";
import type { Pelicula } from "@/domain/types";
import { agruparPorVersion, funcionesDisponibles } from "@/lib/cartelera";
import { desdeISO, hora } from "@/lib/fechas";
import { cn, formatSoles } from "@/lib/format";
import { useSede } from "@/store/sedeStore";
import { Boton } from "@/components/ui/Boton";
import { SelectorFecha } from "@/components/cartelera/SelectorFecha";

/** Horarios de la película en la sede activa, agrupados por versión. */
export function Horarios({
  pelicula,
  fecha,
  alCambiarFecha,
}: {
  pelicula: Pelicula;
  fecha: string;
  alCambiarFecha: (f: string) => void;
}) {
  const { sedeId, abrirSelector } = useSede();

  const { datos } = useConsulta(
    async (r) => {
      if (!sedeId) return null;
      const [sede, funciones, salas, tarifas] = await Promise.all([
        r.sedes.obtener(sedeId),
        r.funciones.listarPorPelicula(pelicula.id, sedeId, fecha),
        r.salas.listarPorSede(sedeId),
        r.tarifas.listarPorSede(sedeId),
      ]);
      const vigentes = funcionesDisponibles(funciones);
      const ocupacion = await Promise.all(
        vigentes.map(async (f) => {
          const sala = salas.find((s) => s.id === f.salaId);
          const ocupadas = (await r.funciones.butacasOcupadas(f.id)).length;
          const capacidad = sala ? capacidadSala(sala) : 1;
          return [f.id, { sala: sala?.nombre ?? "", libres: capacidad - ocupadas, capacidad }] as const;
        }),
      );
      return { sede, funciones: vigentes, ocupacion: new Map(ocupacion), tarifas };
    },
    [pelicula.id, sedeId, fecha],
  );

  if (!sedeId) {
    return (
      <div className="rounded-3xl bg-noche-900 p-6 text-center ring-1 ring-noche-700">
        <p className="mb-4 text-blanco-300">Elige tu cine para ver los horarios.</p>
        <Boton onClick={abrirSelector}>Elegir cine</Boton>
      </div>
    );
  }

  const versiones = datos ? agruparPorVersion(datos.funciones) : [];

  return (
    <div className="space-y-5">
      {datos?.sede && (
        <button
          type="button"
          onClick={abrirSelector}
          className="flex items-center gap-2 text-sm text-blanco-300 hover:text-blanco-50"
        >
          <MapPin className="size-4 text-rojo-400" aria-hidden />
          <span>
            <strong className="text-blanco-50">{datos.sede.nombre}</strong> ·{" "}
            <span className="underline underline-offset-2">cambiar</span>
          </span>
        </button>
      )}

      <SelectorFecha valor={fecha} alCambiar={alCambiarFecha} />

      {!datos ? (
        <div className="h-40 animate-pulse rounded-3xl bg-noche-900" />
      ) : versiones.length === 0 ? (
        <p className="rounded-3xl bg-noche-900 p-6 text-center text-blanco-300 ring-1 ring-noche-700">
          No hay funciones disponibles para este día en esta sede.
        </p>
      ) : (
        <div className="space-y-4">
          {versiones.map((v) => {
            const precio = buscarTarifa(datos.tarifas, sedeId, "general", v.formato, desdeISO(fecha))?.precio;
            return (
              <div key={v.clave} className="rounded-3xl bg-noche-900 p-4 ring-1 ring-noche-700 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-bold">{v.etiqueta}</h3>
                  {precio !== undefined && (
                    <span className="text-xs text-blanco-400">
                      General <strong className="text-blanco-100">{formatSoles(precio)}</strong>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                  {v.funciones.map((f) => {
                    const o = datos.ocupacion.get(f.id);
                    const pocas = o && o.libres / o.capacidad < 0.25;
                    return (
                      <Link
                        key={f.id}
                        href={`/compra/${f.id}`}
                        className="group flex flex-col items-center rounded-2xl bg-noche-800 py-2.5 ring-1 ring-noche-600 transition hover:bg-rojo-500 hover:ring-rojo-500"
                      >
                        <span className="font-display text-lg font-bold">{hora(desdeISO(f.fechaHora))}</span>
                        <span
                          className={cn(
                            "text-[10px] font-medium group-hover:text-blanco-50",
                            pocas ? "text-oro-300" : "text-blanco-400",
                          )}
                        >
                          {o ? (pocas ? `¡Quedan ${o.libres}!` : o.sala) : ""}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

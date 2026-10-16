"use client";

import { Check, ChevronDown, MapPin } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import type { Sede } from "@/domain/types";
import { cn } from "@/lib/format";
import { useSede } from "@/store/sedeStore";
import { Modal } from "@/components/ui/Modal";

/** Botón de la cabecera que muestra la sede activa y abre el selector. */
export function BotonSede() {
  const { sedeId, abrirSelector } = useSede();
  const { datos: sedes } = useConsulta((r) => r.sedes.listar(), []);
  const sede = sedes?.find((s) => s.id === sedeId);

  return (
    <>
      <button
        type="button"
        onClick={abrirSelector}
        className="flex h-10 max-w-[11rem] items-center gap-1.5 rounded-full bg-noche-800 pr-3 pl-3 text-sm font-medium ring-1 ring-noche-600 transition hover:bg-noche-700 sm:max-w-none"
      >
        <MapPin className="size-4 shrink-0 text-rojo-400" aria-hidden />
        <span className="truncate">{sede ? sede.nombreCorto : "Elige tu cine"}</span>
        <ChevronDown className="size-4 shrink-0 text-blanco-400" aria-hidden />
      </button>
      <SelectorSede sedes={sedes ?? []} />
    </>
  );
}

export function BotonSedeEsqueleto() {
  return <div className="h-10 w-32 animate-pulse rounded-full bg-noche-800" />;
}

function SelectorSede({ sedes }: { sedes: Sede[] }) {
  const { sedeId, selectorAbierto, elegirSede, cerrarSelector } = useSede();
  // Primera visita: se pide elegir sede antes de mostrar la cartelera.
  const abierto = selectorAbierto || (sedeId === null && sedes.length > 0);

  const porRegion = sedes.reduce<Record<string, Sede[]>>((acc, s) => {
    (acc[s.region] ??= []).push(s);
    return acc;
  }, {});

  return (
    <Modal
      abierto={abierto}
      alCerrar={cerrarSelector}
      cerrable={sedeId !== null}
      titulo={sedeId ? "Cambiar de cine" : "¿A qué Cinerama vas?"}
    >
      {!sedeId && (
        <p className="px-5 pt-4 text-sm text-blanco-400">
          Elige tu sede para ver la cartelera y los horarios. Lo recordaremos para tu próxima visita.
        </p>
      )}
      <div className="space-y-5 p-5">
        {Object.entries(porRegion).map(([region, lista]) => (
          <section key={region}>
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-blanco-400 uppercase">
              {region}
            </h3>
            <ul className="space-y-2">
              {lista.map((s) => {
                const activa = s.id === sedeId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => elegirSede(s.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 transition",
                        activa
                          ? "bg-rojo-950 ring-rojo-500"
                          : "bg-noche-850 ring-noche-700 hover:ring-noche-500",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl",
                          activa ? "bg-rojo-500 text-blanco-50" : "bg-noche-800 text-blanco-300",
                        )}
                      >
                        {activa ? <Check className="size-5" /> : <MapPin className="size-5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 font-semibold text-blanco-50">
                          {s.nombre}
                          {s.esPrincipal && (
                            <span className="rounded-full bg-oro-400 px-2 py-px text-[10px] font-bold text-noche-950">
                              EMBLEMÁTICA
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-blanco-400">
                          {s.direccion}
                          {s.referencia && !s.esPrincipal ? ` · ${s.referencia}` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

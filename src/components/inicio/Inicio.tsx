"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import { useSede } from "@/store/sedeStore";
import { Cartelera } from "@/components/cartelera/Cartelera";
import { ProximosEstrenos } from "@/components/cartelera/Estrenos";
import { ListaPromociones } from "@/components/promociones/Promociones";
import { Destacado, DestacadoEsqueleto } from "./Destacado";

/** Página de inicio: depende de la sede elegida (guardada en el navegador). */
export function Inicio() {
  const sedeId = useSede((s) => s.sedeId);
  const { datos: sede } = useConsulta(
    async (r) => (sedeId ? r.sedes.obtener(sedeId) : null),
    [sedeId],
  );

  // Sin sede: el selector se abre solo (ver SelectorSede)
  if (!sedeId) return <DestacadoEsqueleto />;

  return (
    <>
      <Destacado sedeId={sedeId} />

      <div className="contenedor space-y-16">
        {sede && (
          <p className="relative flex items-start gap-2 text-sm text-blanco-400">
            <MapPin className="mt-0.5 size-4 shrink-0 text-rojo-400" aria-hidden />
            <span>
              Mostrando funciones de <strong className="text-blanco-100">{sede.nombre}</strong> ·{" "}
              {sede.direccion}
            </span>
          </p>
        )}

        <Cartelera sedeId={sedeId} />

        <section className="space-y-5">
          <Encabezado titulo="Próximos estrenos" href="/estrenos" />
          <ProximosEstrenos franja />
        </section>

        <section className="space-y-5">
          <Encabezado titulo="Promociones" href="/promociones" />
          <ListaPromociones sedeId={sedeId} franja />
        </section>
      </div>
    </>
  );
}

function Encabezado({ titulo, href }: { titulo: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{titulo}</h2>
      <Link
        href={href}
        className="flex shrink-0 items-center gap-1 text-sm font-semibold text-rojo-300 hover:text-rojo-400"
      >
        Ver todo <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

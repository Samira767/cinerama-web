"use client";

import { RotateCcw } from "lucide-react";
import { useConsulta } from "@/data/hooks";
import { restablecerDatosDemo } from "@/data";
import { capacidadSala } from "@/domain/rules/butacas";
import { Boton } from "@/components/ui/Boton";

/** Verificación de la etapa 0: la capa de datos mock carga y persiste. */
export function EstadoDatos() {
  const { datos } = useConsulta(
    async (r) => {
      const [sedes, salas, peliculas, funciones, tarifas, productos, promociones] = await Promise.all([
        r.sedes.listar(),
        r.salas.listar(),
        r.peliculas.listar(),
        r.funciones.listar(),
        r.tarifas.listar(),
        r.productos.listar(),
        r.promociones.listar(),
      ]);
      return {
        sedes: sedes.length,
        salas: salas.length,
        butacas: salas.reduce((t, s) => t + capacidadSala(s), 0),
        peliculas: peliculas.length,
        funciones: funciones.length,
        tarifas: tarifas.length,
        productos: productos.length,
        promociones: promociones.length,
      };
    },
    [],
  );

  if (!datos) return <EsqueletoDatos />;

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(datos).map(([clave, valor]) => (
          <div key={clave} className="rounded-2xl bg-noche-900 p-4 ring-1 ring-noche-700">
            <dt className="text-xs capitalize text-crema-400">{clave}</dt>
            <dd className="font-display text-2xl font-bold text-crema-50">
              {valor.toLocaleString("es-PE")}
            </dd>
          </div>
        ))}
      </dl>
      <Boton variante="secundario" onClick={restablecerDatosDemo}>
        <RotateCcw className="size-4" aria-hidden /> Restablecer datos de demo
      </Boton>
    </div>
  );
}

export function EsqueletoDatos() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-noche-900" />
      ))}
    </div>
  );
}

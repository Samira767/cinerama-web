import { CalendarDays, Popcorn, Ticket } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { EsqueletoDatos, EstadoDatos } from "@/components/inicio/EstadoDatos";
import { formatSoles } from "@/lib/format";

/**
 * Etapa 0: guía de estilo provisional.
 * En la etapa 1 esta página se reemplaza por la cartelera de la sede elegida.
 */

const PALETA = [
  { nombre: "Noche 950", clase: "bg-noche-950", uso: "Fondo" },
  { nombre: "Noche 900", clase: "bg-noche-900", uso: "Superficies" },
  { nombre: "Noche 700", clase: "bg-noche-700", uso: "Bordes" },
  { nombre: "Crema 100", clase: "bg-crema-100", uso: "Texto" },
  { nombre: "Mandarina 500", clase: "bg-mandarina-500", uso: "Acción principal" },
  { nombre: "Maíz 400", clase: "bg-maiz-400", uso: "Rebajado / dulcería" },
  { nombre: "Éxito", clase: "bg-exito", uso: "Confirmaciones" },
  { nombre: "Error", clase: "bg-error", uso: "Errores" },
];

export default function Inicio() {
  return (
    <div className="contenedor space-y-16 py-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-noche-900 p-6 ring-1 ring-noche-700 sm:p-10">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-72 rounded-full bg-mandarina-500/25 blur-3xl"
        />
        <Etiqueta tono="maiz">Etapa 0 · Base del proyecto</Etiqueta>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-6xl">
          Tu función, tu butaca, tu combo.{" "}
          <span className="text-mandarina-500">En un minuto.</span>
        </h1>
        <p className="mt-4 max-w-xl text-crema-300">
          Guía de estilo del prototipo. Aquí se valida la identidad visual antes de construir la
          cartelera y el flujo de compra.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Boton tamano="lg">
            <Ticket className="size-5" aria-hidden /> Comprar entradas
          </Boton>
          <Boton tamano="lg" variante="secundario">
            <CalendarDays className="size-5" aria-hidden /> Ver horarios
          </Boton>
          <Boton tamano="lg" variante="fantasma">
            Más información
          </Boton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Paleta</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PALETA.map((c) => (
            <li key={c.nombre} className="overflow-hidden rounded-2xl ring-1 ring-noche-700">
              <div className={`h-20 ${c.clase}`} />
              <div className="bg-noche-900 p-3">
                <p className="text-sm font-semibold">{c.nombre}</p>
                <p className="text-xs text-crema-400">{c.uso}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Tipografía</h2>
          <p className="font-display text-5xl font-extrabold">Bricolage Grotesque</p>
          <p className="text-crema-300">
            Titulares con carácter. El texto corrido usa Geist, legible en pantallas pequeñas:
            sinopsis, horarios y precios como {formatSoles(12)} o {formatSoles(29.9)}.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Etiquetas</h2>
          <div className="flex flex-wrap gap-2">
            <Etiqueta>2D</Etiqueta>
            <Etiqueta>Doblada</Etiqueta>
            <Etiqueta tono="mandarina">Estreno</Etiqueta>
            <Etiqueta tono="maiz">
              <Popcorn className="size-3" aria-hidden /> Precio rebajado
            </Etiqueta>
            <Etiqueta tono="exito">Pagado</Etiqueta>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Datos de la demo</h2>
        <p className="text-sm text-crema-400">
          Cargados desde los JSON semilla y guardados en el navegador (localStorage).
        </p>
        <SoloNavegador fallback={<EsqueletoDatos />}>
          <EstadoDatos />
        </SoloNavegador>
      </section>
    </div>
  );
}

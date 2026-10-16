import { Construction } from "lucide-react";
import { BotonEnlace } from "./Boton";

export function EnConstruccion({ titulo, etapa }: { titulo: string; etapa: number }) {
  return (
    <section className="contenedor flex flex-col items-center gap-4 py-24 text-center">
      <Construction className="size-10 text-oro-400" aria-hidden />
      <h1 className="text-3xl font-bold">{titulo}</h1>
      <p className="max-w-md text-blanco-400">Esta sección se construye en la etapa {etapa} del plan.</p>
      <BotonEnlace href="/" variante="secundario">
        Volver al inicio
      </BotonEnlace>
    </section>
  );
}

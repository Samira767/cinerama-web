import type { ReactNode } from "react";
import { cn } from "@/lib/format";

type Tono = "neutro" | "rojo" | "oro" | "exito" | "solido";

const tonos: Record<Tono, string> = {
  neutro: "bg-noche-800 text-blanco-300 ring-noche-600",
  rojo: "bg-rojo-950 text-rojo-300 ring-rojo-500/40",
  oro: "bg-oro-950 text-oro-300 ring-oro-400/40",
  exito: "bg-exito/10 text-exito ring-exito/30",
  solido: "bg-oro-400 text-noche-950 ring-oro-400",
};

export function Etiqueta({
  tono = "neutro",
  children,
  className,
}: {
  tono?: Tono;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset",
        tonos[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

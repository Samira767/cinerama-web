import type { ReactNode } from "react";
import { cn } from "@/lib/format";

type Tono = "neutro" | "mandarina" | "maiz" | "exito";

const tonos: Record<Tono, string> = {
  neutro: "bg-noche-800 text-crema-300 ring-noche-600",
  mandarina: "bg-mandarina-950 text-mandarina-300 ring-mandarina-500/40",
  maiz: "bg-maiz-950 text-maiz-300 ring-maiz-400/40",
  exito: "bg-exito/10 text-exito ring-exito/30",
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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tonos[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

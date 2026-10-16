import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/format";

type Variante = "primario" | "secundario" | "fantasma";
type Tamano = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const variantes: Record<Variante, string> = {
  primario: "bg-mandarina-500 text-noche-950 hover:bg-mandarina-400",
  secundario: "bg-noche-800 text-crema-50 ring-1 ring-noche-600 hover:bg-noche-700",
  fantasma: "text-crema-100 hover:bg-noche-800",
};

const tamanos: Record<Tamano, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface Props {
  variante?: Variante;
  tamano?: Tamano;
}

export function Boton({
  variante = "primario",
  tamano = "md",
  className,
  ...props
}: Props & ComponentProps<"button">) {
  return <button className={cn(base, variantes[variante], tamanos[tamano], className)} {...props} />;
}

export function BotonEnlace({
  variante = "primario",
  tamano = "md",
  className,
  ...props
}: Props & ComponentProps<typeof Link>) {
  return <Link className={cn(base, variantes[variante], tamanos[tamano], className)} {...props} />;
}

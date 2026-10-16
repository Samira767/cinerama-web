import { Clapperboard, MapPin, Sparkles, Tag } from "lucide-react";

export const ENLACES = [
  { href: "/", etiqueta: "Cartelera", icono: Clapperboard },
  { href: "/estrenos", etiqueta: "Estrenos", icono: Sparkles },
  { href: "/promociones", etiqueta: "Promociones", icono: Tag },
  { href: "/sedes", etiqueta: "Sedes", icono: MapPin },
] as const;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";
import { ENLACES } from "./enlaces";

function useActivo() {
  const ruta = usePathname();
  return (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href));
}

/** Navegación horizontal en escritorio. */
export function NavegacionEscritorio() {
  const activo = useActivo();
  return (
    <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
      {ENLACES.map(({ href, etiqueta }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activo(href) ? "bg-noche-800 text-blanco-50" : "text-blanco-300 hover:text-blanco-50",
          )}
        >
          {etiqueta}
        </Link>
      ))}
    </nav>
  );
}

/** Barra inferior tipo app en móvil: zona cómoda para el pulgar. */
export function NavegacionMovil() {
  const activo = useActivo();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-noche-700 bg-noche-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {ENLACES.map(({ href, etiqueta, icono: Icono }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition",
                activo(href) ? "text-rojo-400" : "text-blanco-400",
              )}
            >
              <Icono className="size-5" aria-hidden />
              {etiqueta}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

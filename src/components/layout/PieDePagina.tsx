import Link from "next/link";
import { PROYECTO } from "@/lib/config";
import { BotonRestablecer } from "./BotonRestablecer";
import { ENLACES } from "./enlaces";
import { Logo } from "./Logo";

export function PieDePagina() {
  return (
    <footer className="mt-20 border-t border-noche-800 bg-noche-900 pb-24 md:pb-0">
      <div className="contenedor grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-blanco-400">
            Cine para todos, en todo el Perú. 11 sedes de Lima a la selva.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-blanco-50">Explora</h2>
          <ul className="space-y-2 text-sm text-blanco-400">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="hover:text-blanco-50">
                  {e.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-blanco-50">Equipo Cinerama</h2>
          <ul className="space-y-2 text-sm text-blanco-400">
            <li>
              <Link href="/admin" className="hover:text-blanco-50">
                Panel administrativo
              </Link>
            </li>
            <li>
              <BotonRestablecer />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-noche-800">
        <div className="contenedor flex flex-col gap-2 py-6 text-xs text-blanco-400 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">
            <strong className="text-oro-300">{PROYECTO.aviso}.</strong> {PROYECTO.avisoLargo}
          </p>
          <p className="shrink-0 text-blanco-300">{PROYECTO.creditos}</p>
        </div>
      </div>
    </footer>
  );
}

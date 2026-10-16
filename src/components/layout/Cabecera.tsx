import Link from "next/link";
import { BotonSede, BotonSedeEsqueleto } from "@/components/sede/SelectorSede";
import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { BannerPrototipo } from "./BannerPrototipo";
import { Logo } from "./Logo";
import { NavegacionEscritorio } from "./Navegacion";

export function Cabecera() {
  return (
    <header className="sticky top-0 z-40 border-b border-noche-800 bg-noche-950/85 backdrop-blur">
      {/* El aviso de prototipo va dentro del header para que siempre quede visible */}
      <BannerPrototipo />
      <div className="contenedor flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Cinerama, ir al inicio" className="shrink-0">
          <Logo />
        </Link>
        <NavegacionEscritorio />
        <SoloNavegador fallback={<BotonSedeEsqueleto />}>
          <BotonSede />
        </SoloNavegador>
      </div>
    </header>
  );
}

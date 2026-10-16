import { Cabecera } from "@/components/layout/Cabecera";
import { NavegacionMovil } from "@/components/layout/Navegacion";
import { PieDePagina } from "@/components/layout/PieDePagina";

export default function LayoutCliente({ children }: LayoutProps<"/">) {
  return (
    <>
      <Cabecera />
      <main className="flex-1">{children}</main>
      <PieDePagina />
      <NavegacionMovil />
    </>
  );
}

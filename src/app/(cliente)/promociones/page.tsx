import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { ListaPromociones } from "@/components/promociones/Promociones";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata = { title: "Promociones" };

export default function PaginaPromociones() {
  return (
    <div className="contenedor space-y-8 py-10">
      <TituloPagina
        titulo="Promociones"
        bajada="Más cine por menos. Revisa las condiciones de cada promoción."
      />
      <SoloNavegador fallback={null}>
        <ListaPromociones />
      </SoloNavegador>
    </div>
  );
}

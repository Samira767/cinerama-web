import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { ListaSedes } from "@/components/sede/Sedes";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata = { title: "Nuestras sedes" };

export default function PaginaSedes() {
  return (
    <div className="contenedor space-y-8 py-10">
      <TituloPagina titulo="Nuestras sedes" bajada="11 cines en todo el Perú, de Lima a la selva." />
      <SoloNavegador fallback={null}>
        <ListaSedes />
      </SoloNavegador>
    </div>
  );
}

import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { Inicio } from "@/components/inicio/Inicio";
import { DestacadoEsqueleto } from "@/components/inicio/Destacado";

export default function PaginaInicio() {
  return (
    <SoloNavegador fallback={<DestacadoEsqueleto />}>
      <Inicio />
    </SoloNavegador>
  );
}

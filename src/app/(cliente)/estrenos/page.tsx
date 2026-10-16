import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { ProximosEstrenos } from "@/components/cartelera/Estrenos";
import { TituloPagina } from "@/components/ui/TituloPagina";

export const metadata = { title: "Próximos estrenos" };

export default function PaginaEstrenos() {
  return (
    <div className="contenedor space-y-8 py-10">
      <TituloPagina titulo="Próximos estrenos" bajada="Lo que llega muy pronto a las salas de Cinerama." />
      <SoloNavegador fallback={null}>
        <ProximosEstrenos />
      </SoloNavegador>
    </div>
  );
}

import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { DetalleSede } from "@/components/sede/Sedes";
import sedes from "@/data/seed/sedes.json";

export function generateStaticParams() {
  return sedes.map((s) => ({ slug: s.slug }));
}

export default function PaginaSede({ params }: PageProps<"/sedes/[slug]">) {
  return (
    <div className="contenedor py-10">
      <SoloNavegador fallback={<div className="h-96 animate-pulse rounded-3xl bg-noche-900" />}>
        <DetalleSede params={params} />
      </SoloNavegador>
    </div>
  );
}

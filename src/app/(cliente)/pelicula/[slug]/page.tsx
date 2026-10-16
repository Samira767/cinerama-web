import { SoloNavegador } from "@/components/ui/SoloNavegador";
import { FichaEsqueleto, FichaPelicula } from "@/components/pelicula/FichaPelicula";
import peliculas from "@/data/seed/peliculas.json";

/** Pre-genera las fichas de las películas semilla; las creadas en el admin se resuelven al vuelo. */
export function generateStaticParams() {
  return peliculas.map((p) => ({ slug: p.slug }));
}

export default function PaginaPelicula({ params }: PageProps<"/pelicula/[slug]">) {
  return (
    <SoloNavegador fallback={<FichaEsqueleto />}>
      <FichaPelicula params={params} />
    </SoloNavegador>
  );
}

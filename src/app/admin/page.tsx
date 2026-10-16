import { BannerPrototipo } from "@/components/layout/BannerPrototipo";
import { EnConstruccion } from "@/components/ui/EnConstruccion";

export const metadata = { title: "Panel administrativo" };

export default function Pagina() {
  return (
    <>
      <BannerPrototipo />
      <EnConstruccion titulo="Panel administrativo" etapa={4} />
    </>
  );
}

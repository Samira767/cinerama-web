import { EnConstruccion } from "@/components/ui/EnConstruccion";

export const metadata = { title: "Comprar entradas" };

/** Etapa 2: flujo de compra (entradas → butacas → dulcería → pago → QR). */
export default function PaginaCompra() {
  return <EnConstruccion titulo="Compra de entradas" etapa={2} />;
}

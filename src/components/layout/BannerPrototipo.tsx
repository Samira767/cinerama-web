import { FlaskConical } from "lucide-react";
import { PROYECTO } from "@/lib/config";

/** Franja fija y siempre visible que identifica el sitio como prototipo. */
export function BannerPrototipo() {
  return (
    <div
      role="note"
      className="franja-prototipo border-b border-oro-400/30 text-oro-300"
    >
      <p className="contenedor flex items-center justify-center gap-2 py-1.5 text-center text-xs font-medium">
        <FlaskConical className="size-3.5 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">{PROYECTO.aviso}</strong>
          <span className="hidden sm:inline"> · Datos y pagos simulados</span>
        </span>
      </p>
    </div>
  );
}

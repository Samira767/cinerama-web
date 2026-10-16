import { cn } from "@/lib/format";

/**
 * Logotipo propio del prototipo (no es el logo oficial).
 * El símbolo evoca la pantalla curva del formato Cinerama original
 * sobre tres butacas.
 */
export function Logo({ className, compacto = false }: { className?: string; compacto?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
        <rect width="32" height="32" rx="9" className="fill-mandarina-500" />
        <path
          d="M6.5 11.5c6.3-3.4 12.7-3.4 19 0"
          className="stroke-noche-950"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="10" cy="20.5" r="2.4" className="fill-noche-950" />
        <circle cx="16" cy="20.5" r="2.4" className="fill-noche-950" />
        <circle cx="22" cy="20.5" r="2.4" className="fill-noche-950" />
      </svg>
      {!compacto && (
        <span className="font-display text-xl font-extrabold tracking-tight text-crema-50">
          cinerama
        </span>
      )}
    </span>
  );
}

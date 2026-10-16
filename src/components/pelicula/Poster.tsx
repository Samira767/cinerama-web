import { useId, type ReactNode } from "react";
import type { Pelicula } from "@/domain/types";
import { cn } from "@/lib/format";

/**
 * Afiche de la película.
 * Las películas ficticias usan ilustraciones generadas en SVG ("generado:<motivo>").
 * Cuando haya afiches reales (Fase 2 o desde el admin) basta con poner una URL.
 */
export function Poster({
  pelicula,
  className,
  conTitulo = true,
  prioridad = false,
}: {
  pelicula: Pick<Pelicula, "titulo" | "poster" | "colorTema" | "clasificacion">;
  className?: string;
  conTitulo?: boolean;
  prioridad?: boolean;
}) {
  const esGenerado = pelicula.poster.startsWith("generado:");

  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-[var(--radius-tarjeta)] bg-noche-800 ring-1 ring-white/10",
        className,
      )}
    >
      {esGenerado ? (
        <ArteGenerado motivo={pelicula.poster.slice(9)} color={pelicula.colorTema} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pelicula.poster}
          alt=""
          loading={prioridad ? "eager" : "lazy"}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {esGenerado && conTitulo && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-12">
          <p className="font-display text-lg leading-[1.05] font-extrabold text-balance text-white uppercase drop-shadow sm:text-xl">
            {pelicula.titulo}
          </p>
        </div>
      )}
      <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white ring-1 ring-white/20 backdrop-blur">
        {pelicula.clasificacion}
      </span>
    </div>
  );
}

function ArteGenerado({ motivo, color }: { motivo: string; color: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 200 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor="#121212" />
        </linearGradient>
        <radialGradient id={`l${id}`} cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="300" fill={`url(#f${id})`} />
      <rect width="200" height="300" fill={`url(#l${id})`} />
      <g fill="none" stroke="none">{MOTIVOS[motivo] ?? MOTIVOS.planeta}</g>
      {/* grano sutil */}
      <rect width="200" height="300" fill="#000" opacity="0.08" />
    </svg>
  );
}

const B = "#ffffff";
const O = "#FFB800";
const N = "#121212";

/** Ilustraciones simples, una por película ficticia. */
const MOTIVOS: Record<string, ReactNode> = {
  faro: (
    <>
      <path d="M100 70 L20 30 L20 60 Z M100 70 L180 30 L180 60 Z" fill={O} opacity="0.25" />
      <path d="M88 80 h24 l10 130 h-44 Z" fill={B} />
      <path d="M86 110 h28 v12 h-28 Z M83 150 h34 v12 h-34 Z" fill="#c8102e" />
      <rect x="90" y="62" width="20" height="18" fill={O} />
      <path d="M86 62 L100 48 L114 62 Z" fill={N} />
      <path d="M0 215 q25 -10 50 0 t50 0 t50 0 t50 0 V300 H0 Z" fill={N} opacity="0.7" />
      <path d="M0 232 q25 -10 50 0 t50 0 t50 0 t50 0 V300 H0 Z" fill={N} />
    </>
  ),
  planeta: (
    <>
      {[[20, 30], [170, 50], [40, 120], [150, 20], [185, 140], [12, 180], [120, 90]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill={B} />
      ))}
      <circle cx="100" cy="125" r="55" fill={N} opacity="0.55" />
      <circle cx="100" cy="125" r="55" stroke={B} strokeWidth="1.5" opacity="0.6" />
      <path d="M78 80 L104 118 L92 132 L120 172" stroke={O} strokeWidth="3" fill="none" />
      <ellipse cx="100" cy="125" rx="92" ry="18" stroke={O} strokeWidth="2.5" fill="none" transform="rotate(-18 100 125)" />
    </>
  ),
  montana: (
    <>
      <circle cx="140" cy="80" r="28" fill={O} />
      <path d="M-10 230 L55 110 L95 170 L130 120 L210 230 Z" fill={N} opacity="0.55" />
      <path d="M55 110 L70 138 L60 134 L50 142 L42 134 Z" fill={B} />
      <path d="M-10 250 L40 180 L80 215 L120 170 L210 250 V300 H-10 Z" fill={N} />
      <g fill={B}>
        <path d="M86 196 h20 v-14 h4 v22 h-4 v12 h-3 v-12 h-11 v12 h-3 v-12 h-3 Z" />
      </g>
    </>
  ),
  ciudad: (
    <>
      <circle cx="150" cy="60" r="18" fill={B} opacity="0.85" />
      <g fill={N}>
        <rect x="0" y="170" width="30" height="130" />
        <rect x="28" y="140" width="26" height="160" />
        <rect x="52" y="185" width="34" height="115" />
        <rect x="84" y="120" width="22" height="180" />
        <rect x="104" y="160" width="30" height="140" />
        <rect x="132" y="135" width="26" height="165" />
        <rect x="156" y="175" width="44" height="125" />
        <path d="M170 175 V95 h4 V175 M150 98 h50 v3 h-50 Z" />
      </g>
      <g fill={O}>
        {[[34, 150], [42, 170], [90, 140], [96, 180], [110, 175], [138, 150], [146, 190], [60, 200], [8, 190]].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="4" height="5" />
        ))}
      </g>
    </>
  ),
  sol: (
    <>
      <g stroke={O} strokeWidth="4" strokeLinecap="round">
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          return (
            <line key={i} x1={100 + Math.cos(a) * 48} y1={110 + Math.sin(a) * 48} x2={100 + Math.cos(a) * 70} y2={110 + Math.sin(a) * 70} />
          );
        })}
      </g>
      <circle cx="100" cy="110" r="38" fill={O} />
      <circle cx="88" cy="104" r="4" fill={N} />
      <circle cx="112" cy="104" r="4" fill={N} />
      <path d="M86 122 q14 10 28 0" stroke={N} strokeWidth="3" />
      <path d="M0 230 h40 v-12 h20 v-12 h20 v-12 h40 v12 h20 v12 h20 v12 h40 V300 H0 Z" fill={N} />
    </>
  ),
  musica: (
    <>
      <circle cx="100" cy="120" r="70" fill={N} />
      {[60, 50, 40, 30].map((r) => (
        <circle key={r} cx="100" cy="120" r={r} stroke={B} strokeOpacity="0.15" strokeWidth="1" />
      ))}
      <circle cx="100" cy="120" r="20" fill={O} />
      <circle cx="100" cy="120" r="3" fill={N} />
      <g fill={B}>
        <path d="M150 40 v40 a8 6 0 1 1 -4 -5 V48 l22 -6 v30 a8 6 0 1 1 -4 -5 V36 Z" />
        <path d="M30 190 v28 a7 5 0 1 1 -3 -4 V190 Z" />
      </g>
    </>
  ),
  casa: (
    <>
      <circle cx="150" cy="55" r="20" fill={B} opacity="0.8" />
      <circle cx="158" cy="50" r="18" fill={N} opacity="0.35" />
      <path d="M30 230 V130 L100 80 L170 130 V230 Z" fill={N} />
      <path d="M100 80 L22 136 h10 L100 88 L168 136 h10 Z" fill={N} />
      <rect x="55" y="145" width="20" height="28" fill={O} opacity="0.2" />
      <rect x="125" y="145" width="20" height="28" fill={O} />
      <rect x="88" y="180" width="24" height="50" fill="#000" />
      <path d="M0 230 H200 V300 H0 Z" fill={N} />
    </>
  ),
  velocidad: (
    <>
      <g stroke={B} strokeLinecap="round" opacity="0.7">
        <line x1="-10" y1="90" x2="140" y2="60" strokeWidth="3" />
        <line x1="-10" y1="120" x2="170" y2="85" strokeWidth="2" />
        <line x1="30" y1="150" x2="210" y2="115" strokeWidth="4" />
      </g>
      <path d="M100 160 L-40 300 H240 Z" fill={N} />
      <path d="M100 170 L96 300 H104 Z" fill={O} />
      <path d="M45 200 q10 -22 40 -24 h30 q20 2 34 24 v14 H45 Z" fill="#c8102e" />
      <circle cx="68" cy="216" r="10" fill={N} stroke={B} strokeWidth="2" />
      <circle cx="132" cy="216" r="10" fill={N} stroke={B} strokeWidth="2" />
    </>
  ),
  familia: (
    <>
      <circle cx="100" cy="150" r="45" fill={O} />
      <path d="M0 170 H200 V300 H0 Z" fill="#0b5d8a" opacity="0.75" />
      <path d="M0 185 q25 -8 50 0 t50 0 t50 0 t50 0" stroke={B} strokeWidth="2" opacity="0.6" />
      <path d="M0 240 q40 -20 100 -6 t100 6 V300 H0 Z" fill="#e8c27a" />
      <path d="M150 240 q-6 -60 -2 -110" stroke={N} strokeWidth="5" />
      <g fill={N}>
        <path d="M148 130 q-30 -6 -44 14 q22 -8 44 -10 Z" />
        <path d="M148 130 q30 -6 44 14 q-22 -8 -44 -10 Z" />
        <path d="M148 130 q-12 -24 -34 -26 q20 10 32 28 Z" />
        <path d="M148 130 q12 -24 34 -26 q-20 10 -32 28 Z" />
      </g>
    </>
  ),
  selva: (
    <>
      <g fill={N}>
        {[[-10, 40, 30], [180, 20, -35], [20, 220, 50], [170, 200, -50], [100, -20, 0], [-20, 140, 15], [210, 120, -15]].map(([x, y, r]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx="22" ry="70" transform={`rotate(${r} ${x} ${y})`} opacity="0.85" />
        ))}
      </g>
      <g fill={O}>
        <ellipse cx="82" cy="135" rx="10" ry="6" />
        <ellipse cx="118" cy="135" rx="10" ry="6" />
      </g>
      <g fill={N}>
        <ellipse cx="82" cy="135" rx="2" ry="5" />
        <ellipse cx="118" cy="135" rx="2" ry="5" />
      </g>
    </>
  ),
  fortaleza: (
    <>
      <circle cx="100" cy="80" r="40" fill={B} opacity="0.12" />
      <g fill={N}>
        <path d="M10 240 V150 h180 V240 Z" />
        <path d="M40 150 v-30 a20 12 0 0 1 40 0 v30 Z M120 150 v-30 a20 12 0 0 1 40 0 v30 Z" />
      </g>
      <g stroke={O} strokeOpacity="0.5" strokeWidth="1.5">
        {[165, 180, 195, 210, 225].map((y) => (
          <line key={y} x1="10" y1={y} x2="190" y2={y} />
        ))}
        <path d="M20 172 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6" />
      </g>
      <path d="M0 230 q50 -15 100 0 t100 0 V300 H0 Z" fill={B} opacity="0.15" />
      <path d="M0 250 H200 V300 H0 Z" fill={N} />
    </>
  ),
};

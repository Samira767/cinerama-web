"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/format";

/**
 * Ventana modal. En móvil se muestra como hoja inferior (bottom sheet),
 * en escritorio centrada.
 */
export function Modal({
  abierto,
  alCerrar,
  titulo,
  children,
  className,
  cerrable = true,
}: {
  abierto: boolean;
  alCerrar: () => void;
  titulo: string;
  children: ReactNode;
  className?: string;
  cerrable?: boolean;
}) {
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => e.key === "Escape" && cerrable && alCerrar();
    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
    };
  }, [abierto, alCerrar, cerrable]);

  if (!abierto) return null;

  // Portal al <body>: un ancestro con backdrop-blur (la cabecera) rompería el position: fixed.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={cerrable ? alCerrar : undefined}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={cn(
          "animate-aparecer relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-noche-900 ring-1 ring-noche-700 sm:max-w-lg sm:rounded-3xl",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-noche-800 px-5 py-4">
          <h2 className="text-lg font-bold">{titulo}</h2>
          {cerrable && (
            <button
              type="button"
              onClick={alCerrar}
              className="-mr-2 rounded-full p-2 text-blanco-400 hover:bg-noche-800 hover:text-blanco-50"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

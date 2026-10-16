"use client";

import { Suspense, use, type ReactNode } from "react";
import { browser } from "react-dom";

/**
 * Renderiza su contenido solo en el navegador, mostrando `fallback` mientras tanto.
 * Se usa para todo lo que depende de localStorage (datos de la demo, sede elegida),
 * evitando errores de hidratación. En la Fase 2, con datos del servidor, la mayoría
 * de estas envolturas desaparecen.
 */
export function SoloNavegador({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <Interno>{children}</Interno>
    </Suspense>
  );
}

function Interno({ children }: { children: ReactNode }) {
  use(browser("Los datos de la demo viven en localStorage."));
  return children;
}

"use client";

import { restablecerDatosDemo } from "@/data";

/** Devuelve la demo a su estado inicial (útil antes de una presentación). */
export function BotonRestablecer() {
  return (
    <button
      type="button"
      className="hover:text-blanco-50"
      onClick={() => {
        if (confirm("¿Restablecer los datos de la demo? Se borrarán las ventas y cambios hechos.")) {
          restablecerDatosDemo();
        }
      }}
    >
      Restablecer datos de demo
    </button>
  );
}

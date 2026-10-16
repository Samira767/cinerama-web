"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ID } from "@/domain/types";

interface EstadoSede {
  /** Sede elegida por el usuario; null hasta que elija una. */
  sedeId: ID | null;
  selectorAbierto: boolean;
  elegirSede: (id: ID) => void;
  abrirSelector: () => void;
  cerrarSelector: () => void;
}

/** Sede activa del visitante. Se recuerda entre visitas (localStorage). */
export const useSede = create<EstadoSede>()(
  persist(
    (set) => ({
      sedeId: null,
      selectorAbierto: false,
      elegirSede: (id) => set({ sedeId: id, selectorAbierto: false }),
      abrirSelector: () => set({ selectorAbierto: true }),
      cerrarSelector: () => set({ selectorAbierto: false }),
    }),
    {
      name: "cinerama-sede",
      partialize: (s) => ({ sedeId: s.sedeId }),
    },
  ),
);

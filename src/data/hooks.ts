"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { repos, type Repositorios } from ".";
import { obtenerRevision, suscribir } from "./mock/db";

interface Consulta<T> {
  datos: T | undefined;
  cargando: boolean;
  error: Error | null;
}

/**
 * Ejecuta una consulta a los repositorios y la repite cuando los datos cambian.
 * En la Fase 2 puede reemplazarse por TanStack Query sin cambiar las vistas.
 *
 *   const { datos: peliculas } = useConsulta((r) => r.peliculas.listar(), [])
 */
export function useConsulta<T>(
  consulta: (r: Repositorios) => Promise<T>,
  dependencias: unknown[],
): Consulta<T> {
  const revision = useSyncExternalStore(suscribir, obtenerRevision, () => 0);
  const [estado, setEstado] = useState<Consulta<T>>({
    datos: undefined,
    cargando: true,
    error: null,
  });

  useEffect(() => {
    let vigente = true;
    consulta(repos).then(
      (datos) => vigente && setEstado({ datos, cargando: false, error: null }),
      (error: Error) => vigente && setEstado((e) => ({ ...e, cargando: false, error })),
    );
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, ...dependencias]);

  return estado;
}

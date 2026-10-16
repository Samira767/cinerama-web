/**
 * Datos semilla de la Fase 1.
 *
 * Los JSON contienen datos estáticos. Las fechas (estrenos, vigencias y funciones)
 * se calculan en relación con el día actual, para que la demo siempre tenga
 * cartelera vigente sin importar cuándo se abra.
 */
import type {
  Formato,
  Funcion,
  Idioma,
  Pelicula,
  ProductoDulceria,
  Promocion,
  Sala,
  Sede,
  Tarifa,
  Venta,
} from "@/domain/types";
import { aleatorioConSemilla, hash } from "@/domain/rules/ocupacion";
import { aFechaHoraISO, aFechaISO, sumarDias } from "@/lib/fechas";
import sedesJson from "./sedes.json";
import salasJson from "./salas.json";
import tarifasJson from "./tarifas.json";
import peliculasJson from "./peliculas.json";
import productosJson from "./productos.json";
import promocionesJson from "./promociones.json";

export interface BaseDatos {
  sedes: Sede[];
  salas: Sala[];
  peliculas: Pelicula[];
  funciones: Funcion[];
  tarifas: Tarifa[];
  productos: ProductoDulceria[];
  promociones: Promocion[];
  ventas: Venta[];
}

/** Días hacia adelante con programación disponible (incluye hoy). */
export const DIAS_PROGRAMACION = 7;

type PeliculaSemilla = (typeof peliculasJson)[number];

/** Pistas para generar la programación inicial (no forman parte del modelo). */
const pistas = new Map<string, PeliculaSemilla["programacion"]>(
  peliculasJson.map((p) => [p.id, p.programacion]),
);

export function crearSemilla(referencia: Date): BaseDatos {
  const peliculas: Pelicula[] = peliculasJson.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ estrenoEnDias, programacion, ...p }) => ({
      ...p,
      clasificacion: p.clasificacion as Pelicula["clasificacion"],
      estado: p.estado as Pelicula["estado"],
      fechaEstreno: aFechaISO(sumarDias(referencia, estrenoEnDias)),
    }),
  );

  const promociones: Promocion[] = promocionesJson.map(
    ({ vigenciaDesdeEnDias, vigenciaHastaEnDias, ...p }) => ({
      ...p,
      sedes: p.sedes as Promocion["sedes"],
      vigenciaDesde: aFechaISO(sumarDias(referencia, vigenciaDesdeEnDias)),
      vigenciaHasta: aFechaISO(sumarDias(referencia, vigenciaHastaEnDias)),
    }),
  );

  const db: BaseDatos = {
    sedes: sedesJson,
    salas: salasJson,
    tarifas: tarifasJson as Tarifa[],
    productos: productosJson as ProductoDulceria[],
    peliculas,
    promociones,
    funciones: [],
    ventas: [],
  };
  completarProgramacion(db, referencia);
  return db;
}

const HORARIOS_BASE = [
  [13, 30],
  [16, 0],
  [18, 40],
  [21, 20],
] as const;

/**
 * Genera funciones para los próximos días en las sedes que aún no tienen
 * programación ese día. No toca funciones existentes, así que respeta los
 * cambios hechos desde el panel administrativo.
 */
export function completarProgramacion(db: BaseDatos, referencia: Date): boolean {
  const enCartelera = db.peliculas.filter(
    (p) => p.estado === "en_cartelera" && (pistas.get(p.id)?.peso ?? 1) > 0,
  );
  if (enCartelera.length === 0) return false;

  const diasConFunciones = new Set(
    db.funciones.map((f) => `${f.sedeId}|${f.fechaHora.slice(0, 10)}`),
  );
  let cambios = false;

  for (let d = 0; d < DIAS_PROGRAMACION; d++) {
    const dia = sumarDias(referencia, d);
    const diaISO = aFechaISO(dia);

    for (const sede of db.sedes) {
      if (diasConFunciones.has(`${sede.id}|${diaISO}`)) continue;
      cambios = true;
      const salas = db.salas.filter((s) => s.sedeId === sede.id);
      // Misma semilla durante el mes: así cada película se mantiene en su sala día a día.
      const rnd = aleatorioConSemilla(hash(sede.id + diaISO.slice(0, 7)));
      const ordenadas = ordenarPorPeso(enCartelera, rnd);

      salas.forEach((sala, i) => {
        const principal = ordenadas[i % ordenadas.length];
        const secundaria = ordenadas[(i + salas.length) % ordenadas.length];
        HORARIOS_BASE.forEach(([h, m], j) => {
          // Desfase por sala para que los horarios no coincidan
          const inicio = new Date(dia);
          inicio.setHours(h, m + i * 15, 0, 0);
          // En salas chicas se intercala una segunda película
          const pelicula = i >= 3 && j % 2 === 1 ? secundaria : principal;
          const pista = pistas.get(pelicula.id);
          const formato: Formato = pista?.tiene3D && i === 0 && j >= 2 ? "3D" : "2D";
          const idioma: Idioma = pista?.soloDoblada || j < 3 ? "doblada" : "subtitulada";
          db.funciones.push({
            id: `fun-${sala.id}-${diaISO}-${j}`,
            peliculaId: pelicula.id,
            salaId: sala.id,
            sedeId: sede.id,
            fechaHora: aFechaHoraISO(inicio),
            formato,
            idioma,
          });
        });
      });
    }
  }
  return cambios;
}

function ordenarPorPeso(peliculas: Pelicula[], rnd: () => number): Pelicula[] {
  const puntaje = new Map(peliculas.map((p) => [p.id, (pistas.get(p.id)?.peso ?? 1) + rnd() * 2]));
  return [...peliculas].sort((a, b) => puntaje.get(b.id)! - puntaje.get(a.id)!);
}

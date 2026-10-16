import type {
  CrudRepository,
  Entrada,
  Repositorios,
  VentaRepository,
} from "../repositories";
import type { BaseDatos } from "../seed";
import type { ID, Venta } from "@/domain/types";
import { listarButacas } from "@/domain/rules/butacas";
import { butacasOcupadasSimuladas } from "@/domain/rules/ocupacion";
import { aFechaHoraISO, aFechaISO, desdeISO, hoy } from "@/lib/fechas";
import { escribir, leer, nuevoId } from "./db";

type ColeccionCrud = Exclude<keyof BaseDatos, "ventas">;
type Elemento<K extends ColeccionCrud> = BaseDatos[K][number];

/** Respuesta asíncrona con copia profunda, para imitar a una API real. */
const responder = <T>(valor: T): Promise<T> =>
  Promise.resolve(valor === undefined ? valor : structuredClone(valor));

function crud<K extends ColeccionCrud>(coleccion: K, prefijo: string): CrudRepository<Elemento<K>> {
  const lista = () => leer()[coleccion] as Elemento<K>[];
  return {
    listar: async () => responder(lista()),
    obtener: async (id) => responder(lista().find((e) => e.id === id) ?? null),
    crear: async (datos) =>
      responder(
        escribir((db) => {
          const nuevo = { ...datos, id: nuevoId(prefijo) } as Elemento<K>;
          (db[coleccion] as Elemento<K>[]).push(nuevo);
          return nuevo;
        }),
      ),
    actualizar: async (id, cambios: Partial<Entrada<Elemento<K>>>) =>
      responder(
        escribir((db) => {
          const items = db[coleccion] as Elemento<K>[];
          const i = items.findIndex((e) => e.id === id);
          if (i < 0) throw new Error(`No existe ${coleccion}/${id}`);
          items[i] = { ...items[i], ...cambios, id };
          return items[i];
        }),
      ),
    eliminar: async (id) => {
      escribir((db) => {
        (db as Record<ColeccionCrud, { id: ID }[]>)[coleccion] = (
          db[coleccion] as Elemento<K>[]
        ).filter((e) => e.id !== id);
      });
    },
  };
}

const enSede = (sedes: ID[] | "todas", sedeId?: ID) =>
  !sedeId || sedes === "todas" || sedes.includes(sedeId);

function ocupadas(funcionId: ID): string[] {
  const db = leer();
  const funcion = db.funciones.find((f) => f.id === funcionId);
  if (!funcion) return [];
  const sala = db.salas.find((s) => s.id === funcion.salaId);
  if (!sala) return [];
  const simuladas = butacasOcupadasSimuladas(funcion.id, listarButacas(sala), desdeISO(funcion.fechaHora));
  for (const v of db.ventas) {
    if (v.funcionId === funcionId) v.entradas.forEach((e) => simuladas.add(e.butaca));
  }
  return [...simuladas];
}

const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generarCodigo() {
  let c = "";
  for (let i = 0; i < 6; i++) c += CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
  return `CNR-${c}`;
}

const ventas: VentaRepository = {
  listar: async (filtro = {}) =>
    responder(
      leer().ventas.filter(
        (v) =>
          (!filtro.sedeId || v.sedeId === filtro.sedeId) &&
          (!filtro.desde || v.creadaEn.slice(0, 10) >= filtro.desde) &&
          (!filtro.hasta || v.creadaEn.slice(0, 10) <= filtro.hasta),
      ),
    ),
  obtener: async (id) => responder(leer().ventas.find((v) => v.id === id) ?? null),
  registrar: async (datos) => {
    const tomadas = new Set(ocupadas(datos.funcionId));
    const conflicto = datos.entradas.find((e) => tomadas.has(e.butaca));
    if (conflicto) throw new Error(`La butaca ${conflicto.butaca} ya fue vendida.`);
    return responder(
      escribir((db) => {
        const venta: Venta = {
          ...datos,
          id: nuevoId("ven"),
          codigo: generarCodigo(),
          creadaEn: aFechaHoraISO(new Date()),
          estado: "pagada",
        };
        db.ventas.push(venta);
        return venta;
      }),
    );
  },
};

export function crearRepositoriosMock(): Repositorios {
  const sedes = crud("sedes", "sede");
  const salas = crud("salas", "sala");
  const peliculas = crud("peliculas", "pel");
  const funciones = crud("funciones", "fun");
  const tarifas = crud("tarifas", "tar");
  const productos = crud("productos", "prod");
  const promociones = crud("promociones", "promo");

  return {
    sedes: {
      ...sedes,
      obtenerPorSlug: async (slug) => responder(leer().sedes.find((s) => s.slug === slug) ?? null),
    },
    salas: {
      ...salas,
      listarPorSede: async (sedeId) => responder(leer().salas.filter((s) => s.sedeId === sedeId)),
    },
    peliculas: {
      ...peliculas,
      obtenerPorSlug: async (slug) =>
        responder(leer().peliculas.find((p) => p.slug === slug) ?? null),
      listarEnCartelera: async (sedeId, fecha) => {
        const db = leer();
        const ids = new Set(
          db.funciones
            .filter((f) => f.sedeId === sedeId && f.fechaHora.startsWith(fecha))
            .map((f) => f.peliculaId),
        );
        return responder(db.peliculas.filter((p) => ids.has(p.id)));
      },
      listarProximosEstrenos: async () => {
        const hoyISO = aFechaISO(hoy());
        return responder(
          leer()
            .peliculas.filter((p) => p.estado === "proximamente" || p.fechaEstreno > hoyISO)
            .filter((p) => p.estado !== "archivada")
            .sort((a, b) => a.fechaEstreno.localeCompare(b.fechaEstreno)),
        );
      },
    },
    funciones: {
      ...funciones,
      listarPorSede: async (sedeId, fecha) =>
        responder(
          leer()
            .funciones.filter(
              (f) => f.sedeId === sedeId && (!fecha || f.fechaHora.startsWith(fecha)),
            )
            .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)),
        ),
      listarPorPelicula: async (peliculaId, sedeId, fecha) =>
        responder(
          leer()
            .funciones.filter(
              (f) =>
                f.peliculaId === peliculaId &&
                f.sedeId === sedeId &&
                (!fecha || f.fechaHora.startsWith(fecha)),
            )
            .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)),
        ),
      butacasOcupadas: async (funcionId) => responder(ocupadas(funcionId)),
    },
    tarifas: {
      ...tarifas,
      listarPorSede: async (sedeId) => responder(leer().tarifas.filter((t) => t.sedeId === sedeId)),
    },
    productos: {
      ...productos,
      listarPorSede: async (sedeId) =>
        responder(leer().productos.filter((p) => enSede(p.sedesDisponibles, sedeId))),
    },
    promociones: {
      ...promociones,
      listarVigentes: async (sedeId) => {
        const hoyISO = aFechaISO(hoy());
        return responder(
          leer().promociones.filter(
            (p) => p.vigenciaDesde <= hoyISO && p.vigenciaHasta >= hoyISO && enSede(p.sedes, sedeId),
          ),
        );
      },
    },
    ventas,
  };
}

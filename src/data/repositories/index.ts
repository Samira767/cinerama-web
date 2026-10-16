/**
 * Contratos de acceso a datos.
 *
 * La UI solo conoce estas interfaces. En la Fase 1 las implementa `data/mock`
 * (localStorage); en la Fase 2 se agrega `data/api` (NestJS/Laravel + PostgreSQL)
 * sin modificar componentes.
 */
import type {
  FechaISO,
  Funcion,
  ID,
  Pelicula,
  ProductoDulceria,
  Promocion,
  Sala,
  Sede,
  Tarifa,
  Venta,
} from "@/domain/types";

export type Entrada<T extends { id: ID }> = Omit<T, "id">;

export interface CrudRepository<T extends { id: ID }> {
  listar(): Promise<T[]>;
  obtener(id: ID): Promise<T | null>;
  crear(datos: Entrada<T>): Promise<T>;
  actualizar(id: ID, cambios: Partial<Entrada<T>>): Promise<T>;
  eliminar(id: ID): Promise<void>;
}

export interface SedeRepository extends CrudRepository<Sede> {
  obtenerPorSlug(slug: string): Promise<Sede | null>;
}

export interface SalaRepository extends CrudRepository<Sala> {
  listarPorSede(sedeId: ID): Promise<Sala[]>;
}

export interface PeliculaRepository extends CrudRepository<Pelicula> {
  obtenerPorSlug(slug: string): Promise<Pelicula | null>;
  /** Películas con al menos una función en la sede y fecha indicadas. */
  listarEnCartelera(sedeId: ID, fecha: FechaISO): Promise<Pelicula[]>;
  listarProximosEstrenos(): Promise<Pelicula[]>;
}

export interface FuncionRepository extends CrudRepository<Funcion> {
  listarPorSede(sedeId: ID, fecha?: FechaISO): Promise<Funcion[]>;
  listarPorPelicula(peliculaId: ID, sedeId: ID, fecha?: FechaISO): Promise<Funcion[]>;
  /** Ids de butacas no disponibles (vendidas o, en Fase 2, bloqueadas). */
  butacasOcupadas(funcionId: ID): Promise<string[]>;
}

export interface TarifaRepository extends CrudRepository<Tarifa> {
  listarPorSede(sedeId: ID): Promise<Tarifa[]>;
}

export interface ProductoRepository extends CrudRepository<ProductoDulceria> {
  listarPorSede(sedeId: ID): Promise<ProductoDulceria[]>;
}

export interface PromocionRepository extends CrudRepository<Promocion> {
  listarVigentes(sedeId?: ID): Promise<Promocion[]>;
}

export interface VentaRepository {
  listar(filtro?: { sedeId?: ID; desde?: FechaISO; hasta?: FechaISO }): Promise<Venta[]>;
  obtener(id: ID): Promise<Venta | null>;
  /**
   * Registra una venta pagada. Falla si alguna butaca ya no está disponible.
   * En la Fase 2 este paso se divide en: bloquear butacas → pagar → confirmar.
   */
  registrar(datos: Omit<Venta, "id" | "codigo" | "creadaEn" | "estado">): Promise<Venta>;
}

export interface Repositorios {
  sedes: SedeRepository;
  salas: SalaRepository;
  peliculas: PeliculaRepository;
  funciones: FuncionRepository;
  tarifas: TarifaRepository;
  productos: ProductoRepository;
  promociones: PromocionRepository;
  ventas: VentaRepository;
}

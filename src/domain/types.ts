/**
 * Modelo de dominio de Cinerama.
 *
 * Estos tipos son la "fuente de verdad" compartida entre la UI y la capa de datos.
 * En la Fase 2 se corresponden 1:1 con las tablas de PostgreSQL / DTOs del backend.
 */

export type ID = string;

/** Fecha en formato ISO corto: "2026-10-16" */
export type FechaISO = string;
/** Fecha y hora ISO completa: "2026-10-16T19:30:00" (hora local de Perú) */
export type FechaHoraISO = string;

export interface Sede {
  id: ID;
  slug: string;
  nombre: string; // "Cinerama Huacho"
  nombreCorto: string; // "Huacho"
  ciudad: string;
  region: string;
  direccion: string;
  referencia?: string; // "C.C. Plaza del Sol, 2.º nivel"
  lat: number;
  lng: number;
  telefono?: string;
  horarioAtencion: string;
  esPrincipal?: boolean;
}

export interface Sala {
  id: ID;
  sedeId: ID;
  nombre: string; // "Sala 3"
  /**
   * Distribución de butacas, una cadena por fila (de la pantalla hacia atrás).
   *  A = butaca normal · D = espacio para silla de ruedas · _ = pasillo / vacío
   * Ej.: ["AAAA_AAAAAA_AAAA", "DD__________DD"]
   */
  layout: string[];
}

export type TipoButaca = "normal" | "discapacidad";

/** Derivada del layout de la sala (no se persiste en la Fase 1). */
export interface Butaca {
  id: string; // "F7"
  fila: string; // "F"
  numero: number; // 7
  tipo: TipoButaca;
  columna: number; // posición visual dentro de la fila (incluye pasillos)
}

export type Clasificacion = "APT" | "+14" | "+18";
export type EstadoPelicula = "en_cartelera" | "proximamente" | "archivada";
export type Formato = "2D" | "3D";
export type Idioma = "doblada" | "subtitulada";

export interface Pelicula {
  id: ID;
  slug: string;
  titulo: string;
  tituloOriginal?: string;
  sinopsis: string;
  generos: string[];
  duracionMin: number;
  clasificacion: Clasificacion;
  director: string;
  reparto: string[];
  /** Ruta al afiche (vertical 2:3) */
  poster: string;
  /** Imagen horizontal para cabeceras (16:9). Si falta se usa el afiche. */
  fondo?: string;
  trailerUrl: string;
  fechaEstreno: FechaISO;
  estado: EstadoPelicula;
  /** Color dominante del afiche, usado para fondos y acentos en la ficha. */
  colorTema: string;
}

export interface Funcion {
  id: ID;
  peliculaId: ID;
  salaId: ID;
  sedeId: ID;
  fechaHora: FechaHoraISO;
  formato: Formato;
  idioma: Idioma;
}

export type TipoEntrada = "general" | "nino" | "adulto_mayor";
export type TipoDia = "regular" | "rebajado";

export interface Tarifa {
  id: ID;
  sedeId: ID;
  tipoEntrada: TipoEntrada;
  tipoDia: TipoDia;
  formato: Formato;
  precio: number; // soles
}

export type CategoriaProducto = "combo" | "canchita" | "bebida" | "snack";

export interface ProductoDulceria {
  id: ID;
  nombre: string;
  descripcion: string;
  categoria: CategoriaProducto;
  precio: number;
  imagen: string; // emoji o ruta; en Fase 1 usamos ilustraciones simples
  destacado?: boolean;
  sedesDisponibles: ID[] | "todas";
}

export interface Promocion {
  id: ID;
  titulo: string;
  descripcion: string;
  condiciones: string;
  etiqueta: string; // "Lun a Mié", "Combo", "Socios"
  color: string;
  vigenciaDesde: FechaISO;
  vigenciaHasta: FechaISO;
  sedes: ID[] | "todas";
}

export type MetodoPago = "tarjeta" | "yape" | "plin";
export type EstadoVenta = "pagada"; // Fase 2: "pendiente" | "anulada" | "usada"

export interface EntradaVendida {
  tipo: TipoEntrada;
  butaca: string; // "F7"
  precio: number;
}

export interface ProductoVendido {
  productoId: ID;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Venta {
  id: ID;
  codigo: string; // "CNR-8K2F9Q" — es el contenido del QR
  funcionId: ID;
  sedeId: ID;
  creadaEn: FechaHoraISO;
  entradas: EntradaVendida[];
  productos: ProductoVendido[];
  total: number;
  metodoPago: MetodoPago;
  estado: EstadoVenta;
  cliente: { nombre: string; email: string; dni?: string };
}

/** Etiquetas legibles para la UI */
export const ETIQUETA_TIPO_ENTRADA: Record<TipoEntrada, string> = {
  general: "General",
  nino: "Niño (2 a 11 años)",
  adulto_mayor: "Adulto mayor (+60)",
};

export const ETIQUETA_IDIOMA: Record<Idioma, string> = {
  doblada: "Doblada",
  subtitulada: "Subtitulada",
};

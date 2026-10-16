# Cinerama · Prototipo web

> **Prototipo conceptual – no oficial.** Propuesta de diseño independiente, sin relación
> oficial con Cinerama. Películas, precios y funciones son simulados; ningún pago es real.
>
> Desarrollado por **Samira Sotelo Samanamu** y **Francis Vergara Solis**.

Prototipo funcional de una web moderna para Cinerama: cartelera por sede, compra de entradas
con elección de butacas, dulcería, pago simulado y entrada con QR, más un panel administrativo.

## Requisitos

- Node.js 20 o superior (probado con Node 22)
- npm

## Cómo ejecutar

```bash
npm install      # solo la primera vez
npm run dev      # modo desarrollo → http://localhost:3000
```

Para probar la versión optimizada (como quedaría publicada):

```bash
npm run build
npm start
```

Para verlo desde el celular en la misma red Wi-Fi: `npm run dev -- -H 0.0.0.0` y abre
`http://<IP-de-tu-PC>:3000`.

## Stack

| Pieza | Uso |
|---|---|
| Next.js 16 (App Router) + TypeScript | Framework y rutas |
| Tailwind CSS 4 | Estilos, tokens de diseño en `src/app/globals.css` |
| Zustand | Estado del cliente (sede elegida, compra en curso) |
| Zod + React Hook Form | Validación de formularios (reutilizable en el backend) |
| qrcode.react | QR de la entrada |
| date-fns | Fechas en español |

## Estructura

```
src/
├── app/                 # Rutas (cliente en (cliente)/, panel en admin/)
├── components/          # UI reutilizable, layout y componentes por sección
├── domain/
│   ├── types.ts         # Modelo de datos (Sede, Sala, Película, Función, Venta…)
│   └── rules/           # Lógica pura: precios, butacas, ocupación
├── data/
│   ├── repositories/    # Interfaces de acceso a datos (contrato con la UI)
│   ├── mock/            # Implementación Fase 1: localStorage
│   ├── seed/            # Datos semilla (JSON) y generador de funciones
│   ├── hooks.ts         # useConsulta(): consultas reactivas desde componentes
│   └── index.ts         # Elige la implementación activa
└── lib/                 # Formato de soles, fechas, configuración
```

### Datos de la demo

- Los datos se cargan desde `src/data/seed/*.json` la primera vez y se guardan en el
  `localStorage` del navegador. Lo que se edite en el panel se refleja en la web del cliente.
- Las funciones se generan para los próximos 7 días a partir de la fecha actual, así la
  demo siempre tiene cartelera vigente. Si se abre días después, se completan los días faltantes.
- **Restablecer datos de demo** devuelve todo al estado inicial (útil antes de una presentación).
- Las direcciones de las sedes son referenciales y deben confirmarse con la empresa.

## Hacia la Fase 2

La UI solo depende de las interfaces de `src/data/repositories`. Para conectar un backend real:

1. Crear `src/data/api/repositorios.ts` que implemente `Repositorios` llamando a la API
   (NestJS o Laravel + PostgreSQL).
2. Cambiar la línea de `src/data/index.ts` para usar esa implementación.
3. Los tipos de `src/domain/types.ts` sirven como base de las tablas y DTOs; las reglas de
   `src/domain/rules` pueden moverse tal cual al backend.

Pendiente para la Fase 2: autenticación real, bloqueo temporal de butacas durante el pago,
pasarela (Culqi / Niubiz / Mercado Pago) y validación del QR en puerta.

## Plan de etapas

- [x] **0. Base:** identidad visual, layout, aviso de prototipo, modelo de datos, capa de datos mock
- [x] **1. Cartelera:** selector de sede, cartelera por fecha, próximos estrenos, ficha de película
- [ ] **2. Compra:** entradas → butacas → dulcería → resumen → pago simulado → entrada con QR
- [x] **3. Sedes y promociones** (adelantada para tener la simulación completa)
- [ ] **4. Panel administrativo:** login simulado y CRUD
- [ ] **5. Reportes, pulido y publicación**

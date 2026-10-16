"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Tráiler con carga diferida: muestra la miniatura y solo inserta el reproductor
 * de YouTube al hacer clic (la página carga más rápido, clave en datos móviles).
 */
export function Trailer({ url, titulo }: { url: string; titulo: string }) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const idVideo = url.split("/embed/")[1]?.split("?")[0];

  return (
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-tarjeta)] bg-black ring-1 ring-noche-700">
      {reproduciendo ? (
        <iframe
          src={`${url}?autoplay=1&rel=0`}
          title={`Tráiler de ${titulo}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setReproduciendo(true)}
          className="group absolute inset-0 grid place-items-center"
          aria-label={`Reproducir tráiler de ${titulo}`}
        >
          {idVideo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://i.ytimg.com/vi/${idVideo}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-70 transition group-hover:opacity-90"
            />
          )}
          <span className="relative grid size-16 place-items-center rounded-full bg-rojo-500 text-blanco-50 shadow-xl shadow-black/50 transition group-hover:scale-110 sm:size-20">
            <Play className="ml-1 size-7 fill-current sm:size-8" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

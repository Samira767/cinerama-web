export function TituloPagina({ titulo, bajada }: { titulo: string; bajada?: string }) {
  return (
    <header className="space-y-2">
      <h1 className="text-4xl font-extrabold sm:text-5xl">{titulo}</h1>
      {bajada && <p className="max-w-2xl text-blanco-400">{bajada}</p>}
    </header>
  );
}

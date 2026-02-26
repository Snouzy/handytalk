export function LoadingSpinner() {
  return (
    <div className="text-center py-6">
      <div className="spinner" />
      <p className="text-sm text-retro-brown-mid mt-3 font-bold uppercase tracking-wide">⏳ Génération en cours...</p>
    </div>
  );
}

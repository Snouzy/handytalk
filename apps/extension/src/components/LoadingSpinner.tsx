export function LoadingSpinner() {
  return (
    <div className="text-center py-6">
      <div className="spinner" />
      <p className="text-sm text-ig-muted mt-3">⏳ Génération en cours...</p>
    </div>
  );
}

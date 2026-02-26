export function LoadingSpinner() {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="spinner" />
      <p className="text-sm text-org-earth-muted mt-3">⏳ Génération en cours...</p>
    </div>
  );
}

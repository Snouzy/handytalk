import { useApiKey } from "./hooks/useApiKey";
import { SetupScreen } from "./components/SetupScreen";
import { MainScreen } from "./components/MainScreen";
import "./styles/index.css";

export function App() {
  const { apiKey, loading, save, remove } = useApiKey();

  if (loading) return null;

  return (
    <div className="p-8 bg-org-sand min-h-screen">
      <h1 className="font-serif text-xl font-semibold text-center mb-6 text-org-earth">💬 Instagram Comment AI</h1>
      {apiKey ? (
        <MainScreen apiKey={apiKey} onSettings={remove} />
      ) : (
        <SetupScreen onSave={save} />
      )}
    </div>
  );
}

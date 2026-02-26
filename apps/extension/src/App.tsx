import { useApiKey } from "./hooks/useApiKey";
import { SetupScreen } from "./components/SetupScreen";
import { MainScreen } from "./components/MainScreen";
import "./styles/index.css";

export function App() {
  const { apiKey, loading, save, remove } = useApiKey();

  if (loading) return null;

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-center mb-5 text-ig-text">💬 Instagram Comment AI</h1>
      {apiKey ? (
        <MainScreen apiKey={apiKey} onSettings={remove} />
      ) : (
        <SetupScreen onSave={save} />
      )}
    </div>
  );
}

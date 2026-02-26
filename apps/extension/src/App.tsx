import { useApiKey } from "./hooks/useApiKey";
import { SetupScreen } from "./components/SetupScreen";
import { MainScreen } from "./components/MainScreen";
import "./styles/index.css";

export function App() {
  const { apiKey, loading, save, remove } = useApiKey();

  if (loading) return null;

  return (
    <div className="p-6 bg-retro-cream">
      <h1 className="retro-title text-xl text-center mb-5">💬 Instagram Comment AI</h1>
      {apiKey ? (
        <MainScreen apiKey={apiKey} onSettings={remove} />
      ) : (
        <SetupScreen onSave={save} />
      )}
    </div>
  );
}

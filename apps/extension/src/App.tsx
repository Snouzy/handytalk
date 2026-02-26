import { useApiKey } from "./hooks/useApiKey";
import { SetupScreen } from "./components/SetupScreen";
import { MainScreen } from "./components/MainScreen";
import "./styles/index.css";

export function App() {
  const { apiKey, loading, save, remove } = useApiKey();

  if (loading) return null;

  return (
    <div className="container">
      <h1>💬 Instagram Comment AI</h1>
      {apiKey ? (
        <MainScreen apiKey={apiKey} onSettings={remove} />
      ) : (
        <SetupScreen onSave={save} />
      )}
    </div>
  );
}

import { useState } from "react";

interface Props {
  onSave: (key: string) => Promise<void>;
}

export function SetupScreen({ onSave }: Props) {
  const [value, setValue] = useState("");

  const handleSave = async () => {
    const key = value.trim();
    if (!key) return;
    await onSave(key);
  };

  return (
    <div>
      <p className="setup-text">🔑 Entrez votre clé API Anthropic pour commencer :</p>
      <input
        type="password"
        className="api-key-input"
        placeholder="sk-ant-..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />
      <button className="btn-primary" onClick={handleSave}>
        ✅ Sauvegarder
      </button>
    </div>
  );
}

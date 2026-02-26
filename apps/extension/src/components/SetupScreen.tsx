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
    <div className="animate-fade-in">
      <p className="text-sm text-retro-brown-mid mb-3 font-semibold">🔑 Entrez votre clé API Anthropic pour commencer :</p>
      <input
        type="password"
        className="retro-input w-full px-3 py-2.5 text-sm text-retro-brown mb-3"
        placeholder="sk-ant-..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />
      <button
        className="retro-btn w-full py-2.5 px-4 bg-retro-mustard text-retro-brown"
        onClick={handleSave}
      >
        ✅ Sauvegarder
      </button>
    </div>
  );
}

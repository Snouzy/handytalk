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
      <p className="text-sm text-ig-muted mb-3">🔑 Entrez votre clé API Anthropic pour commencer :</p>
      <input
        type="password"
        className="w-full px-3 py-2.5 border border-ig-border rounded-lg text-sm outline-none mb-3 transition-colors duration-200 focus:border-ig-blue"
        placeholder="sk-ant-..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />
      <button
        className="w-full py-2.5 px-4 bg-ig-blue text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-ig-blue-hover active:bg-ig-blue-active"
        onClick={handleSave}
      >
        ✅ Sauvegarder
      </button>
    </div>
  );
}

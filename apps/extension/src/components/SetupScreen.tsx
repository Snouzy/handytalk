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
      <p className="text-sm text-org-earth-muted mb-3">🔑 Entrez votre clé API Anthropic pour commencer :</p>
      <input
        type="password"
        className="w-full px-4 py-3 border border-org-sand-dark rounded-2xl text-sm outline-none mb-3 transition-all duration-300 ease-out bg-white text-org-earth focus:border-org-sage focus:ring-2 focus:ring-org-sage-light"
        placeholder="sk-ant-..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />
      <button
        className="w-full py-3 px-4 bg-org-sage text-white border-none rounded-2xl text-sm font-semibold cursor-pointer transition-all duration-300 ease-out hover:bg-org-sage-deep hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleSave}
      >
        ✅ Sauvegarder
      </button>
    </div>
  );
}

interface Props {
  prompt: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function PromptEditor({ prompt, onChange, onSend }: Props) {
  return (
    <div className="mt-4 animate-slide-up">
      <label className="block text-[13px] font-bold text-retro-brown-mid mb-1.5 uppercase tracking-wide">📝 Prompt</label>
      <textarea
        className="retro-input w-full p-3 text-[13px] font-[inherit] text-retro-brown resize-y leading-relaxed mb-3"
        rows={8}
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="retro-btn w-full py-2.5 px-4 bg-retro-red text-white"
        onClick={onSend}
      >
        🚀 Envoyer
      </button>
    </div>
  );
}

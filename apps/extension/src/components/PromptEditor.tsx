interface Props {
  prompt: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function PromptEditor({ prompt, onChange, onSend }: Props) {
  return (
    <div className="mt-4">
      <label className="block text-[13px] font-semibold text-ig-muted mb-1.5">📝 Prompt</label>
      <textarea
        className="w-full p-3 border border-ig-border rounded-lg text-[13px] font-[inherit] text-ig-text resize-y outline-none leading-relaxed mb-3 focus:border-ig-blue"
        rows={8}
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="w-full py-2.5 px-4 bg-ig-blue text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-ig-blue-hover active:bg-ig-blue-active"
        onClick={onSend}
      >
        🚀 Envoyer
      </button>
    </div>
  );
}

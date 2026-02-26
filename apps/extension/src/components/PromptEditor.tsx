interface Props {
  prompt: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function PromptEditor({ prompt, onChange, onSend }: Props) {
  return (
    <div className="mt-4 animate-slide-up">
      <label className="block text-[13px] font-semibold text-org-earth-muted mb-2">📝 Prompt</label>
      <textarea
        className="w-full p-3.5 border border-org-sand-dark rounded-2xl text-[13px] font-[inherit] text-org-earth resize-y outline-none leading-relaxed mb-3 bg-white transition-all duration-300 ease-out focus:border-org-sage focus:ring-2 focus:ring-org-sage-light"
        rows={8}
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="w-full py-3 px-4 bg-org-sage text-white border-none rounded-2xl text-sm font-semibold cursor-pointer transition-all duration-400 ease-out hover:bg-org-sage-deep hover:scale-[1.02] active:scale-[0.98]"
        onClick={onSend}
      >
        🚀 Envoyer
      </button>
    </div>
  );
}

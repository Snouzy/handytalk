interface Props {
  prompt: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function PromptEditor({ prompt, onChange, onSend }: Props) {
  return (
    <div className="prompt-editor">
      <label className="label">📝 Prompt</label>
      <textarea
        className="prompt-input"
        rows={8}
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="btn-primary" onClick={onSend}>
        🚀 Envoyer
      </button>
    </div>
  );
}

interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="mt-4 p-4 bg-org-rose-bg rounded-2xl animate-slide-up">
      <p className="text-[13px] text-org-rose">{message}</p>
    </div>
  );
}

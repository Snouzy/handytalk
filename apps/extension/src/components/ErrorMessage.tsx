interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="mt-4 p-3 bg-ig-error-bg rounded-lg">
      <p className="text-[13px] text-ig-error">{message}</p>
    </div>
  );
}

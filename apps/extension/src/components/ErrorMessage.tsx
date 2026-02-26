interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="mt-4 p-3 bg-retro-red-bg border-2 border-retro-red rounded-xl animate-slide-up">
      <p className="text-[13px] text-retro-red font-semibold">{message}</p>
    </div>
  );
}

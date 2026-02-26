interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="error-container">
      <p className="error-message">{message}</p>
    </div>
  );
}

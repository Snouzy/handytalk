interface Props {
  username: string;
  daysAgo: number;
}

export function SpamWarning({ username, daysAgo }: Props) {
  return (
    <div className="spam-warning">
      ⚠️ Tu as commenté sur @{username} il y a {daysAgo} jour{daysAgo !== 1 ? "s" : ""}. Commenter trop souvent peut sembler spam.
    </div>
  );
}

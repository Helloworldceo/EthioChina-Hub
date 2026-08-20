function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  photoUrl,
  size = 40,
}: {
  name: string;
  photoUrl?: string | null;
  size?: number;
}) {
  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        style={style}
        className="rounded-full object-cover border border-stone-200 shrink-0"
      />
    );
  }

  return (
    <div
      style={style}
      className="rounded-full bg-gradient-to-br from-brand to-brand-dark text-white font-semibold flex items-center justify-center shrink-0"
    >
      {initials(name) || "?"}
    </div>
  );
}

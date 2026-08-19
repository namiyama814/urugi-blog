export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="読み込み中"
      className="animate-spin rounded-full border-2 border-foreground/15 border-t-foreground"
      style={{ width: size, height: size }}
    />
  );
}

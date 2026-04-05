export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text font-bold tracking-tight text-transparent ${className}`}
    >
      DubzyGames
    </span>
  );
}

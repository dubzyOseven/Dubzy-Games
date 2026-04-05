import { GameForm } from "@/components/GameForm";

export default function NewGamePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">New game</h1>
      <p className="mt-2 text-sm text-slate-400">
        Use HTTPS links only. Published games need at least one platform URL.
      </p>
      <div className="mt-8">
        <GameForm />
      </div>
    </div>
  );
}
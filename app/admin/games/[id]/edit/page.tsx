import { notFound } from "next/navigation";
import { GameForm } from "@/components/GameForm";
import { getGameByIdForAdmin } from "@/lib/data/games";

type Props = { params: Promise<{ id: string }> };

export default async function EditGamePage({ params }: Props) {
  const { id } = await params;
  const game = await getGameByIdForAdmin(id);
  if (!game) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Edit: {game.title}</h1>
      <p className="mt-2 text-sm text-slate-500">ID {game.id}</p>
      <div className="mt-8">
        <GameForm game={game} />
      </div>
    </div>
  );
}
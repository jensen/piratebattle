import { Link, useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getGameState } from "~/services/game.server";

export const loader: LoaderFunction = async ({ request }) => {
  const game = await getGameState(request);

  return json({ context: game.context });
};

export default function EndGame() {
  const { context } = useLoaderData();

  const turns = context.status.filter((value) => value !== null).length;

  return (
    <div className="game-end__container">
      <div className="game-end__message overlay">
        You sank all of the ships in {turns} turns.
      </div>
      <div className="game-end__restart overlay">
        <Link to="/">Restart?</Link>
      </div>
    </div>
  );
}

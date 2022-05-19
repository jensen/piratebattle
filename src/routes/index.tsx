import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { setGameState } from "~/services/game.server";
import gameEngine from "~/statecharts/game";

export const loader: LoaderFunction = async () => {
  const { value, context, _event } = await gameEngine();

  const cookie = await setGameState({ value, context, _event });

  return redirect(`/game/${value}`, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

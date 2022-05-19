import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { getGameState, setGameState } from "~/services/game.server";
import gameEngine from "~/statecharts/game";

import styles from "~/styles/game.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const event = Object.fromEntries(body);

  const state = await getGameState(request);

  const { value, context, _event } = await gameEngine(state, event);

  const cookie = await setGameState({ value, context, _event });

  return redirect(`/game/${value}`, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const state = await getGameState(request);

  if (state) {
    const { value, context } = await gameEngine(state);

    return json({
      value,
      context,
    });
  }

  return redirect("/");
};

export default function Index() {
  return <Outlet />;
}

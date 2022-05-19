import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import gameEngine from "~/statecharts/game";
import { getGameState, setGameState } from "~/services/game.server";
import characters from "../../../data/characters.json";

export const loader: LoaderFunction = async ({ request }) => {
  const game = await getGameState(request);

  if (game.value !== "start") {
    const { value, context, _event } = await gameEngine();

    const cookie = await setGameState({ value, context, _event });

    return redirect(`/game/${value}`, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  return json({ characters });
};

const CharacterSelect = (props) => {
  return (
    <Form method="post" action="../">
      <input type="hidden" name="type" value="START" />
      <ul className="character-select__list">
        {props.characters.map((character) => (
          <li key={character.id}>
            <button type="submit" name="character" value={character.id}>
              <img
                src={`/images/characters/${character.image}`}
                alt="Pirate Character"
                className="character-select__pirate"
              />
            </button>
          </li>
        ))}
      </ul>
    </Form>
  );
};

export default function StartGame() {
  const { characters } = useLoaderData();

  return (
    <div className="character-select__container overlay">
      <h2 className="character-select__header">Choose a Pirate</h2>
      <CharacterSelect characters={characters} />
    </div>
  );
}

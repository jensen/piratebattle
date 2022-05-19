import { Form, useMatches } from "@remix-run/react";
import classnames from "classnames";

const GameBoard = ({ game }) => {
  return (
    <div className="game-board__grid">
      {game.context.status.map((value, index) => {
        return (
          <button
            className={classnames("game-board__cell", {
              "game-board__cell--empty": value === null,
              "game-board__cell--hit": value === "X",
              "game-board__cell--miss": value === "O",
              "game-board__cell--sunk": value === "!",
            })}
            key={index}
            type="submit"
            name="index"
            value={index}
          ></button>
        );
      })}
    </div>
  );
};

export default function Battle() {
  const match = useMatches().find((match) => match.id === "routes/game");

  if (!match) {
    throw new Response("Cannot find game state", { status: 500 });
  }

  const game = match.data;

  return (
    <div className="game-board overlay">
      <div className="character__container">
        <img
          src={`/images/characters/${game.context.character.image}`}
          alt="Pirate"
          className="character__pirate"
        />
      </div>
      <Form method="post" action="../">
        <GameBoard game={game} />
        <input type="hidden" name="type" value="CHOOSE" />
      </Form>
      <div className="character__container">
        <img
          src={`/images/characters/${game.context.enemy.image}`}
          alt="Pirate"
          className="character__enemy"
        />
      </div>
    </div>
  );
}

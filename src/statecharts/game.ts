import { assign, createMachine, interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";

import characters from "../../data/characters.json";
import backgrounds from "../../data/backgrounds.json";

export const GAME_BOARD_SIZE = 8;
export const SHIPS = {
  DESTROYER: 2,
  CRUISER: 3,
  BATTLESHIP: 4,
};

export const DIRECTION = {
  HORIZONTAL: Symbol("Horizontal Direction"),
  VERTICAL: Symbol("Vertical Direction"),
};

type Placement = "D" | "C" | "B" | null;
type Status = "X" | "O" | "!" | null;

interface ICharacter {
  id: string;
  image: string;
}

interface IGameEngineContext {
  character: ICharacter | null;
  enemy: ICharacter | null;
  background: string | null;
  placement: Placement[];
  status: Status[];
}

export const findPlacement =
  (state: Placement[]) => (direction: Symbol, size: number) => {
    while (true) {
      const long = Math.floor(Math.random() * GAME_BOARD_SIZE);
      const short = Math.floor(Math.random() * (GAME_BOARD_SIZE - size - 1));

      const cells = [];

      for (let i = short; i < short + size; i++) {
        cells.push(
          direction === DIRECTION.HORIZONTAL
            ? GAME_BOARD_SIZE * long + i
            : GAME_BOARD_SIZE * i + long
        );
      }

      if (cells.every((value) => state[value] === null)) {
        return cells;
      }
    }
  };

const randomizePlacement = (): Placement[] => {
  const placement = new Array(GAME_BOARD_SIZE * GAME_BOARD_SIZE).fill(null);

  for (const [ship, size] of Object.entries(SHIPS)) {
    const direction = Math.round(Math.random())
      ? DIRECTION.VERTICAL
      : DIRECTION.HORIZONTAL;

    for (const index of findPlacement(placement)(direction, size)) {
      placement[index] = ship.slice(0, 1);
    }
  }

  return placement;
};

const machine = createMachine<IGameEngineContext>(
  {
    id: "root",
    context: {
      character: null,
      enemy: null,
      background: null,
      placement: [],
      status: [],
    },
    initial: "start",
    states: {
      start: {
        tags: "route",
        on: {
          START: { target: "battle", actions: "setup" },
        },
      },
      battle: {
        tags: "route",
        on: {
          CHOOSE: { target: "resolve" },
        },
      },
      resolve: {
        onEntry: "resolve",
        always: [{ target: "end", cond: "isOver" }, { target: "battle" }],
      },
      end: {
        tags: "route",
        on: {
          START: { target: "start" },
        },
      },
    },
  },
  {
    guards: {
      isOver: (context, event) => {
        return context.placement
          .map((value, index) => value && index)
          .filter((value): value is number => value !== null)
          .every((value) => context.status[value] === "!");
      },
    },
    actions: {
      setup: assign((context, event) => ({
        character: characters.find(({ id }) => id === event.character),
        enemy: characters.filter(({ id }) => id !== event.character)[
          Math.floor(Math.random() * (characters.length - 1))
        ],
        background: backgrounds[Math.floor(Math.random() * backgrounds.length)],

        placement: randomizePlacement(),
        status: new Array(GAME_BOARD_SIZE * GAME_BOARD_SIZE).fill(null),
      })),
      resolve: assign((context, event) => {
        const result = context.placement[event.index];

        if (result !== null) {
          const full = context.placement
            .map((ship, index) => {
              if (ship === result && context.status[index] !== null) {
                return index;
              }

              return null;
            })
            .filter((ship) => ship !== null && ship !== Number(event.index))
            .concat([Number(event.index)]);

          const size = full.length;

          for (const [key, value] of Object.entries(SHIPS)) {
            if (key.charAt(0) === result && size === value) {
              return {
                status: context.status.map((status, index) =>
                  full.includes(index) ? "!" : status
                ),
              };
            }
          }
        }

        return {
          status: context.status.map((status, index) =>
            Number(event.index) === index
              ? result === null
                ? "O"
                : "X"
              : status
          ),
        };
      }),
      end: assign((context, event) => {
        return {
          placement: [],
        };
      }),
    },
    services: {},
  }
);

export default async (initial?: any, event?: any) => {
  const actor = initial
    ? interpret(machine).start(initial)
    : interpret(machine).start();

  if (event) {
    actor.send(event);
  }

  return await waitFor(actor, (state) => state.hasTag("route"));
};

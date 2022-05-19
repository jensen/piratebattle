import type { SpyInstance } from "vitest";
import { describe, it, vi } from "vitest";
import { DIRECTION, GAME_BOARD_SIZE, findPlacement } from "~/statecharts/game";

describe("Placing Ships Randomly", () => {
  beforeEach(() => {
    vi.stubGlobal("Math", {
      random: vi.fn(() => 0.2),
      floor: vi.fn(Math.floor),
    });
  });

  describe("Hortizontal", () => {
    it("places a ship on the first attempt with an empty array", () => {
      const placement = new Array(GAME_BOARD_SIZE * GAME_BOARD_SIZE).fill(null);

      expect(findPlacement(placement)(DIRECTION.HORIZONTAL, 3)).toEqual([
        8, 9, 10,
      ]);
      expect(Math.random).toBeCalledTimes(2);
    });

    it("places a ship on the second attempt when there is a conflict", () => {
      const placement = new Array(GAME_BOARD_SIZE * GAME_BOARD_SIZE).fill(null);

      placement[32] = "D";
      placement[33] = "D";
      placement[34] = "D";

      (Math.random as unknown as SpyInstance).mockReturnValueOnce(0.5);

      expect(findPlacement(placement)(DIRECTION.HORIZONTAL, 3)).toEqual([
        8, 9, 10,
      ]);
      expect(Math.random).toBeCalledTimes(4);
    });
  });

  describe("Vertical", () => {
    it("places a ship on the first attempt with an empty array", () => {
      const placement = new Array(GAME_BOARD_SIZE * GAME_BOARD_SIZE).fill(null);

      expect(findPlacement(placement)(DIRECTION.VERTICAL, 3)).toEqual([
        1, 9, 17,
      ]);
      expect(Math.random).toBeCalledTimes(2);
    });

    it("places a ship on the second attempt when there is a conflict", () => {
      const placement = new Array(GAME_BOARD_SIZE * GAME_BOARD_SIZE).fill(null);

      placement[4] = "D";
      placement[12] = "D";
      placement[20] = "D";

      (Math.random as unknown as SpyInstance).mockReturnValueOnce(0.5);

      expect(findPlacement(placement)(DIRECTION.VERTICAL, 3)).toEqual([
        1, 9, 17,
      ]);
      expect(Math.random).toBeCalledTimes(4);
    });
  });
});

## Purpose

This project was completed as part of a group learning [exercise](https://www.devjam.org/project/939cac93-7c19-45fd-8669-9ddc773b22a6). Using a server side state machine we can create a game that does not require JavaScript.

## Demo

<img width="319" alt="Pirate Battle Demo" src="https://user-images.githubusercontent.com/14803/169208374-f3e17501-7cb8-4090-bd25-1999a2105a3a.png">

[https://piratebattle.netifly.app/](https://piratebattle.netlify.app/)

## Project Features

### User Stories

1. ✅ User can choose a character to play as.
2. ✅ User is presented with a game board to try and sink pirate ships.
3. ✅ User can choose locations on a grid and is informed if their choice results in a hit or a miss.
4. ✅ User can identify that they have sunked a ship based on the colors on the grid.
5. ✅ Use is able to retry once all of the ships are sunk.

## Technical

### Dependencies

- typescript
- react
- remix
- xstate
- vitest

### Server-side State Charts

After watching a the [Reactathon](https://youtu.be/0qK2_wi4t3k?t=12765) talk given by [Erik Rasumssen](https://twitter.com/erikras) about server side state charts I decided to implement this game using a similar technique.

The game states are mapped to the urls `/game/start`, `/game/battle`, `/game/end`. Each time the user takes an action, the server resolves the move.

<img width="720" alt="Pirate Ship Statechart" src="https://user-images.githubusercontent.com/14803/169210281-234d39f6-2b06-4f10-b7fc-e57feb1f37f8.png">

When the user starts the game, the server encodes the game state into a cookie session. Each action will create a new cookie with the latest game state.

### Random Ship Placement

There are a few [tests](./test/placement.spec.ts) written for the `findPlacement` [function](./src/statecharts/game.ts) used by the game engine. These tests confirm that the algorithm will try again if a randomly placed ship would overlap an existing ship.

```javascript
const findPlacement =
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
```

## Development

The Netlify CLI starts your app in development mode, rebuilding assets on file changes.

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

## Deployment

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run build
# preview deployment
netlify deploy

# production deployment
netlify deploy --prod
```

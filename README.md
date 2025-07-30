# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Gameplay

The Goose Game is played over a series of turns. On each turn you roll the dice and move your pawn forward.

- The colour of the square indicates the question category. Categories are loaded from Firebase and associated with board colours.
- If you answer incorrectly, you skip rolling on the next turn and must answer a new question instead.
- After 10 turns the game ends and you lose.

These rules are implemented in the Svelte application found in `src/routes/+page.svelte`.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

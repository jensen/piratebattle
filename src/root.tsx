import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData,
} from "@remix-run/react";
import { getGameState } from "~/services/game.server";

import reset from "~/styles/reset.css";
import main from "~/styles/main.css";

export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com", key: "" },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
      crossOrigin: "true",
    },
    {
      as: "style",
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lemon&display=swap",
    },
    {
      rel: "stylesheet",
      href: reset,
    },
    {
      rel: "stylesheet",
      href: main,
    },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Pirate Battle",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const state = await getGameState(request);

  if (state) {
    return json({
      background: state.context.background,
    });
  }

  return json({
    background: null,
  });
};

export default function App() {
  const { background } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body
        style={{
          ...(background && {
            backgroundImage: `url("/images/backgrounds/${background}")`,
          }),
          backgroundColor: "rgba(39, 51, 77, 1)",
        }}
      >
        <main className="layout">
          <header className="header">
            <Link to="/">
              <span className="logo">pirate battle</span>
            </Link>
          </header>
          <section className="content">
            <Outlet />
          </section>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

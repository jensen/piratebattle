import { createCookieSessionStorage } from "@remix-run/node";

if (typeof process.env.COOKIE_SESSION_KEY_A !== "string") {
  throw new Error("Most provide COOKIE_SESSION_KEY_A");
}

if (typeof process.env.COOKIE_SESSION_KEY_B !== "string") {
  throw new Error("Most provide COOKIE_SESSION_KEY_B");
}

const LENGTH = 604_800;

const storage = createCookieSessionStorage({
  cookie: {
    name: "state",
    expires: new Date(Date.now() + LENGTH * 1000),
    httpOnly: true,
    maxAge: LENGTH,
    path: "/",
    sameSite: "lax",
    secrets: [
      process.env.COOKIE_SESSION_KEY_A,
      process.env.COOKIE_SESSION_KEY_B,
    ],
    secure: true,
  },
});

export const getGameState = async (request: Request) => {
  const { getSession } = create();
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return null;
  }

  const session = await getSession(cookie);

  return session.get("state");
};

export const setGameState = async (data: any) => {
  const { getSession, commitSession } = create();

  const session = await getSession();

  session.set("state", data);

  return await commitSession(session);
};

export const getSession = storage.getSession;
export const commitSession = storage.commitSession;

export default function create() {
  return storage;
}

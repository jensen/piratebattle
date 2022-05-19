/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare namespace NodeJS {
  export interface ProcessEnv {
    COOKIE_SESSION_KEY_A: string;
    COOKIE_SESSION_KEY_B: string;
  }
}

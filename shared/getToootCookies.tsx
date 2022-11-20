import { getCookies } from "https://deno.land/std@0.165.0/http/cookie.ts";
import { isProbablyServerName } from "./isProbablyServerName.tsx";

type MaybeCookies = {
  Pref: string | undefined;
  [other: string]: string | undefined;
};

export function getToootCookies(headers: Headers) {
  const cookies = getCookies(headers) as MaybeCookies;

  return {
    preferredServer: isProbablyServerName(cookies.Pref)
      ? cookies.Pref
      : undefined,
  };
}

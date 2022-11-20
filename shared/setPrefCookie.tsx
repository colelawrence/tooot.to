import { setCookie } from "https://deno.land/std@0.165.0/http/cookie.ts";

export function setPrefCookie(headers: Headers, value: string) {
  setCookie(headers, {
    name: "Pref",
    value: value,
    sameSite: "Lax",
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });
}

import { PageProps } from "$fresh/server.ts";
import PickAServer from "../islands/PickAServer.tsx";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import {
  getCookies,
  setCookie,
} from "https://deno.land/std@0.165.0/http/cookie.ts";

type RenderData = {
  preferredServer?: string | undefined;
  recommendedServers: string[];
};

type MaybeCookies = {
  Pref: string | undefined;
  [other: string]: string | undefined;
};

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const cookies = getCookies(_req.headers) as MaybeCookies;

    const renderData: RenderData = {
      preferredServer: isProbablyServerName(cookies.Pref)
        ? cookies.Pref
        : undefined,
      recommendedServers: [],
    };

    const resp = await ctx.render(renderData);
    return resp;
  },
  async POST(req: Request, ctx: HandlerContext) {
    // hmm: do we need to time out / limit accepted length?
    const formData = await req.formData();
    // Same as hidden input's name in ServerLaunchButton
    const value = formData.get("value");
    const headers = new Headers({
      // send back to where you came from if anything is wrong
      Location: req.url,
    });
    if (isProbablyServerName(value)) {
      setCookie(headers, {
        name: "Pref",
        value: value,
        sameSite: "Strict",
        httpOnly: true,
      });
      const whereToMatch = /^[^\/]+\/\/[^\/]+\/(.+)$/.exec(req.url);
      if (whereToMatch) {
        const serverDestination = whereToMatch[1];
        headers.set("Location", `https://${value}/web/${serverDestination}`);
      }
    }
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

function isProbablyServerName(x: unknown): x is string {
  if (typeof x !== "string") return false;
  // at least 3 chars & has no spaces, forward slashes or ?
  if (x.length < 3 || /[ \/\?]/.test(x)) return false;
  return /[^\.]\.[^\.]/.test(x);
}

export default function Handoff(props: PageProps<RenderData>) {
  const to = props.params.name;

  return (
    <div class="flex flex-col gap-16 px-8 py-16 font-sans max-w-sm mx-auto">
      <h1 class="text-black text-4xl font-bold">Tooot.to</h1>
      <div class="flex flex-col gap-10">
        <div class="p-2 bg-gray-100">{to}</div>
        <div class="relative w-80">
          <PickAServer
            recommendedServers={props.data.recommendedServers}
            previousServerUsed={props.data.preferredServer}
          />
        </div>
      </div>
    </div>
  );
}

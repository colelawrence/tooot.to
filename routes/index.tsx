import { PageProps } from "$fresh/server.ts";
import PickAServer from "../islands/PickAServer.tsx";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { setPrefCookie } from "../shared/setPrefCookie.tsx";
import { isProbablyServerName } from "../shared/isProbablyServerName.tsx";
import { getToootCookies } from "../shared/getToootCookies.tsx";

type RenderData = {
  preferredServer?: string | undefined;
  recommendedServers: string[];
};


// Consider how to share this code with [name].tsx
export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const cookies = getToootCookies(_req.headers);

    const renderData: RenderData = {
      preferredServer: cookies.preferredServer,
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
      setPrefCookie(headers, value);
    }
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

export default function Handoff(props: PageProps<RenderData>) {
  return (
    <div class="flex flex-col gap-16 px-8 py-16 font-sans max-w-sm mx-auto">
      <div>
        <h1 class="text-black text-4xl font-bold">Tooot.to</h1>
        <p class="mt-2">
          Tooot.to helps you link to things on your own server made by{" "}
          <a
            class="text-blue-400"
            href={props.url.origin + "/@colel@hachyderm.io"}
          >
            @colel@hachyderm.io
          </a>
          .
        </p>
      </div>
      <div class="flex flex-col gap-10">
        <div class="relative w-80">
          <PickAServer
            cta="Choose your default server"
            recommendedServers={props.data.recommendedServers}
            previousServerUsed={props.data.preferredServer}
            customServerFormCTA="Save"
          />
        </div>
      </div>
    </div>
  );
}

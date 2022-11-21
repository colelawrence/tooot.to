import { PageProps, RouteConfig } from "$fresh/server.ts";
import PickAServer from "../islands/PickAServer.tsx";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { setPrefCookie } from "../shared/setPrefCookie.tsx";
import { isProbablyServerName } from "../shared/isProbablyServerName.tsx";
import { getToootCookies } from "../shared/getToootCookies.tsx";
import { Footer } from "../components/Footer.tsx";
// import { ImagePool } from "npm:@squoosh/lib"

// const pool = new ImagePool(1)

// function createQRCodePNG(options: { url: string }) {
//   // console.log({ options, pool: 1 });
//   return png;
// }

type RenderData = {
  preferredServer?: string | undefined;
  recommendedServers: string[];
};

export const config: RouteConfig = {
  routeOverride: "/:user(@[^\\/]+):hostAndItem(@[^\\/\\.]+\\..+)",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    const cookies = getToootCookies(req.headers);

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
      const whereToMatch = /^[^\/]+\/\/[^\/]+\/(.+)$/.exec(req.url);
      if (whereToMatch) {
        const serverDestination = whereToMatch[1];
        // e.g. @hachyderm.io
        const atSamePlaceEnding = "@" + value;
        // e.g. @colel@hachyderm.io
        if (serverDestination.endsWith(atSamePlaceEnding)) {
          const localDestination = serverDestination.slice(
            0,
            -1 * atSamePlaceEnding.length
          );
          headers.set("Location", `https://${value}/${localDestination}`);
        } else {
          headers.set("Location", `https://${value}/web/${serverDestination}`);
        }
      }
    }
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

export default function Handoff(props: PageProps<RenderData>) {
  console.log(props.params);
  const { user, hostAndItem } = props.params;
  const [host, ...item] = hostAndItem.split("/");

  let originServerHref = `https://${host}/${user}`;

  let to = `${user}${host}`;
  if (item.length) {
    const itemPart = `/${item.join("/")}`;
    to += itemPart;
    originServerHref += itemPart;
  }

  return (
    <div class="flex flex-col gap-16 px-8 py-16 font-sans max-w-sm mx-auto">
      <h1 class="text-black text-4xl font-bold">Tooot.to</h1>
      <div class="flex flex-col gap-10">
        {/* <img
          src={createQRCodePNG({ url: props.url.toString() })}
          alt="QR Code to this page"
        /> */}
        <div class="flex flex-col">
          <div class="p-2 bg-gray-100 text-lg">{to}</div>
          <a
            href={originServerHref}
            class="p-2 text-gray-600 text-sm block border rounded border-orange-400 hover:bg-gray-50"
          >
            Open in {host.slice(1)}
          </a>
        </div>
        <div class="relative w-80 flex flex-col gap-4">
          <PickAServer
            recommendedServers={props.data.recommendedServers}
            previousServerUsed={props.data.preferredServer}
            customServerFormCTA="Go"
          />
        </div>
      </div>
      <Footer sendMeFeedbackURL={props.url.origin + "/@colel@hachyderm.io"} />
    </div>
  );
}

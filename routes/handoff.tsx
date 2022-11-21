import { PageProps, RouteConfig } from "$fresh/server.ts";
import PickAServer from "../islands/PickAServer.tsx";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { setPrefCookie } from "../shared/setPrefCookie.tsx";
import { isProbablyServerName } from "../shared/isProbablyServerName.tsx";
import { importRsLib } from "../shared/importRsLib.ts";
import { getToootCookies } from "../shared/getToootCookies.tsx";
import { Footer } from "../components/Footer.tsx";
import { parseUserHostAndItem } from "../shared/parseUserHostAndItem.tsx";

type RenderData = HandoffURLs & {
  preferredServer?: string | undefined;
  recommendedServers: string[];
};

type HandoffURLs = {
  /** e.g. `https://hachyderm.io/@colel` */
  originServerHref: string;
  /** e.g. `hachyderm.io` */
  originServerLabel: string;
  /** e.g. `https://tooot.to/qr/@colel@hachyderm.io` */
  qrCodeImageURL: string;
  /** e.g. `tooot.to/@colel@hachyderm.io` */
  qrCodeLabel: string;
  /** e.g. `https://tooot.to/@colel@hachyderm.io` */
  sendMeFeedbackURL: string;
  /** e.g. `@colel@hachyderm.io` */
  toLabel: string;
};

type RouteParams = { user: string; hostAndItem: string };
export const config: RouteConfig = {
  routeOverride: "/:user(@[^\\/]+):hostAndItem(@[^\\/\\.]+\\..+)",
};

const parseURLsOfParams = (options: {
  reqOrigin: string;
  user: string;
  hostAndItem: string;
}): HandoffURLs => {
  const { originHost, originServerHref, toLabel } =
    parseUserHostAndItem(options);
  const sendMeFeedbackURL = `${options.reqOrigin}/@colel@hachyderm.io`;
  const qrCodeImageURL = `${options.reqOrigin}/qr/${toLabel}`;
  const toootURL = `${options.reqOrigin}/${toLabel}`;

  return {
    originServerHref,
    originServerLabel: originHost,
    sendMeFeedbackURL,
    qrCodeImageURL,
    qrCodeLabel: toootURL.replace(/^https?:\/\//, ""),
    toLabel,
  };
};

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    const cookies = getToootCookies(req.headers);
    const pageParams = ctx.params as RouteParams;
    const common = parseURLsOfParams({
      hostAndItem: pageParams.hostAndItem,
      user: pageParams.user,
      reqOrigin: new URL(req.url).origin,
    });

    const renderData: RenderData = {
      preferredServer: cookies.preferredServer,
      recommendedServers: [],
      ...common,
    };

    console.log({ name: "get-handoff", to: common.toLabel });
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
      console.log({
        name: "post-handoff",
        pref: value,
        dest: whereToMatch?.[1] ?? "error",
      });
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

export default function Handoff({ data, url }: PageProps<RenderData>) {
  return (
    <div class="flex flex-col gap-16 px-8 py-16 font-sans max-w-sm mx-auto">
      <div>
        <a class="text-black text-4xl font-bold" href={url.origin}>
          Tooot.to
        </a>
      </div>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col">
          <div class="flex flex-col p-2 bg-gray-100 gap-2">
            <div class="flex justify-between">
              <div class="text-lg">{data.toLabel}</div>
              <a class="text-base font-bold" href="#qr">
                QR
              </a>
            </div>
            <div class="hidden target:block" id="qr">
              {qrCodeJSX(data)}
            </div>
          </div>
          <a
            href={data.originServerHref}
            class="p-2 text-gray-600 text-sm block border rounded border-orange-400 hover:bg-gray-50"
          >
            Open in {data.originServerLabel}
          </a>
        </div>
        <div class="relative w-80 flex flex-col gap-4">
          <PickAServer
            recommendedServers={data.recommendedServers}
            previousServerUsed={data.preferredServer}
            customServerFormCTA="Go"
          />
        </div>
      </div>
      <Footer sendMeFeedbackURL={data.sendMeFeedbackURL} />
    </div>
  );
}

function qrCodeJSX(data: RenderData) {
  return (
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center p-2 rounded">
        <img
          class="w-full h-auto"
          id="qr-code"
          src={data.qrCodeImageURL}
          alt="QR Code to this page"
          loading="lazy"
        />
        <label htmlFor="qr-code" class="text-gray-400 text-sm">
          {data.qrCodeLabel}
        </label>
      </div>
    </div>
  );
}

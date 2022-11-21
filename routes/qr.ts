import { RouteConfig, Handlers, HandlerContext } from "$fresh/server.ts";
import { parseUserHostAndItem } from "../shared/parseUserHostAndItem.tsx";
import { importRsLib } from "../shared/importRsLib.ts";

type RouteParams = { user: string; hostAndItem: string };
export const config: RouteConfig = {
  routeOverride: "/qr/:user(@[^\\/]+):hostAndItem(@[^\\/\\.]+\\..+)",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    const rs = importRsLib();
    const pageParams = ctx.params as RouteParams;
    const { toLabel } =
      parseUserHostAndItem(pageParams);
    const toootURL = `${new URL(req.url).origin}/${toLabel}`;

    const pngData = (await rs).generate_qr_code(toootURL);

    return new Response(pngData, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  },
};

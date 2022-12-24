import { PageProps } from "$fresh/server.ts";
import PickAServer from "../islands/PickAServer.tsx";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { setPrefCookie } from "../shared/setPrefCookie.tsx";
import { isProbablyServerName } from "../shared/isProbablyServerName.tsx";
import { getToootCookies } from "../shared/getToootCookies.tsx";
import { Footer } from "../components/Footer.tsx";
import { ServerLaunchLink } from "../components/ServerLaunchLink.tsx";

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
      console.log({ name: "saved-pref", pref: value });
    }
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

export default function Index(props: PageProps<RenderData>) {
  return (
    <div class="flex flex-col gap-16 px-8 py-16 font-sans max-w-sm mx-auto">
      <div>
        <a class="text-black text-4xl font-bold" href={props.url.origin}>
          Tooot.to
        </a>
        <p class="mt-2">
          Tooot.to helps you link to things on your own server made by{" "}
          <a
            class="text-blue-400"
            href={props.url.origin + "/@colel@hachyderm.io"}
          >
            @colel@hachyderm.io
          </a>
          .
          <details>
            <summary>Huh?</summary>
            <div class="text-sm">{moreInfoJSX()}</div>
          </details>
        </p>
      </div>
      <div class="flex flex-col gap-10">
        <div class="relative w-80 flex flex-col gap-4">
          {props.data.preferredServer && (
            <div>
              <h3 class="font-bold text-base">Open your server</h3>
              <ServerLaunchLink host={props.data.preferredServer} />
            </div>
          )}
          <PickAServer
            cta="Choose your default server"
            recommendedServers={props.data.recommendedServers}
            previousServerUsed={props.data.preferredServer}
            customServerFormCTA="Save"
          />
        </div>
      </div>
      <Footer sendMeFeedbackURL={props.url.origin + "/@colel@hachyderm.io"} />
    </div>
  );
}

function moreInfoJSX() {
  return (
    <div class="more-info">
      <p>
        Until the devs add it directly to Mastodon, I created tooot.to to make
        it easier to link from websites outside of Mastodon into your Mastodon
        instance. You can put <code>tooot.to/</code> before any profile URL in
        the wild and it will let you click through to your own server more
        easily. e.g.{" "}
        <a
          class="text-blue-500 break-all"
          href="https://tooot.to/https://mastodon.social/web/@TodePond"
        >
          <span class="text-green-500">tooot.to/</span>
          https://mastodon.social/web/@TodePond
        </a>{" "}
        or{" "}
        <a
          class="text-blue-500 break-all"
          href="https://tooot.to/https://hachyderm.io/web/@computerfact@botsin.space"
        >
          <span class="text-green-500">tooot.to/</span>
          https://hachyderm.io/web/@computerfact@botsin.space
        </a>
        .
      </p>
      <p>
        As well, you can share a <code>tooot.to</code> URL of any profile handle
        so it&#39;s easier for others coming from other sites. e.g. I&#39;m at{" "}
        <a class="text-blue-500" href="https://tooot.to/@colel@hachyderm.io">
          <span class="text-green-500">tooot.to/</span>@colel@hachyderm.io
        </a>
      </p>
      <p>
        <strong>Features</strong>
      </p>
      <ul class="list-disc pl-2">
        <li>
          Prefix <span class="text-green-500">tooot.to/</span> redirections:
          <ul class="list-disc pl-2">
            <li>
              From handles:{" "}
              <a
                class="text-blue-500"
                href="https://tooot.to/@colel@hachderm.io"
              >
                <code>@colel@hachderm.io</code>
              </a>
            </li>
            <li>
              From mispelled handles:{" "}
              <a
                class="text-blue-500"
                href="https://tooot.to/@colel@hachderm.io"
              >
                <code>colel@hachderm.io</code>
              </a>{" "}
              or{" "}
              <a
                class="text-blue-500"
                href="https://tooot.to/@colel@hachderm.io"
              >
                <code>hachderm.io@colel</code>
              </a>
            </li>
            <li>
              From your logged in /web/ URLs:{" "}
              <a
                class="text-blue-500"
                href="https://tooot.to/https://hachderm.io/web/@colel"
              >
                <code>https://hachderm.io/web/@colel</code>
              </a>
            </li>
          </ul>
        </li>
        <li>QR Code generation for easy IRL sharing</li>
        <li>Local HTTP only cookie for preferred instance</li>
        <li>No JavaScript necessary to use</li>
      </ul>
    </div>
  );
}

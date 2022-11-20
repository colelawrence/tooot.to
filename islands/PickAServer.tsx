import ServerLaunchButton from "../components/ServerLaunchButton.tsx";
import servers from "../SERVERS.gen.json" assert { type: "json" };

interface PickAServerProps {
  cta?: string;
  customServerFormCTA: string;
  previousServerUsed?: string | undefined;
  recommendedServers: string[];
}

export default function PickAServer(props: PickAServerProps) {
  return (
    <div class="flex flex-col gap-2">
      <h3 class="font-bold text-base">{props.cta ?? "Open in your server"}</h3>
      {props.previousServerUsed ? (
        <div>
          {launchButtonContainerJSX(
            props,
            {
              host: props.previousServerUsed,
              w100px:
                (servers as Record<string, typeof servers["convo.casa"]>)[
                  props.previousServerUsed
                ]?.w100px ?? 900,
            },
            true
          )}
          <details>
            <summary class="font-bold text-base">Other common servers</summary>
            {bigListOfServers(props)}
          </details>
        </div>
      ) : (
        bigListOfServers(props)
      )}
    </div>
  );
}

function bigListOfServers(props: PickAServerProps) {
  return (
    <div>
      <div
        style={{
          // fix gaps between inline blocks
          fontSize: `0px`,
        }}
      >
        {Object.entries(servers).map((s) =>
          launchButtonContainerJSX(props, { host: s[0], w100px: s[1].w100px })
        )}
      </div>
      <h3 class="font-bold text-base">Other</h3>
      {serverLaunchCustomInput({
        value: props.previousServerUsed ?? "",
        cta: props.customServerFormCTA,
      })}
    </div>
  );
}

function serverLaunchCustomInput(props: { value: string; cta: string }) {
  return (
    <form
      method="POST"
      class="flex px-1 h-12 justify-between items-center bg-white rounded-sm border border-black relative"
    >
      <input
        name="value"
        type="text"
        value={props.value}
        placeholder="myawesomeserver.com"
        class="p-1 w-full"
      />
      <button type="submit" class="uppercase text-sm p-4">
        {props.cta}
      </button>
    </form>
  );
}

function launchButtonContainerJSX(
  props: PickAServerProps,
  s: { host: string; w100px: number },
  autoSize?: boolean
) {
  return (
    <div
      class={[
        "h-14 p-1 inline-block rounded-md",
        autoSize ? "max-w-full" : "w-1/2",
        props.previousServerUsed === s.host ? "bg-blue-400" : "bg-transparent",
      ].join(" ")}
    >
      <ServerLaunchButton
        // href={"https://" + s + "/web/" + props.destination}
        value={s.host}
        label={s.host}
        w100px={s.w100px}
        autoSize={autoSize}
        key={s}
      />
    </div>
  );
}

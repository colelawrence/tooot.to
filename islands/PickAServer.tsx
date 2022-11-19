import ServerLaunchButton from "../components/ServerLaunchButton.tsx";
import servers from "../SERVERS.gen.json" assert { type: "json" };

interface PickAServerProps {
  cta?: string,
  previousServerUsed?: string | undefined;
  recommendedServers: string[];
}

export default function PickAServer(props: PickAServerProps) {
  return (
    <div class="flex flex-col gap-2">
      <h3 class="font-bold text-base">{props.cta ?? "Open in"}</h3>
      {props.previousServerUsed ? (
        <div>
          {launchButtonContainerJSX(props, props.previousServerUsed)}
          <details>
            <summary class="font-bold text-base">Other common server</summary>
            <div
              style={{
                // fix gaps between inline blocks
                fontSize: `0px`,
              }}
            >
              {servers.map((s) => launchButtonContainerJSX(props, s))}
            </div>
          </details>
        </div>
      ) : (
        <div
          style={{
            // fix gaps between inline blocks
            fontSize: `0px`,
          }}
        >
          {servers.map((s) => launchButtonContainerJSX(props, s))}
        </div>
      )}
    </div>
  );
}

function launchButtonContainerJSX(props: PickAServerProps, s: string) {
  return (
    <div
      class="w-1/2 h-14 p-1 inline-block rounded-md"
      style={{
        backgroundColor:
          props.previousServerUsed === s ? "dodgerblue" : undefined,
      }}
    >
      <ServerLaunchButton
        // href={"https://" + s + "/web/" + props.destination}
        value={s}
        label={s}
        key={s}
      />
    </div>
  );
}

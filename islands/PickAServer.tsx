import ServerLaunchButton from "../components/ServerLaunchButton.tsx";
import servers from "../SERVERS.gen.json" assert { type: "json" };

interface PickAServerProps {
  cta?: string;
  previousServerUsed?: string | undefined;
  recommendedServers: string[];
}

export default function PickAServer(props: PickAServerProps) {
  return (
    <div class="flex flex-col gap-2">
      <h3 class="font-bold text-base">{props.cta ?? "Open in your server"}</h3>
      {props.previousServerUsed ? (
        <div>
          {launchButtonContainerJSX(props, props.previousServerUsed)}
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
        {servers.map((s) => launchButtonContainerJSX(props, s))}
      </div>
      <h3 class="font-bold text-base">Other</h3>
      {serverLaunchCustomInput({ value: props.previousServerUsed ?? "" })}
    </div>
  );
}

function serverLaunchCustomInput(props: { value: string }) {
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
        Save
      </button>
    </form>
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

import { instantiate } from "../lib/rs_lib.generated.js";

type RsLibModule = Awaited<ReturnType<typeof instantiate>>;
let once: Promise<RsLibModule> | undefined;
export function importRsLib(): Promise<RsLibModule> {
  if (!once) once = instantiate();
  return once;
}

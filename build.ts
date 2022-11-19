const encoder = new TextEncoder();
const decoder = new TextDecoder();
Deno.writeFileSync(
  "SERVERS.gen.json",
  encoder.encode(
    JSON.stringify(
      decoder
        .decode(Deno.readFileSync("SERVERS.txt"))
        .split(/\n/)
        .map((v) => v.trim())
        .filter(Boolean),
      null,
      1
    )
  )
);

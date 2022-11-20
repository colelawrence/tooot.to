import * as canvas from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const ctxOnce = (() => {
  const emuCanvas = canvas.createCanvas(200, 200);
  const ctx = emuCanvas.getContext("2d");
  ctx.font = "bold 100px Arial";
  return ctx;
})();

function getTextWidth100px(options: { text: string }) {
  const textMetrics = ctxOnce.measureText(options.text);
  const measured = {
    width: textMetrics.width,
    height:
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent,
  };

  return {
    widthOfArialBoldAt100px: measured.width,
  };
}
const encoder = new TextEncoder();
const decoder = new TextDecoder();
Deno.writeFileSync(
  "SERVERS.gen.json",
  encoder.encode(
    JSON.stringify(
      Object.fromEntries(
        decoder
          .decode(Deno.readFileSync("SERVERS.txt"))
          .split(/\n/)
          .map((v) => v.trim())
          .filter(Boolean)
          .map((host) => [
            host,
            {
              w100px: getTextWidth100px({ text: host }).widthOfArialBoldAt100px,
            },
          ])
      ),
      null,
      1
    )
  )
);

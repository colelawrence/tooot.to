import * as canvas from "https://deno.land/x/canvas@v1.4.1/mod.ts";

interface ServerLaunchButtonProps {
  label: string;
  // href: string;
  /** Value to post with */
  value: string;
}

const ctxOnce = (() => {
  const emuCanvas = canvas.createCanvas(200, 200);
  const ctx = emuCanvas.getContext("2d");
  ctx.font = "bold 100px Arial";
  return ctx;
})();

function chooseFontSize(options: { text: string }) {
  const textMetrics = ctxOnce.measureText(options.text);
  const measured = {
    width: textMetrics.width,
    height:
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent,
  };
  // Example: width: 1920px -> 9px
  // Example: width: 720px -> 23px
  // Example: width: > 540px -> 26px
  // 180 / 3 = 60px per px
  // const widthR = measured.width / options.maxWidth;
  // const heightR = measured.height / options.maxHeight;
  const maximumFontSize = 26;
  const minMeasuredWidth = 540;
  if (measured.width < minMeasuredWidth) return maximumFontSize;
  return Math.min(24, (150 / measured.width) * 100);
}

// function mapRange(value: number, low: number, high: number, lowTo: number, highTo: number) {
//   return lowTo + (highTo - lowTo) * (value - low) / (high - low);
// }

export default function ServerLaunchButton(props: ServerLaunchButtonProps) {
  return (
    <form
      method="POST"
      class="flex px-1 h-12 items-center justify-center bg-white rounded-sm border border-black relative"
      // // Improve privacy by not including info from where we're coming from
      // // https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noreferrer
      // rel="noreferrer"
      style={{
        fontFamily: "Arial",
        fontSize: chooseFontSize({
          text: props.label,
        }),
      }}
    >
      <input name="value" type="hidden" value={props.value} />
      <button type="submit" class="absolute inset-0">{props.label}</button>
    </form>
  );
}

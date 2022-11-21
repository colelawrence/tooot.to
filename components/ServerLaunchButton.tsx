interface ServerLaunchButtonProps {
  isCta?: boolean;
  label: string;
  w100px: number;
  // href: string;
  /** Value to post with */
  value: string;
  autoSize?: boolean;
}

function chooseFontSize(widthOfArialBoldAt100px: number) {
  // Example: width: 1920px -> 9px
  // Example: width: 720px -> 23px
  // Example: width: > 540px -> 26px
  // 180 / 3 = 60px per px
  // const widthR = measured.width / options.maxWidth;
  // const heightR = measured.height / options.maxHeight;
  const maximumFontSize = 26;
  const minMeasuredWidth = 540;
  if (widthOfArialBoldAt100px < minMeasuredWidth) return maximumFontSize;
  return Math.min(24, (150 / widthOfArialBoldAt100px) * 100);
}
// function mapRange(value: number, low: number, high: number, lowTo: number, highTo: number) {
//   return lowTo + (highTo - lowTo) * (value - low) / (high - low);
// }

export default function ServerLaunchButton(props: ServerLaunchButtonProps) {
  
  return (
    <form
      method="POST"
      // // Improve privacy by not including info from where we're coming from
      // // https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noreferrer
      // rel="noreferrer"
      class="h-12 items-center justify-center relative"
      style={{
        fontFamily: "Arial",
        fontSize: chooseFontSize(props.w100px),
      }}
    >
      <input name="value" type="hidden" value={props.value} />
      <button type="submit"
        class={`
          ${props.autoSize ? 'h-full' : 'absolute inset-0 w-full'}
          ${props.isCta ? 'bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-600' : 'text-indigo-500 border-indigo-500 hover:bg-gray-100'}
          p-2 leading-snug block border rounded grid gap-1
        `}
      >
        <div class="flex items-center">{props.label}</div>
        {/* { props.autoSize && 
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 12h12.5m0 0l-6-6m6 6l-6 6"/></svg>
        } */}
      </button>
    </form>
  );
}

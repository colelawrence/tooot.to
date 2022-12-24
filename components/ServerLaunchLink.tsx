interface ServerLaunchButtonProps {
  host: string;
  user?: string;
}

export function ServerLaunchLink(props: ServerLaunchLinkProps) {
  let originServerHref = `https://${props.host}/${props.user || ''}`;

  return (
    <a 
      class="h-12 p-2 leading-snug text-indigo-500 text-sm block border rounded border-indigo-500 hover:bg-gray-100 grid gap-1"
      style="grid-template-columns: 1fr 24px;" // Tailwind doesn't parse grid-cols-[1fr_32px] correctly for some reason
      href={originServerHref}
    >
      <div class="flex items-center">{props.host.replace('@', '')}</div>
      <div class="flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 12h12.5m0 0l-6-6m6 6l-6 6"/></svg>
      </div>
    </a>
  )
}
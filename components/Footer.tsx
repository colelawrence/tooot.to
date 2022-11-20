export function Footer(props: { sendMeFeedbackURL: string }) {
  return (
    <div class="text-sm flex p-2 justify-center w-full gap-1">
      <a
        href="https://blog.joinmastodon.org/2018/08/mastodon-quick-start-guide/"
        className="text-gray-400 hover:text-gray-900"
        target="_blank"
      >
        New to Mastodon?
      </a>
      •
      <a
        href="https://github.com/colelawrence/tooot.to"
        className="text-gray-400 hover:text-gray-900"
        target="_blank"
      >
        Source
      </a>
      •
      <a
        href={props.sendMeFeedbackURL}
        className="text-gray-400 hover:text-gray-900"
        target="_blank"
      >
        Toot me
      </a>
    </div>
  );
}

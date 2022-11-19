import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

serve((_req) => {
  return new Response(
    "Hello World! Currently I'm building this universal Mastodon link router at https://www.twitch.tv/refactorordie",
    {
      headers: { "content-type": "text/plain" },
    }
  );
});

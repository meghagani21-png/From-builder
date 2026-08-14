import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  // Use the proxied path so cookies stay same-origin (localhost:3007 → localhost:3007/api/trpc)
  const url = "/api/trpc";

  return c({
    url,
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};

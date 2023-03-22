import { Root } from "./routes/page";
import { Files } from "./routes/files/page";
import { Toucan } from "toucan-js";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  FILE_CACHE_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;

  FIREBASE_PROJECT_ID: string;
  FIREBASE_SERVICE_ACCT_JSON: string;
  TURNSTILE_KEY: string;
  SENTRY_DSN: string;
}

async function handler(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);

  switch (url.pathname) {
    case "/":
      return Root(url, request, env, ctx);
      break;
    case "/files":
      return Files(url, request, env, ctx);
    default:
      return new Response("Not Found", { status: 404 });
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const sentry = new Toucan({
      dsn: env.SENTRY_DSN,
      release: "1.0.0",
      context: ctx,
      request,
    });

    try {
      return await handler(request, env, ctx);
    } catch (e) {
      sentry.captureException(e);

      return new Response("Something went wrong! Team has been notified.", {
        status: 500,
      });
    }
  },
};

import { Env } from "../../..";
import { RouteHandler } from "../../../types";

const GET = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  const uuid = url.searchParams.get("uuid");

  if (uuid === null) return new Response("No uuid", { status: 400 });

  const object = await env.FILE_CACHE_BUCKET.get(uuid);
  if (object === null) return new Response("Object not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  const response = new Response(object.body, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
}) satisfies RouteHandler;

const DELETE = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  const uuid = url.searchParams.get("uuid");

  if (uuid === null) return new Response("No uuid", { status: 400 });

  const object = await env.FILE_CACHE_BUCKET.get(uuid);
  if (object === null) return new Response("Object not found", { status: 404 });

  await env.FILE_CACHE_BUCKET.delete(uuid);
  return new Response("Deleted", { status: 200 });
}) satisfies RouteHandler;

const OPTIONS = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  const response = new Response(null);

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,PUT,DELETE,OPTIONS"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  const requestHeaders = request.headers.get("Access-Control-Request-Headers");

  if (requestHeaders !== null) {
    response.headers.set("Access-Control-Allow-Headers", requestHeaders);
  }

  return response;
}) satisfies RouteHandler;

export const Manage = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  switch (request.method) {
    case "GET":
      return GET(url, request, env, ctx);
    case "DELETE":
      return DELETE(url, request, env, ctx);
    case "OPTIONS":
      return OPTIONS(url, request, env, ctx);
    default:
      return new Response(`${request.method} is not allowed for url ${request.url}.`, {
        status: 405,
        headers: {
          Allow: "GET, DELETE, OPTIONS",
        },
      });
  }
}) satisfies RouteHandler;

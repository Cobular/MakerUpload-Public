import { Env } from "../..";
import { IsTargetMachine, RouteHandler } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { FirestoreInterface } from "../../libs/firestore";

const PUT = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  const target_machine = url.searchParams.get("target_machine");

  if (!IsTargetMachine(target_machine))
    return new Response("Invalid target_machine", { status: 400 });

  if (request.body === null) return new Response("No body", { status: 400 });

  const firestore = await FirestoreInterface.New(env.FIREBASE_PROJECT_ID, env.FIREBASE_SERVICE_ACCT_JSON);

  const uuid = uuidv4();
  console.log("UUID", uuid);
  try {
    const firestore_resp = await firestore.addDocumentInCollection("files", {
      download_url: `https://cf-worker.cobular.workers.dev/files?uuid=${uuid}`,
      creation_time: new Date(),
      target_machine: target_machine,
      uid: uuid,
      name: "Test File.png",
    });
    const resp = await env.FILE_CACHE_BUCKET.put(uuid, request.body);

    return new Response(`Upload success`, { status: 200 });
  } catch (e) {
    console.error(e)
    return new Response(`Upload failed\n${e}`, { status: 500 });
  }
  
}) satisfies RouteHandler;

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

  return new Response(object.body, { status: 200 });
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

export const Files = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  switch (request.method) {
    case "PUT":
      return PUT(url, request, env, ctx);
    case "GET":
      return GET(url, request, env, ctx);
    case "DELETE":
      return DELETE(url, request, env, ctx);
    default:
      return new Response(`${request.method} is not allowed.`, {
        status: 405,
        headers: {
          Allow: "PUT",
        },
      });
  }
}) satisfies RouteHandler;

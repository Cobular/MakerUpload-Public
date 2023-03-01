import { Env } from "..";
import { RouteHandler } from "../types";

export const Root = (async (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response>  => {
  return new Response("Hello Root!")
}) satisfies RouteHandler;
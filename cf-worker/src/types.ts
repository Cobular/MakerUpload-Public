import { Env } from "."

export type RouteHandler = (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Promise<Response> 

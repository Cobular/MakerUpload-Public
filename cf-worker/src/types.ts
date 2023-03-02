import { Env } from "."

export type RouteHandler = (
  url: URL,
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Promise<Response> 

export interface JWT {
  access_token: string;
}

export function IsJWT(value: unknown): value is JWT {
  return typeof value === "object" && value !== null && "access_token" in value;
}
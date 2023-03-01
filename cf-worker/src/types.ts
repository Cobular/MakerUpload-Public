import { Env } from "."

const target_machines = [
  "3DPrinter",
  "Sewing"
 ] as const;

export type TargetMachine = typeof target_machines[number];

export function IsTargetMachine(value: unknown): value is TargetMachine {
  return typeof value === "string" && target_machines.includes(value as unknown as TargetMachine);
}

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
declare module "@sagi.io/workers-jwt" {
  export async function getTokenFromGCPServiceAccount(options: {
    serviceAccountJSON: Record<string, any>;
    aud: string;
    alg?: string;
    cryptoImpl?: Record<string, any> | null;
    expiredAfter?: number;
    headerAdditions?: Record<string, any>;
    payloadAdditions?: Record<string, any>;
  }): Promise<string>;
}

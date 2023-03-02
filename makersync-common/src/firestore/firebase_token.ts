import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt'


export interface JWT {
  access_token: string;
}

export function IsJWT(value: unknown): value is JWT {
  return typeof value === "object" && value !== null && "access_token" in value;
}

// For example's sake, the file contents (modified) from the private key has been 
// listed below, but the recommended way would be to use environment variables.
export async function getAccessToken(auth_json: string): Promise<JWT> {
  const jwtToken = await getTokenFromGCPServiceAccount({
    serviceAccountJSON: JSON.parse(auth_json),
    aud: 'https://oauth2.googleapis.com/token',
    payloadAdditions: {
      scope: [
        // scope required for firestore
        'https://www.googleapis.com/auth/datastore',
        // The following scopes are required only for realtime database
        // 'https://www.googleapis.com/auth/userinfo.email',
        // 'https://www.googleapis.com/auth/firebase.database',
      ].join(' '),
    },
  })

  const accessToken = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken, // the JWT token generated in the previous step
      }),
    })
  ).json()

  if (!IsJWT(accessToken)) {
    console.log("Invalid access token", accessToken);
    throw new Error('Invalid access token')
  }

  return accessToken
}
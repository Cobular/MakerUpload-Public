import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt';

function IsRawDocument(value) {
  return typeof value === "object" && value !== null && "creation_time" in value && "download_url" in value && "target_machine" in value;
}
function IsFirestoreDocument(value) {
  return typeof value === "object" && value !== null && "name" in value && "fields" in value && IsRawDocument(value.fields);
}
function IsFirestoreDocumentList(value) {
  return Array.isArray(value) && value.every((item) => IsFirestoreDocument(item));
}

function IsJWT(value) {
  return typeof value === "object" && value !== null && "access_token" in value;
}
async function getAccessToken(auth_json) {
  const jwtToken = await getTokenFromGCPServiceAccount({
    serviceAccountJSON: JSON.parse(auth_json),
    aud: "https://oauth2.googleapis.com/token",
    payloadAdditions: {
      scope: [
        // scope required for firestore
        "https://www.googleapis.com/auth/datastore"
        // The following scopes are required only for realtime database
        // 'https://www.googleapis.com/auth/userinfo.email',
        // 'https://www.googleapis.com/auth/firebase.database',
      ].join(" ")
    }
  });
  const accessToken = await (await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwtToken
      // the JWT token generated in the previous step
    })
  })).json();
  if (!IsJWT(accessToken)) {
    console.log("Invalid access token", accessToken);
    throw new Error("Invalid access token");
  }
  return accessToken;
}

class FirestoreInterface {
  constructor(accessToken, projectId) {
    this.accessToken = accessToken;
    this.projectId = projectId;
  }
  static async New(projectId, auth_json) {
    const accessToken = await getAccessToken(auth_json);
    return new FirestoreInterface(accessToken.access_token, projectId);
  }
  async getCollection(collection_name) {
    const fetch_res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.accessToken
        }
      }
    );
    if (!fetch_res.ok) {
      console.error("Invalid response", fetch_res);
      throw new Error("Invalid response");
    }
    const response = await fetch_res.json();
    if (Object.keys(response).length === 0) {
      return [];
    }
    if (!IsFirestoreDocumentList(response.documents)) {
      console.log("Invalid response", response);
      throw new Error("Invalid response");
    }
    return response.documents;
  }
  /**
   * Get a single document in a collection.
   */
  async getDocument(collection_name, docID) {
    const fetch_res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}/${docID}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.accessToken
        }
      }
    );
    if (!fetch_res.ok) {
      console.error("Invalid response", fetch_res);
      throw new Error("Invalid response");
    }
    const response = await fetch_res.json();
    if (!IsFirestoreDocument(response)) {
      console.log("Invalid response", response);
      throw new Error("Invalid response");
    }
    return response;
  }
  /**
   * Create a new document in a collection.
   */
  async addDocumentInCollection(collection_name, {
    download_url,
    target_machine,
    creation_time = /* @__PURE__ */ new Date(),
    uid,
    name
  }) {
    const body = {
      creation_time: {
        timestampValue: creation_time.toISOString()
      },
      download_url: {
        stringValue: download_url
      },
      target_machine: {
        stringValue: target_machine
      },
      uid: {
        stringValue: uid
      },
      name: {
        stringValue: name
      }
    };
    const fetch_res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields: body })
      }
    );
    if (!fetch_res.ok) {
      console.error("Invalid response", fetch_res);
      throw new Error(await fetch_res.text());
    }
    const fetch_json = await fetch_res.json();
    return fetch_json;
  }
  /**
   * Delete a single document in a collection.
   */
  async deleteDocumentInCollectionRaw(path) {
    const url = `https://firestore.googleapis.com/v1/${path}`;
    console.log("Delete url", url);
    try {
      const fetch_res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.accessToken
        }
      });
      console.log("Delete response", fetch_res);
      if (!fetch_res.ok) {
        console.error("Invalid response", fetch_res);
        throw new Error(await fetch_res.text());
      }
      const fetch_json = await fetch_res.json();
      return fetch_json;
    } catch (e) {
      console.log("Error deleting document", e);
      throw e;
    }
  }
  /**
   * Delete a single document in a collection.
   */
  async deleteDocumentInCollection(collection_name, docID) {
    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}/${docID}`;
    return this.deleteDocumentInCollectionRaw(url);
  }
}

export { FirestoreInterface, IsJWT, getAccessToken };
//# sourceMappingURL=firestore.mjs.map

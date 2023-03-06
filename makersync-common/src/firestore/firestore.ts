import {
  DocumentData,
  FirestoreDocument,
  IsFirestoreDocument,
  IsFirestoreDocumentList,
  RawDocumentData,
} from "../types/index";
import { getAccessToken } from "./firebase_token";

/**
 * Get all documents in a collection
 */
export class FirestoreInterface {
  constructor(private accessToken: string, private projectId: string) {}

  static async New<T>(
    projectId: string,
    auth_json: string
  ): Promise<FirestoreInterface> {
    const accessToken = await getAccessToken(auth_json);
    return new FirestoreInterface(accessToken.access_token, projectId);
  }

  async getCollection(collection_name: string): Promise<FirestoreDocument[]> {
    const fetch_res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
      }
    );

    if (!fetch_res.ok) {
      console.error("Invalid response", fetch_res);
      throw new Error("Invalid response");
    }

    const response = await fetch_res.json();

    if (!IsFirestoreDocumentList(response.documents)) {
      console.log("Invalid response", response);
      throw new Error("Invalid response");
    }

    return response.documents;
  }

  /**
   * Get a single document in a collection.
   */
  async getDocument(
    collection_name: string,
    docID: string
  ): Promise<FirestoreDocument> {
    const fetch_res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}/${docID}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
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
  async addDocumentInCollection(
    collection_name: string,
    {
      download_url,
      target_machine,
      creation_time = new Date(),
      uid,
      name,
    }: DocumentData
  ) {
    const body: RawDocumentData = {
      creation_time: {
        timestampValue: creation_time.toISOString(),
      },
      download_url: {
        stringValue: download_url,
      },
      target_machine: {
        stringValue: target_machine,
      },
      uid: {
        stringValue: uid,
      },
      name: {
        stringValue: name,
      },
    };

    const fetch_res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: body }),
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
  async deleteDocumentInCollectionRaw(path: string) {
    const url = `https://firestore.googleapis.com/v1/${path}`;

    console.log("Delete url", url);

    try {
      const fetch_res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
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
  async deleteDocumentInCollection(collection_name: string, docID: string) {
    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection_name}/${docID}`;

    return this.deleteDocumentInCollectionRaw(url);
  }
}

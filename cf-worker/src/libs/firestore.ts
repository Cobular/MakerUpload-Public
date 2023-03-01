import { getAccessToken } from "./firebase_token"



export interface FirestoreDocument<T> {
  name: string;
  fields: T;
}

export function IsFirestoreDocument(value: unknown): value is FirestoreDocument<Record<string, any>> {
  return typeof value === "object" && value !== null && "name" in value && "fields" in value;
}

export function IsFirestoreDocumentList(value: unknown): value is FirestoreDocument<Record<string, any>>[] {
  return Array.isArray(value) && value.every(IsFirestoreDocument);
}

/**
* Get all documents in a collection
*/
export class FirestoreInterface<DocumentType> {
  constructor(private accessToken: string) {}

  static async New<T>(): Promise<FirestoreInterface<T>> {
    const accessToken = await getAccessToken();
    return new FirestoreInterface<T>(accessToken.access_token);
  }

  async getCollection(): Promise<FirestoreDocument<DocumentType>[]> {
    const response = await (
      await fetch(
        'https://firestore.googleapis.com/v1/projects/<PROJECTIDHERE>/databases/(default)/documents/<COLLECTIONNAME>', 
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + this.accessToken,
          },
        }
      )
    ).json()

    if (!IsFirestoreDocumentList(response.documents)) {
      console.log("Invalid response", response);
      throw new Error('Invalid response')
    }

    return response
  }

  /**
   * Get a single document in a collection.
   */
  async getDocument(docID: string): Promise<FirestoreDocument<DocumentType>> {
    const response = await (
      await fetch(
        'https://firestore.googleapis.com/v1/projects/<PROJECTIDHERE>/databases/(default)/documents/<COLLECTIONNAME>/<DOCID>', 
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + this.accessToken,
          },
        }
      )
    ).json()

    if (!IsFirestoreDocument(response)) {
      console.log("Invalid response", response);
      throw new Error('Invalid response')
    }

    return response
  }
}

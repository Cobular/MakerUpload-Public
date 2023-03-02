import { TargetMachine } from "./index";

export interface DocumentData {
  creation_time: Date;
  download_url: string;
  target_machine: TargetMachine;
  name: string;
  uid: string;
}

export interface RawDocumentData {
  creation_time: {
    timestampValue: string;
  };
  download_url: {
    stringValue: string;
  };
  target_machine: {
    stringValue: TargetMachine;
  };
  uid: {
    stringValue: string;
  };
  name: {
    stringValue: string;
  }
}
export interface FirestoreDocument {
  name: string;
  fields: RawDocumentData;
  createTime: string;
  updateTime?: string;
}


export function IsDocument(value: unknown): value is DocumentData {
  return (
    typeof value === "object" &&
    value !== null &&
    "creation_time" in value &&
    "download_url" in value
  );
}

export function IsRawDocument(value: unknown): value is RawDocumentData {
  return (
    typeof value === "object" &&
    value !== null &&
    "creation_time" in value &&
    "download_url" in value &&
    "target_machine" in value
  );
}

export function IsFirestoreDocument(
  value: unknown
): value is FirestoreDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "fields" in value &&
    IsRawDocument(value.fields)
  );
}

export function IsFirestoreDocumentList(
  value: unknown
): value is FirestoreDocument[] {
  return (
    Array.isArray(value) && value.every((item) => IsFirestoreDocument(item))
  );
}

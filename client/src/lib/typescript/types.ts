// Between 0 and 100
export type OnProgress = (progress: number) => void;
export type OnFinished = (result: string) => void;
export type OnError = (result: string) => void;

// Includes max and current
export type OnChunk = (max: number, current: number) => void;

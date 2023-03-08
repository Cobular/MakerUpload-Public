import { appWindow } from "@tauri-apps/api/window";

export async function prevent_close(): Promise<() => void> {
  return await appWindow.onCloseRequested((event) => {
    event.preventDefault();
  })
}
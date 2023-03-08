import { invoke } from "@tauri-apps/api";

export async function download_file(download_url: string, name: string) {
  await invoke("download_file", { url: download_url, filename: name })
}
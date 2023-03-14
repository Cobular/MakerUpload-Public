import { invoke } from "@tauri-apps/api";

export async function download_file(download_url: string, name: string) {
  const download_file = await invoke("download_file", { url: download_url, filename: name })
  console.debug("Downloaded file:", download_file)
}
use std::path::Path;

use tauri::api::path::document_dir;
use tokio::{fs::File, io::AsyncWriteExt};

#[tauri::command]
pub async fn download_file(url: String, filename: String) -> Result<usize, String> {
    // Put the file in the user's document directory
    let file_name = document_dir().unwrap().join(Path::new(&filename));
    let mut resp = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let mut out = File::create(file_name).await.map_err(|e| e.to_string())?;
    let mut len = 0;
    while let Some(chunk) = resp.chunk().await.map_err(|e| e.to_string())? {
        len += chunk.len();
        out.write_all(&chunk).await.map_err(|e| e.to_string())?;
    }
    Ok(len)
}

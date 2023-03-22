use std::path::Path;

use std::io::Cursor;
use tauri::api::path::document_dir;
use tokio::{fs::File, io::copy};
use log::{info, error};

#[tauri::command]
pub async fn download_file(url: String, filename: String) -> Result<u64, String> {
    // Put the file in the user's document directory
    let file_name = document_dir().unwrap().join(Path::new(&filename));
    let resp = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let mut out = File::create(file_name).await.map_err(|e| e.to_string())?;
    let expected_len = resp.content_length().unwrap_or(0);
    info!(
        "Downloading {} to {}, size {:?}",
        url,
        filename,
        resp.content_length()
    );

    if (resp.status() != reqwest::StatusCode::OK) {
        error!("Download failed: {}", resp.status());
        return Err(format!("Download failed: {}", resp.status()));
    }

    let mut content = Cursor::new(resp.bytes().await.map_err(|e| e.to_string())?);

    let len = copy(&mut content, &mut out)
        .await
        .map_err(|e| e.to_string())?;

    info!("Downloaded {} bytes", len);

    if len != expected_len {
        error!(
            "Downloaded {} bytes, expected {}",
            len, expected_len
        );
        return Err(format!(
            "Downloaded {} bytes, expected {}",
            len, expected_len
        ));
    }

    Ok(len)
}

function download(dataurl: string, filename: string) {
  const link = document.createElement("a");
  link.setAttribute("href", dataurl);
  link.setAttribute("download", filename);
  link.click();
}
export async function download_file(download_url: string, name: string) {
  const file_data = await fetch(download_url);
  const blob = await file_data.blob();
  const reader = new FileReader();
  reader.onload = function () {
    if (typeof this.result !== 'string') {
      throw new Error('Expected result to be a string');
    }
    download(this.result, name);
  };
  reader.readAsDataURL(blob);
}
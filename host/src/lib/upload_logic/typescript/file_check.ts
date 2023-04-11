// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon'
];

export function validFileType(file: File) {
  return fileTypes.includes(file.type);
}

export function returnFileSize(num: number): string {
  if (num >= 1024 && num < 1048576) {
    return `${(num / 1024).toFixed(1)} KB`;
  } else if (num >= 1048576) {
    return `${(num / 1048576).toFixed(1)} MB`;
  }
  return `${num} bytes`;
}
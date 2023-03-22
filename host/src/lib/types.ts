export interface FileDetails {
  name: string;
  download_url: string;
  creation: Date;
}	

export interface AlertData {
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  key: string;
}
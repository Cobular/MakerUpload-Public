import type { TargetMachine } from 'makersync-common/types';
import { BASE_URL } from './base_url';
import { returnFileSize } from './file_check';

interface FileData {
	name: string;
	size: number;
	readable_size: string;
}

export type OnProgress = (progress: number) => void;
export type OnFinished = (result: string) => void;
export type OnError = (result: string) => void;

export async function upload_file(
	file: File,
	target_machine: TargetMachine,
	on_progress: OnProgress,
	on_finished?: OnFinished,
	on_error?: OnError
): Promise<FileData> {
	const file_data: FileData = {
		name: file.name,
		size: file.size,
		readable_size: returnFileSize(file.size)
	};

	const dest_url =
		BASE_URL +
		new URLSearchParams({
			target_machine: '3DPrinter',
			file_name: file.name
		});

	const totalBytes = file.size;

	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', (e) => {
			on_progress(Math.round((e.loaded / totalBytes) * 100));
		});
		xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
		xhr.addEventListener('error', () => reject(new Error('File upload failed')));
		xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
		xhr.open('PUT', dest_url, true);
		const formData = new FormData();
		Array.from([file]).forEach((file, index) => formData.append(index.toString(), file));
		xhr.send(formData);
	})
		.then((value) => {
			const { status, body } = value as { status: number; body: string };
			if (status !== 200) {
				if (on_error) {
					on_error(`Upload failed with status ${status}`);
				}
				console.error('Upload failed with status', status);
				throw new Error(`Upload failed with status ${status}`);
			}
			console.debug(body);
			if (on_finished) {
				on_finished(body);
			}
		})
		.catch((error) => {
			console.error(error);
			if (on_error) {
				on_error(error);
			}
		});

	return file_data;
}

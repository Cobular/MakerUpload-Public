import type { TargetMachine } from 'makersync-common/types';
import { BASE_URL } from './base_url';
import { returnFileSize } from './file_check';
import axios from 'axios';

interface FileData {
	name: string;
	size: number;
	readable_size: string;
}

export type OnProgress = (progress: number) => void;
export type OnFinished = (result: string) => void;
export type OnError = (result: string) => void;

export function upload_file(
	file: File,
	target_machine: TargetMachine,
	token: string,
	on_progress: OnProgress
): [FileData, Promise<unknown>] {
	const file_data: FileData = {
		name: file.name,
		size: file.size,
		readable_size: returnFileSize(file.size)
	};

	const dest_url =
		BASE_URL +
		new URLSearchParams({
			target_machine: target_machine,
			file_name: file.name,
			token: token
		});

	const totalBytes = file.size;

	const put_req = axios.put(dest_url, file, {
		onUploadProgress: (progressEvent) => {
			const progress = Math.round((progressEvent.loaded / totalBytes) * 100);
			on_progress(progress);
		}
	})

	return [file_data, put_req];
}

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

	const totalBytes = file.size;
	let bytesUploaded = 0;

  // Cursed shenanigans to persist the file data
  // const ab = await file.arrayBuffer()
  // console.log(ab);
  
	// const blobReader = (new ReadableStream({
  //   start(controller) {
  //     controller.enqueue(ab)
  //     controller.close()
  //   }
  // })).getReader();

	// const progressTrackingStream = new ReadableStream({
	// 	async pull(controller) {
	// 		const result = await blobReader.read();
	// 		if (result.done) {
	// 			console.log('completed stream');
	// 			controller.close();
	// 			return;
	// 		}
	// 		controller.enqueue(result.value);
	// 		bytesUploaded += result.value.byteLength;
	// 		on_progress(Math.round((bytesUploaded / totalBytes) * 100));
	// 	}
	// });

	fetch(
		BASE_URL +
			new URLSearchParams({
				target_machine: '3DPrinter'
			}),
		{
			method: 'PUT',
			body: file,
		}
	)
		.then((res) => res.text())
		.then((text) => {
			console.debug(text);
			if (on_finished) {
				on_finished(text);
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

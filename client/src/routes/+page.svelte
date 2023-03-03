<script lang="ts">
	import FileSelect from '../lib/components/FileSelect.svelte';
	import StepCounter from '../lib/components/StepCounter.svelte';

	let file: HTMLInputElement;

	let list: HTMLUListElement;

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

	function validFileType(file) {
		return fileTypes.includes(file.type);
	}

	function returnFileSize(number) {
		if (number < 1024) {
			return `${number} bytes`;
		} else if (number >= 1024 && number < 1048576) {
			return `${(number / 1024).toFixed(1)} KB`;
		} else if (number >= 1048576) {
			return `${(number / 1048576).toFixed(1)} MB`;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		const files = file.files;

		if (files === null) {
			return;
		}

		for (const file of files) {
			const listItem = document.createElement('li');
			const para = document.createElement('p');
			para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;

			fetch(
				'https://cf-worker.cobular.workers.dev/files?' +
					new URLSearchParams({
						target_machine: '3DPrinter'
					}),
				{
					method: 'PUT',
					body: file
				}
			)
				.then((res) => res.json())
				.then(console.log)
				.catch(console.error);

			listItem.appendChild(para);

			list.appendChild(listItem);
		}
	}
</script>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-3xl">
			<h1 class="text-5xl font-bold">MakerSync</h1>
			<p class="py-6 pb-10">Upload files below</p>

			<div class="card bg-base-100 shadow-xl m-5">
				<div class="card-body max-w-sm w-screen">
					<StepCounter step={1} />

					<FileSelect />
				</div>
			</div>
		</div>
	</div>
</div>

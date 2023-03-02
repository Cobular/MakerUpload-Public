<script lang="ts">
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

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form on:submit|preventDefault={handleSubmit}>
	<input bind:this={file} type="file" name="file" />
	<button type="submit">Submit</button>
</form>

<ul bind:this={list} />

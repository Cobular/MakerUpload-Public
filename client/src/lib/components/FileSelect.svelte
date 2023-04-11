<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { filedrop } from 'filedrop-svelte';
	import type { Files, FileDropOptions } from 'filedrop-svelte';

	const dispatch = createEventDispatcher<{ file_choose: { file: File } }>();

	let file_input: HTMLInputElement;

	let error: string | undefined = undefined;

	function handle_file_select(file_arr: File[]) {
		for (const file of file_arr) {
			console.log(file.size);
			if (file.size > 100000000) {
				error = 'File too large. Please upload a file smaller than ~90MB';
				return;
			}
			error = undefined;
			dispatch('file_choose', { file });
		}
	}

	let options: FileDropOptions = {};

	$: options = {
		windowDrop: true,
		input: file_input,
		hideInput: false
	};
	let files: Files;
</script>

<form
	class="flex flex-col gap-5 items-center"
	use:filedrop={options}
	on:filedrop={(e) => {
		const accepted_files = e.detail.files.accepted;
		handle_file_select(accepted_files);
	}}
>
	<p>Drag a file here, or select one below!</p>
	<input
		class="file-input file-input-info w-80"
		bind:this={file_input}
		on:input={(e) => {
			const files = file_input.files;

			if (files) {
				handle_file_select(Array.from(files));
			}
		}}
		type="file"
		name="file"
	/>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</form>

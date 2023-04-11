<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{file_choose: {file: File}}>();

	let file_input: HTMLInputElement;

	let error: string | undefined = undefined;

	function handle_file_select(event: Event) {
		const files = file_input.files;

		if (files === null) {
			return;
		}

		for (const file of files) {
			console.log(file.size)
			if (file.size > 100000000) {
				error = "File too large. Please upload a file smaller than ~90MB"
				return;
			}
			error = undefined
			dispatch('file_choose', {file});
		}
	}
</script>

<form class="flex flex-col gap-5 items-center">
	<input
		class="file-input file-input-info w-80"
		bind:this={file_input}
		on:input={handle_file_select}
		type="file"
		name="file"
	/>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</form>

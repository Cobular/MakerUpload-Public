<script lang="ts">
	export let on_file_choose: (file: File) => void;

	let file_input: HTMLInputElement;

	function handle_file_select(event: Event) {
		const files = file_input.files;

		if (files === null) {
			return;
		}

		for (const file of files) {
			on_file_choose(file);
		}
	}
</script>

<form class="flex flex-col gap-5 items-center">
	<input
		class="file-input file-input-info w-80"
		bind:this={file_input}
		on:select|preventDefault={handle_file_select}
		type="file"
		name="file"
	/>
</form>

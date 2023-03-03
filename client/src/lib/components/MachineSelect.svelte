<script lang="ts">



	export let on_select_choose: (room: Label) => void;

	let select_input: HTMLSelectElement;

	function handle_file_select(event: Event) {
		const files = select_input.selectedOptions;

		if (files === null) {
			return;
		}

		for (const file of files) {
			on_file_choose(file);
		}
	}
</script>

<form class="flex flex-col gap-5 items-center">
  <select class="select select-info w-80" bind:this={select_input}>
    <option disabled selected>Select a Room</option>
    
    <option>3D Printing</option>
    <option>Sewing</option>
    <option>Laptops</option>
  </select>
</form>

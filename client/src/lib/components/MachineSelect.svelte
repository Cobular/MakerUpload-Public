<script lang="ts">
	import { type TargetMachine, IsTargetMachine, target_machines } from 'makersync-common/types';
	import { createEventDispatcher } from 'svelte';

	let select_input: HTMLSelectElement;

	const dispatch = createEventDispatcher<{ select_choose: { machine: TargetMachine } }>();

	function handle_select(event: Event) {
		const selected_options = select_input.selectedOptions;

		if (selected_options === null) {
			return;
		}

		for (const option of selected_options) {
			const name = option.id;
			console.log(`Selected "${name}"`)
			if (IsTargetMachine(name)) {
				dispatch('select_choose', { machine: name });
			} else {
				throw new Error('Invalid machine name: ' + name);
			}
		}
	}
</script>

<form class="flex flex-col gap-5 items-center">
	<select class="select select-info w-80" bind:this={select_input} on:input|preventDefault={handle_select}>
		<option disabled selected>Select a Room</option>
		{#each target_machines as machine}
			<option id={machine}>{machine}</option>
		{/each}
	</select>
</form>

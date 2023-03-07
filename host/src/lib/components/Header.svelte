<script lang="ts">
	import { this_machine_store } from "$lib/stores/this_machine_store";
	import { target_machines } from "makersync-common/types";
</script>

<div class="p-3 w-screen">
	<div class="navbar bg-base-200 rounded-2xl">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-xl" href="/">MakerSync</a>
			<select class="ml-auto select select-bordered" bind:value={$this_machine_store}>
				{#each target_machines as machine}
					<option value={machine}>{machine}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<script lang="ts">
	import { this_machine_store } from '$lib/stores/this_machine_store';
	import { target_machines } from 'makersync-common/types';
	import { getVersion } from '@tauri-apps/api/app';
</script>

<div data-tauri-drag-region class="p-3 w-screen">
	<div data-tauri-drag-region class="navbar bg-base-200 rounded-2xl cursor-grab">
			<a class="btn btn-ghost normal-case text-xl font-mono" href="/">upload.cobular.com</a>
			{#await getVersion()}
				<!-- promise is pending -->
			{:then version}
				<p class="text-gray-400">v{version}</p>
			{/await}
			<div class="ml-auto">
				<label class="input-group">
					<span>Room</span>
					<select class="select" bind:value={$this_machine_store}>
						{#each target_machines as machine}
							<option value={machine}>{machine}</option>
						{/each}
					</select>
				</label>
			</div>
	</div>
</div>

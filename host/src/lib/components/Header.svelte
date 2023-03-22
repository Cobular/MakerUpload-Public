<script lang="ts">
	import { this_machine_store } from '$lib/stores/this_machine_store';
	import { target_machines } from 'makersync-common/types';
	import { getVersion } from '@tauri-apps/api/app';
	import { open } from '@tauri-apps/api/shell';
	import { downloadDir } from '@tauri-apps/api/path';
	import { emit } from '@tauri-apps/api/event';
</script>

<div data-tauri-drag-region class="p-4 w-screen pb-0">
	<div data-tauri-drag-region class="navbar bg-base-200 rounded-2xl cursor-grab">
		<a class="btn btn-ghost normal-case text-xl font-mono" href="/">upload.cobular.com</a>
		{#await getVersion()}
			<!-- promise is pending -->
		{:then version}
			<button on:click={async () => await emit('tauri://update')}>
				<p class="text-gray-400">v{version}</p>
			</button>
		{/await}
		<div class="ml-auto">
			<button class="btn mr-4" on:click={async () => open(await downloadDir())}>
				Open Folder
			</button>
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

<script lang="ts">
	import { returnFileSize } from '$lib/typescript/file_check';
	import type { StatePropType } from '$lib/typescript/states';

	export let state: StatePropType;
</script>

<div>
	{#if state.matches('select_files')}
		Drag a file here, or select one below!
	{:else if state.matches('select_machine')}
		{#if state.context.files.length === 1}
			Will send {returnFileSize(state.context.files[0].size)} file
			<span class="font-mono">{state.context.files[0].name}</span> to:
		{:else}
			Will send <span class="font-mono">{state.context.files.length}</span> files ({returnFileSize(
				state.context.files.reduce((acc, val) => acc + val.size, 0)
			)}) to:
		{/if}
	{:else if state.matches('upload.waiting')}
		{#if state.context.files.length === 1}
			Will send {returnFileSize(state.context.files[0].size)} file
			<span class="font-mono">{state.context.files[0].name}</span> to {state.context.target} room
		{:else}
			Will send <span class="font-mono">{state.context.files.length}</span> files ({returnFileSize(
				state.context.files.reduce((acc, val) => acc + val.size, 0)
			)}) to <span class="font-mono">{state.context.target}</span> room
		{/if}
	{:else if state.matches('upload.validating')}
		Validating...
	{:else if state.matches('upload.compressing')}
		Compressing files...
	{:else if state.matches('upload.uploading')}
		Uploading files...
	{/if}
</div>

<script lang="ts">
	import { returnFileSize } from '$lib/upload_logic/typescript/file_check';
	import type { PageState } from '$lib/upload_logic/typescript/types';
	export let data: PageState;
</script>

<!-- Recreate the above logic in svelte -->
{#if data.file !== null}
	<div>
		{#if data.target !== null}
			{#if data.step === 4}
				Successfully sent {returnFileSize(data.file.size)} file
				<span class="font-mono">{data.file.name}</span>
				to {data.target} room
			{:else}
				Will send {returnFileSize(data.file.size)} file
				<span class="font-mono">{data.file.name}</span>
				to {data.target} room
			{/if}
		{:else}
			Will send {returnFileSize(data.file.size)} file
			<span class="font-mono">{data.file.name}</span> to:
		{/if}
	</div>
{/if}

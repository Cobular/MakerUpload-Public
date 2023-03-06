<script lang="ts">
	import { returnFileSize } from '$lib/typescript/file_check';
	import type { PageState } from '$lib/typescript/types';
	export let data: PageState;
</script>

{#if data.file !== null}
<div>
	<p class="text-center text-gray-500">
			Will send {returnFileSize(data.file.size)} file {data.file.name}
    {#if data.target !== null}
      to {data.target} room
    {:else}
      to:
    {/if}
	</p>
</div>
{/if}

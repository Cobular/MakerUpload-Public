<script lang="ts">
	import { returnFileSize } from '$lib/typescript/file_check';
	import type { PageState } from '$lib/typescript/types';
	export let data: PageState;

	let text: string | undefined;

	$: {
		if (data.file !== null) {
			if (data.target !== null) {
				text = `Will send ${returnFileSize(data.file.size)} file <span class="font-mono">${data.file.name}</span> to ${
					data.target
				} room`;
			} else {
				text = `Will send ${returnFileSize(data.file.size)} file <span class="font-mono">${data.file.name}</span> to:`;
			}
			if (data.step === 4) {
				text = `Successfully sent ${returnFileSize(data.file.size)} file <span class="font-mono">${data.file.name}</span> to ${
					data.target
				} room`;
			}
		} else {
			text = undefined;
		}
	}
</script>

{#if text !== undefined}
	<div>
		<p class="text-center neutral-content">{@html text}</p>
	</div>
{/if}

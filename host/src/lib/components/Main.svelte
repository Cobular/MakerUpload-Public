<script lang="ts">
	import type { DocumentData } from 'makersync-common/types';
	import FilesGrid from './FilesGrid.svelte';
	import Header from './Header.svelte';

	export let files: DocumentData[];
</script>

<div class="w-screen h-screen flex flex-col">
  <Header />
  {#if files.length > 0}
  <div class="overflow-y-scroll overflow-x-clip h-full">
    <FilesGrid {files} />
  </div>
  {:else}
  <div class="flex-grow flex justify-center items-center">
      <p class="text-5xl font-mono">No files, upload something!</p>
  </div>
  {/if}
</div>


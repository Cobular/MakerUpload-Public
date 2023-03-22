<script lang="ts">
	import type { DocumentData } from 'makersync-common/types';
	import FilesGrid from './FilesGrid.svelte';
	import Header from './Header.svelte';

	export let files: DocumentData[];
</script>

<div class="w-screen h-screen flex flex-col">
  <Header />
  <div class="overflow-y-scroll overflow-x-clip">
    <FilesGrid {files} />
  </div>
</div>


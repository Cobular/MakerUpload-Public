<script lang="ts">
	import type { DocumentData } from "makersync-common/types";
	import File from "./File.svelte";

  export let files: DocumentData[];

  function sorting(a: DocumentData,b: DocumentData) {
    return a.creation_time.toDate().getTime() - b.creation_time.toDate().getTime();
  }
</script>

<div class="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-3 p-4">
  {#each files.sort(sorting).reverse() as file}
     <File {file} />
  {/each}
</div>
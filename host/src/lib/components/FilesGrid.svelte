<script lang="ts">
	import type { DocumentData } from "makersync-common/types";
	import File from "./File.svelte";

  export let files: DocumentData[];
</script>

<div class="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-3 p-3">
  {#each files.reverse() as file}
     <File {file} />
  {/each}
</div>
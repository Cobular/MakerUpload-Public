<script lang="ts">
	import { FirestoreReadable } from "$lib/firestore";
	import { collection, query } from "firebase/firestore";
	import { readable, type Readable } from "svelte/store";
	import { onMount } from "svelte";
  import { firestore } from "../lib/firebase";

  const files_ref = query(collection(firestore, '/files'));

  let files_store: Readable<any[]> = readable([]);

  onMount(async () => {
    const files = await FirestoreReadable.new(files_ref);
    files_store = files;
  });

  $: console.log($files_store);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#each $files_store as file}
  <a href={file.download_url}>{file.download_url}</a>
{/each}

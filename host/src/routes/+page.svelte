<script lang="ts">
	import { FirestoreReadable } from '$lib/firestore';
	import { collection, CollectionReference, query, type DocumentChange } from 'firebase/firestore';
	import { readable, type Readable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { firestore } from '../lib/firebase';
	import type { DocumentData } from 'makersync-common/types';

	const files_ref = query<DocumentData>(
		collection(firestore, '/files') as unknown as CollectionReference<DocumentData>
	);

	let files_store: Readable<DocumentData[]> = readable([]);

	function document_change_handler(snapshot: DocumentChange<DocumentData>) {
		const doc = snapshot.doc;
		console.log(`${doc.data().name}|${doc.data().download_url}`);
	}

	onMount(async () => {
		const files = await FirestoreReadable.new<DocumentData>(files_ref);
		files.register_change_handler(document_change_handler);
		files_store = files;
	});

	$: console.log($files_store);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#each $files_store as file}
	<a href={file.download_url}>{file.name}</a>
{/each}

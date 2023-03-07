<script lang="ts">
	import { FirestoreReadable } from '$lib/firestore';
	import { collection, CollectionReference, query, type DocumentChange } from 'firebase/firestore';
	import { readable, type Readable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { firestore } from '../lib/firebase';
	import type { DocumentData } from 'makersync-common/types';
	import Header from '$lib/components/Header.svelte';
	import FilesGrid from '$lib/components/FilesGrid.svelte';
	import { this_machine_store } from '$lib/stores/this_machine_store';
	import { download_file } from '$lib/utils';

	const files_ref = query<DocumentData>(
		collection(firestore, '/files') as unknown as CollectionReference<DocumentData>
	);

	let files_store: Readable<DocumentData[]> = readable([]);
	

	function document_change_handler(snapshot: DocumentChange<DocumentData>) {
		const doc = snapshot.doc;
		console.log(`${doc.data().name}|${doc.data().download_url}`);

		// If the file type matches this_machine_store, automatically download it
		if (doc.data().target_machine === $this_machine_store) {
			console.log('Downloading file');
			download_file(doc.data().download_url, doc.data().name);
		}
	}

	onMount(async () => {
		const files = await FirestoreReadable.new<DocumentData>(files_ref);
		files.register_change_handler(document_change_handler);
		files_store = files;
	});

	$: console.log($files_store);
</script>	

<Header />

<FilesGrid files={$files_store}/>

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
	import FloatingQr from '$lib/components/FloatingQR.svelte';
	import { slide } from 'svelte/transition';
	import { prevent_close } from '$lib/prevent_close';
	import Titlebar from '$lib/components/Titlebar.svelte';

	const files_ref = query<DocumentData>(
		collection(firestore, '/files') as unknown as CollectionReference<DocumentData>
	);

	let files_store: Readable<DocumentData[]> = readable([]);

	interface AlertData {
		message: string;
		level: 'info' | 'success' | 'warning' | 'error';
		key: string;
	}

	let alerts: AlertData[] = [];

	function document_change_handler(snapshot: DocumentChange<DocumentData>) {
		const doc = snapshot.doc;
		console.log(`${doc.data().name}|${doc.data().download_url}`);

		// If the file type matches this_machine_store, automatically download it
		if (doc.data().target_machine === $this_machine_store) {
			alerts = [
				...alerts,
				{
					message: `Downloading ${doc.data().name}`,
					level: 'info',
					key: doc.id
				}
			];
			setTimeout(() => {
				alerts = alerts.filter((alert) => alert.key !== doc.id);
			}, 5000);
			download_file(doc.data().download_url, doc.data().name);
		}
	}

	onMount(async () => {
		prevent_close();
		const files = await FirestoreReadable.new<DocumentData>(files_ref);
		files.register_change_handler(document_change_handler);
		files_store = files;
	});
</script>

<Header />

<FilesGrid files={$files_store} />

<div class="toast toast-start">
	{#each alerts as alert (alert.key)}
		<div in:slide out:slide class="alert alert-{alert.level}">
			{alert.message}
		</div>
	{/each}
</div>

<FloatingQr />

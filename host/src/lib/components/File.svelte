<script lang="ts">
	import { this_machine_store } from '$lib/stores/this_machine_store';
	import { download_file } from '$lib/utils';
	import type { DocumentData } from 'makersync-common/types';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let file: DocumentData;

	// @ts-ignore
	const js_date: Date = file.creation_time.toDate();

	// Find out how many minutes ago the file was uploaded
	let minutes_ago = Math.floor((new Date().getTime() - js_date.getTime()) / 1000 / 60);

	let time_string: Writable<string> = writable('');

	// Setup a usetimeout to update the minutes ago every 30 seconds
	const timeout = setInterval(() => {
		const tiem = (new Date().getTime() - js_date.getTime()) / 1000 / 60
		minutes_ago = Math.floor(tiem);
		console.log(minutes_ago);
	}, 3000);


	$: {
		if (minutes_ago < 1) {
			$time_string = `Less than a minute ago`;
		} else if (minutes_ago < 2) {
			$time_string = `1 minute ago`;
		} else {
			$time_string = `${minutes_ago} minutes ago`;
		}
	}

	onMount(() => {
		return () => {
			clearInterval(timeout);
		};
	});

	function download() {
		download_file(file.download_url, file.name);
	}
</script>

<div class="card bg-base-300 shadow-xl border-solid border-blue-600" class:border-2={$this_machine_store === file.target_machine}>
	<div class="card-body gap-4">
		<h2 class="card-title overflow-hidden text-ellipsis whitespace-nowrap w-full">
			{file.name}
		</h2>
		<p>Uploaded: <span class="font-bold">{$time_string}</span></p>
		<div class="card-actions">
			<button class="btn btn-primary justify-self-start" on:click={download}>Download</button>
			<div class="badge badge-outline ml-auto">{file.target_machine}</div>
		</div>
	</div>
</div>

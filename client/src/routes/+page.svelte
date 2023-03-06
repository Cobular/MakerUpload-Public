<script lang="ts">
	import MachineSelect from '$lib/components/MachineSelect.svelte';
	import SendButton from '$lib/components/SendButton.svelte';
	import ShowInfo from '$lib/components/ShowInfo.svelte';
	import type { PageState } from '$lib/typescript/types';
	import { upload_file } from '$lib/typescript/upload';
	import FileSelect from '../lib/components/FileSelect.svelte';
	import StepCounter from '../lib/components/StepCounter.svelte';


	let page_state: PageState = {
		step: 1,
		file: null,
		target: null
	};

	let error: string | undefined = undefined

	let current_progress: number | undefined = undefined;

	function update_progress(cur_progress: number) {
		current_progress = cur_progress;
	}

	function reset() {
		current_progress = undefined;
		page_state = {
			step: 1,
			file: null,
			target: null
		};
		error = undefined;
	}
</script>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-3xl">
			<h1 class="text-5xl font-bold">MakerSync</h1>
			<p class="py-6">Send files to the Makerspace!</p>

			<div class="card bg-base-100 shadow-xl m-5">
				<div class="card-body max-w-sm w-screen gap-4">
					<StepCounter
						step={page_state.step}
						on:click_file={reset}
						on:click_target={() => {
							page_state.step = 2;
							page_state.target = null;
							current_progress = undefined;
						}}
					/>

					<ShowInfo data={page_state} />

					{#if page_state.step === 1}
						<FileSelect
							on:file_choose={(file) => {
								page_state.file = file.detail.file;
								page_state.step = 2;
							}}
						/>
					{:else if page_state.step === 2}
						<MachineSelect
							on:select_choose={(select) => {
								page_state.target = select.detail.machine;
								page_state.step = 3;
							}}
						/>
					{:else if page_state.step === 3}
						<SendButton
							on:send={() => {
								if (page_state.file === null || page_state.target === null) {
									throw new Error('File or target is null');
								}
								upload_file(page_state.file, page_state.target, update_progress, () => {
									reset()
									page_state.step = 4;
								}, () => {
									current_progress = 100;
									error = 'Error uploading file'
								});
							}}
						/>
						{#if current_progress !== undefined}
							<progress class="progress progress-primary" class:progress-error={error !== undefined} value={current_progress} max="100" />
						{/if}
					{:else if page_state.step === 4}
						<p class="text-center text-gray-500">File sent successfully!</p>
						<button
							class="btn btn-success"
							on:click={reset}
							on:keydown={reset}
						>
						Upload another file?
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

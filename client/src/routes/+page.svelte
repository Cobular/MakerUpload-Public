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

	let current_progress: number | undefined = undefined;
	let send_promise: Promise<unknown> | undefined = undefined;
	let send_enabled: boolean;

	function send() {
		if (page_state.file === null || page_state.target === null) {
			throw new Error('File or target is null');
		}
		[, send_promise] = upload_file(page_state.file, page_state.target, update_progress);
		send_promise.then(() => {
			page_state.step = 4;
		});
		send_promise.catch(() => {
			setTimeout(() => {
				send_enabled = true;
			}, 1000);
		});
		current_progress = 0;
	}

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
		send_promise = undefined;
		send_enabled = true;
	}
</script>

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content text-center">
		<div>
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
						<SendButton on:send={send} bind:enabled={send_enabled} />
						{#if send_promise !== undefined}
							{#await send_promise}
								<!-- send_promise is pending -->
								<progress class="progress progress-primary" value={current_progress} max="100" />
							{:then value}
								<!-- send_promise was fulfilled -->
								<progress class="progress progress-primary" value={100} max="100" />
							{:catch error}
								<!-- send_promise was rejected -->
								<progress class="progress progress-error" value={100} max="100" />
								<p class="text-center text-red-500">{error.message}</p>
							{/await}
						{/if}
					{:else if page_state.step === 4}
						<button class="btn btn-success" on:click={reset} on:keydown={reset}>
							Upload another file?
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

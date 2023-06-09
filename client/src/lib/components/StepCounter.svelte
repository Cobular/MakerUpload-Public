<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Typegen0 } from '$lib/typescript/states.typegen';
	import type { SendPropType, StatePropType } from '$lib/typescript/states';

	export let state: StatePropType;
	export let send: SendPropType;

	const back_to_file = createEventDispatcher<{ click_file: {} }>();
	const back_to_target = createEventDispatcher<{ click_target: {} }>();

	let can_click_file = false;
	$: can_click_file = state.can('BACK_TO_SELECT_FILES');

	let can_click_target = false;
	$: can_click_target = state.can('BACK_TO_SELECT_MACHINE');
</script>

<ul class="steps">
	<li
		class="step"
		class:step-primary={can_click_file}
		class:cursor-pointer={can_click_file}
		on:click={() => send('BACK_TO_SELECT_FILES')}
		on:keydown={() => send('BACK_TO_SELECT_FILES')}
	>
		File
	</li>
	<li
		class="step"
		class:step-primary={can_click_target}
		class:cursor-pointer={can_click_target}
		on:click={() => send('BACK_TO_SELECT_MACHINE')}
		on:keydown={() => send('BACK_TO_SELECT_MACHINE')}
	>
		Target
	</li>
	<li
		class="step"
		class:step-primary={(state.matches('upload') && !state.matches({ upload: 'waiting' })) ||
			state.matches('done')}
	>
		Send
	</li>
</ul>

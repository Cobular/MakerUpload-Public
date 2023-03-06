<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let step: 1 | 2 | 3 | 4;

	const back_to_file = createEventDispatcher<{ click_file: {} }>();
	const back_to_target = createEventDispatcher<{ click_target: {} }>();

  let can_click_file = step > 1;
  $: can_click_file = step > 1;
  let can_click_target = step > 2;
  $: can_click_target = step > 2;

	function handle_click_file() {
		if (can_click_file) {
			back_to_file('click_file');
		}
	}

	function handle_click_target() {
		if (can_click_target) {
			back_to_target('click_target');
		}
	}
</script>

<ul class="steps">
	<li
		class="step"
		class:step-primary={step >= 1}
    class:cursor-pointer={can_click_file}
		on:click={handle_click_file}
		on:keydown={handle_click_file}
	>
		File
	</li>
	<li
		class="step"
		class:step-primary={step >= 2}
    class:cursor-pointer={can_click_target}
		on:click={handle_click_target}
		on:keydown={handle_click_target}
	>
		Target
	</li>
	<li class="step" class:step-primary={step >= 3}>Send</li>
</ul>

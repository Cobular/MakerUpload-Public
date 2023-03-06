<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ send: {  } }>();

  let enabled = true;

  function handle_click() {
    if (enabled) {
      dispatch('send');
    }
    enabled = false;
  }
</script>

<button class="btn btn-primary" disabled={!enabled} on:click={handle_click} on:keydown={handle_click}>
  Upload!
</button>
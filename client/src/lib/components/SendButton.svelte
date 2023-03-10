<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from "svelte";
  const dispatch = createEventDispatcher<{ send: {  } }>();

  export let enabled = true;

  function handle_click() {
    if (enabled) {
      dispatch('send');
    }
    enabled = false;
  }

</script>

<button class="btn btn-primary" disabled={!enabled} on:click={handle_click} on:keydown={handle_click}>
  <p>Upload!</p>
</button>
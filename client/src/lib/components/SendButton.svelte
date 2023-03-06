<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ send: {  } }>();

  function handle_click() {
    dispatch('send');
  }
</script>

<button class="btn btn-primary" on:click={() => dispatch("send")} on:keydown={() => dispatch("send")}>
  Upload!
</button>
<script lang="ts">
  export let step: 1 | 2 | 3;
</script>

<ul class="steps pb-6">
  <li class="step" class:step-primary={step >= 1}>File</li>
  <li class="step" class:step-primary={step >= 2}>Target</li>
  <li class="step" class:step-primary={step >= 3}>Send</li>
</ul>
<script lang="ts">
  import QR from "$lib/media/qrcode.png"
</script>

<div class="absolute right-0 bottom-0 bg-base-200 rounded-tl-lg p-4 w-[20rem] max-w-[28vw] z-10">
  <img src={QR} class="w-full rounded-lg" alt="https://upload.cobular.com">
  <p class="text-center break-all font-mono">https://upload.cobular.com</p>
</div>

<style>
  img {
    image-rendering: pixelated;
  }
</style>
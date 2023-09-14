<script lang="ts">
	import { fbAuth } from '$lib/typescript/firebase';
	import {
		GoogleAuthProvider,
		signInAnonymously,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { SignedIn, SignedOut, userStore } from 'sveltefire';
	const dispatch = createEventDispatcher<{ send: {} }>();

	export let enabled = true;

	function handle_click() {
		if (enabled) {
			dispatch('send');
		}
		enabled = false;
	}

	const user = userStore(fbAuth);

	let signedIn = false;
	$: signedIn = user !== null || user !== undefined;

	console.log({ uid: $user?.uid });

  user.subscribe((user) => {
    console.log({ user });
  });
</script>


<SignedOut let:auth>
	<button class="btn" on:click={() => signInAnonymously(fbAuth)}>Sign In to Upload (why?)</button>
</SignedOut>
<SignedIn let:auth let:user={user2}>
	<button class="btn" on:click={() => signOut(fbAuth)}>Sign Out</button>
</SignedIn>
<button
	class="btn btn-primary"
	class:btn-disabled={!signedIn || !enabled}
	disabled={!signedIn || !enabled}
	on:click={handle_click}
	on:keydown={handle_click}
>
	<p>Upload!</p>
</button>

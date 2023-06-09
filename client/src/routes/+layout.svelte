<script>
	import { browser, dev } from '$app/environment';
	import '../app.postcss';

	import * as Sentry from '@sentry/svelte';
	import { BrowserTracing } from '@sentry/tracing';

	// Initialize the Sentry SDK here
	if (!dev) {
		Sentry.init({
			dsn: 'https://4954237dfa3c4c2596251f8dce5c018f@o4504879295627264.ingest.sentry.io/4504879296610304',
			integrations: [new BrowserTracing()],

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0
		});

		Sentry.setTag('svelteKit', 'client-browser');
	}
</script>

<slot />

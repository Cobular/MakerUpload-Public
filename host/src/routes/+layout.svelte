<script>
	import '../app.postcss';

	import * as Sentry from '@sentry/svelte';
	import { BrowserTracing } from '@sentry/tracing';

	// Only init if in tauri
	if (window.__TAURI__) {
		Sentry.init({
			dsn: 'https://4005a33ef96f435e888370c4bfb9bd34@o4504879295627264.ingest.sentry.io/4504879342288896',
			integrations: [new BrowserTracing()],

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0
		});
	}
</script>

<slot />

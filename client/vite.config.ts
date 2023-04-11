import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const prod = process.env.VERCEL_ENV === "PRODUCTION";

export default defineConfig({
	build: {
		sourcemap: true
	},
	plugins: [
		sveltekit(),
		// Put the Sentry vite plugin after all other plugins
		prod && sentryVitePlugin({
			org: 'ucla-makerspace',
			project: 'user-client',

			// Specify the directory containing build artifacts
			include: './dist',

			// Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
			// and need `project:releases` and `org:read` scopes
			authToken: process.env.SENTRY_AUTH_TOKEN

			// Optionally uncomment the line below to override automatic release name detection
			// release: process.env.RELEASE,
		})
	]
});

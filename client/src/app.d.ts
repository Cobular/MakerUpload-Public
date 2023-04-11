// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
export declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	interface Window {
		umami: {
			trackEvent: (
				event: string,
				data?: Record<string, string>,
				url?: string,
				website_id?: string
			) => void;
			trackView: (
				url: string,
				referrer:? string,
				website_id?: string
			) => void;
		}
	}
}

window.umami = window.umami || {}

export {};

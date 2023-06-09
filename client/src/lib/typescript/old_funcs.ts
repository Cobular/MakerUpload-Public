export function umami_event(name: string, data: Record<string, string>) {
		const umami = window.umami;
		if (umami !== undefined) {
			umami.trackEvent(name, data);
		}
	}
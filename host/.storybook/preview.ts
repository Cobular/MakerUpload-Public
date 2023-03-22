import type { Preview } from '@storybook/svelte';
import '../src/app.postcss'; // replace with the name of your tailwind css file

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		}
	}
};

export default preview;

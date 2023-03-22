import type { Meta, StoryObj } from '@storybook/svelte';

import File from '$lib/components/File.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'Grid/File',
	component: File,
	tags: ['autodocs']
} satisfies Meta<File>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const JustUploaded: Story = {
	args: {
		file: {
			creation_time: {toDate: () => new Date()},
			download_url: 'https://cf-worker.cobular.workers.dev/files?uuid=1234',
			target_machine: 'Sewing',
			name: 'test file',
			uid: '1234'
		}
	}
};
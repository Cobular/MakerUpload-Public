import type { Meta, StoryObj } from '@storybook/svelte';

import FilesGrid from '$lib/components/FilesGrid.svelte';
import type { DocumentData } from 'makersync-common/types';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'Grid/FilesGrid',
	component: FilesGrid,
	tags: ['autodocs']
} satisfies Meta<FilesGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const file: DocumentData = {
	creation_time: { toDate: () => new Date() },
	download_url: 'https://cf-worker.cobular.workers.dev/files?uuid=1234',
	target_machine: 'Sewing',
	name: 'test file',
	uid: '1234'
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const MinGrid: Story = {
	args: {
		files: [file, file, file]
	}
};
